from typing import TypeVar, Type, List, AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from fastapi import HTTPException
from contextlib import asynccontextmanager

from .abstract_manager import AbstractDatabaseManager
from ..models.base import SparkBytesModel
from ..models.list_request import ListRequest
from ..models.error_models import ErrorDetail

T = TypeVar("T", bound=SparkBytesModel)

class SQLiteManager(AbstractDatabaseManager[T]):
    def __init__(self, session_factory: callable, model: Type[T]):
        self._session_factory = session_factory  # This is get_session
        self.model = model

    @property
    def name(self) -> str:
        return self.model.__tablename__

    @property
    def model_type(self) -> Type[T]:
        return self.model

    async def create(self, items: List[T]) -> List[T]:
        """Create new items in the database."""
        async with self._session_factory() as session:
            session.add_all(items)
            await session.commit()
            for item in items:
                await session.refresh(item)
            return items

    async def put(self, id: str, item: T) -> T:
        async with self._session_factory() as session:
            db_item = await session.get(self.model, id)
            if not db_item:
                raise HTTPException(
                    status_code=404,
                    detail=ErrorDetail(
                        message=f"Item '{id}' not found in table '{self.name}'",
                    ).model_dump()
                )
            # Update db_item with data from item
            update_data = item.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_item, key, value)
            await session.commit()
            await session.refresh(db_item)
            return db_item

    async def get(self, id: str) -> T:
        async with self._session_factory() as session:
            db_item = await session.get(self.model, id)
            if not db_item:
                raise HTTPException(
                    status_code=404,
                    detail=ErrorDetail(
                        message=f"Item '{id}' not found in table '{self.name}'",
                    ).model_dump()
                )
            return db_item

    async def list(self, list_request: ListRequest) -> List[T]:
        async with self._session_factory() as session:
            query = select(self.model)
            if list_request.user_id:
                query = query.where(self.model.user_id == list_request.user_id)

            # Apply ordering
            order_column = getattr(self.model, list_request.order_by)
            if list_request.order == "asc":
                query = query.order_by(order_column.asc())
            else:
                query = query.order_by(order_column.desc())

            # Apply pagination
            if list_request.after_id:
                after_item = await session.get(self.model, list_request.after_id)
                if after_item:
                    query = query.where(order_column > getattr(after_item, list_request.order_by))
                else:
                    raise HTTPException(
                        status_code=404,
                        detail=ErrorDetail(
                            message=f"Item '{list_request.after_id}' not found in table '{self.name}'",
                        ).model_dump()
                    )
            if list_request.before_id:
                before_item = await session.get(self.model, list_request.before_id)
                if before_item:
                    query = query.where(order_column < getattr(before_item, list_request.order_by))
                else:
                    raise HTTPException(
                        status_code=404,
                        detail=ErrorDetail(
                            message=f"Item '{list_request.before_id}' not found in table '{self.name}'",
                        ).model_dump()
                    )

            query = query.limit(list_request.limit)
            result = await session.execute(query)
            items = result.scalars().all()
            return list(items)

    async def delete(self, id: str) -> T:
        async with self._session_factory() as session:
            db_item = await session.get(self.model, id)
            if not db_item:
                raise HTTPException(
                    status_code=404,
                    detail=ErrorDetail(
                        message=f"Item '{id}' not found in table '{self.name}'",
                    ).model_dump()
                )
            await session.delete(db_item)
            await session.commit()
            return db_item

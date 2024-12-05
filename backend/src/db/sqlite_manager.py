from typing import TypeVar, Type, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from fastapi import HTTPException

from .abstract_manager import AbstractDatabaseManager
from ..models.base import SparkBytesModel
from ..models.list_request import ListRequest
from ..models.error_models import ErrorDetail

T = TypeVar("T", bound=SparkBytesModel)

class SQLiteManager(AbstractDatabaseManager[T]):
    def __init__(self, session_factory: callable, model: Type[T], primary_key: str = "id"):
        self._session_factory = session_factory  # Dependency-injected session factory
        self.model = model
        self.primary_key = primary_key  # Specify the primary key field

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

    async def put(self, identifier: str, item: T) -> T:
        """Update an existing item by identifier."""
        async with self._session_factory() as session:
            query = select(self.model).where(getattr(self.model, self.primary_key) == identifier)
            result = await session.execute(query)
            db_item = result.scalar_one_or_none()
            if not db_item:
                raise HTTPException(
                    status_code=404,
                    detail=ErrorDetail(
                        message=f"Item with {self.primary_key} '{identifier}' not found in table '{self.name}'",
                    ).model_dump()
                )
            # Update fields selectively from the incoming item
            update_data = item.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_item, key, value)
            await session.commit()
            await session.refresh(db_item)
            return db_item

    async def get(self, identifier: str) -> T:
        """Retrieve an item by identifier."""
        async with self._session_factory() as session:
            query = select(self.model).where(getattr(self.model, self.primary_key) == identifier)
            result = await session.execute(query)
            db_item = result.scalar_one_or_none()
            if not db_item:
                raise HTTPException(
                    status_code=404,
                    detail=ErrorDetail(
                        message=f"Item with {self.primary_key} '{identifier}' not found in table '{self.name}'",
                    ).model_dump()
                )
            return db_item

    async def list(self, list_request: ListRequest) -> List[T]:
        """Retrieve a list of items based on the provided criteria."""
        async with self._session_factory() as session:
            query = select(self.model)
            if list_request.user_id:
                query = query.where(self.model.user_id == list_request.user_id)

            # Apply ordering
            order_column = getattr(self.model, list_request.order_by)
            query = query.order_by(order_column.asc() if list_request.order == "asc" else order_column.desc())

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

    async def delete(self, identifier: str) -> T:
        """Delete an item by identifier."""
        async with self._session_factory() as session:
            query = select(self.model).where(getattr(self.model, self.primary_key) == identifier)
            result = await session.execute(query)
            db_item = result.scalar_one_or_none()
            if not db_item:
                raise HTTPException(
                    status_code=404,
                    detail=ErrorDetail(
                        message=f"Item with {self.primary_key} '{identifier}' not found in table '{self.name}'",
                    ).model_dump()
                )
            await session.delete(db_item)
            await session.commit()
            return db_item
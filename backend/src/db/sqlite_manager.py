from typing import TypeVar, Type, List

from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from fastapi import HTTPException

from .abstract_manager import AbstractDatabaseManager
from ..models.base import SparkBytesModel
from ..models.list_request import ListRequest
from ..models.error_models import ErrorDetail

T = TypeVar("T", bound=SparkBytesModel)

class SQLiteManager(AbstractDatabaseManager[T]):
    def __init__(self, session: AsyncSession, model: Type[T]):
        self.session = session
        self.model = model

    @property
    def name(self) -> str:
        return self.model.__tablename__

    @property
    def model_type(self) -> Type[T]:
        return self.model

    async def create(self, items: List[T]) -> List[T]:
        self.session.add_all(items)
        await self.session.commit()
        for item in items:
            await self.session.refresh(item)
        return items

    async def put(self, id: str, item: T) -> T:
        db_item = await self.session.get(self.model, id)
        if not db_item:
            raise HTTPException(
                status_code=404,
                detail=ErrorDetail(
                    message=f"Item '{id}' not found in table '{self.name}'",
                ).model_dump()
            )
        item.id = id  # Ensure the item has the correct ID
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def get(self, id: str) -> T:
        db_item = await self.session.get(self.model, id)
        if not db_item:
            raise HTTPException(
                status_code=404,
                detail=ErrorDetail(
                    message=f"Item '{id}' not found in table '{self.name}'",
                ).model_dump()
            )
        return db_item

    async def list(self, list_request: ListRequest) -> List[T]:
        query = select(self.model).where(self.model.user_id == list_request.user_id)

        # Apply ordering
        order_column = getattr(self.model, list_request.order_by)
        if list_request.order == "asc":
            query = query.order_by(order_column.asc())
        else:
            query = query.order_by(order_column.desc())

        # Apply pagination
        if list_request.after_id:
            after_item = await self.session.get(self.model, list_request.after_id)
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
            before_item = await self.session.get(self.model, list_request.before_id)
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
        result = await self.session.execute(query)
        items = result.scalars().all()
        return list(items)

    async def delete(self, id: str) -> T:
        db_item = await self.session.get(self.model, id)
        if not db_item:
            raise HTTPException(
                status_code=404,
                detail=ErrorDetail(
                    message=f"Item '{id}' not found in table '{self.name}'",
                ).model_dump()
            )
        await self.session.delete(db_item)
        await self.session.commit()
        return db_item

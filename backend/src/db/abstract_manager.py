from abc import ABC, abstractmethod
from typing import Generic, List, Type, TypeVar

from ..models.base import SparkBytesModel
from ..models.list_request import ListRequest

T = TypeVar("T", bound=SparkBytesModel)


class AbstractDatabaseManager(ABC, Generic[T]):
    """
    Abstraction over a datatype saved with a unique id and a user id
    """

    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def model_type(self) -> Type[T]:
        pass

    @abstractmethod
    async def create(self, items: List[T]) -> List[T]:
        pass

    @abstractmethod
    async def put(self, id: str, item: T) -> T:
        pass

    @abstractmethod
    async def get(self, id: str) -> T:
        pass

    @abstractmethod
    async def list(self, list_request: ListRequest) -> List[T]:
        pass

    @abstractmethod
    async def delete(self, id: str) -> T:
        pass

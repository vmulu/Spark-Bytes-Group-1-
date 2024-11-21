from typing import List, TypeVar

from fastapi import APIRouter, HTTPException

from ..db.abstract_manager import AbstractDatabaseManager
from ..models.list_request import ListRequest

T = TypeVar("T")


class DatabaseEndpointGenerator:
    def __init__(self, router: APIRouter = APIRouter()):
        self.router = router

    def register_table(
        self,
        handler: AbstractDatabaseManager[T],
        enabled_methods: List[str] = None,
    ):
        """
        Register a datastream handler for a specific type. This method is responsible for
        setting up the routes for the datastream handler.

        Args:
            handler (DataStreamHandler[T]): The handler for the datastream
            enabled_methods (List[str], optional): The methods to enable for the datastream. Defaults to all.
        """
        if enabled_methods is None:
            enabled_methods = ["post", "put", "get", "list", "delete"]

        if "post" in enabled_methods:
            @self.router.post(
                f"/database/{handler.name}",
                response_model=handler.model_type,
                summary=f"Create and save new {handler.name}",
                tags=["datastream"],
            )
            async def create(items: List[handler.model_type]) -> List[handler.model_type]:
                try:
                    return await handler.create(items)
                except HTTPException as e:
                    raise e
                except Exception as e:
                    print(e)
                    raise HTTPException(
                        status_code=500,
                        detail=f"Internal server error: {str(e)}",
                    )


        if "put" in enabled_methods:
            @self.router.put(
                f"/database/{handler.name}/{{item_id}}",
                response_model=handler.model_type,
                summary=f"Update {handler.name} by id",
                tags=["datastream"],
            )
            async def put_item(item_id: str, item: handler.model_type) -> handler.model_type:
                try:
                    return await handler.put(item_id, item)
                except HTTPException as e:
                    raise e
                except Exception as e:
                    print(e)
                    raise HTTPException(
                        status_code=500,
                        detail=f"Internal server error: {str(e)}",
                    )

        if "get" in enabled_methods:
            @self.router.get(
                f"/database/{handler.name}/{{item_id}}",
                response_model=handler.model_type,
                summary=f"Get {handler.name} by id",
                tags=["datastream"],
            )
            async def get_item(item_id: str) -> handler.model_type:
                try:
                    return await handler.get(item_id)
                except HTTPException as e:
                    raise e
                except Exception as e:
                    print(e)
                    raise HTTPException(
                        status_code=500,
                        detail=f"Internal server error: {str(e)}",
                    )

        if "list" in enabled_methods:
            @self.router.post(
                f"/database/{handler.name}/list",
                response_model=List[handler.model_type],
                summary=f"List all {handler.name} items",
                tags=["datastream"],
            )
            async def list_items(list_request: ListRequest) -> List[handler.model_type]:
                try:
                    return await handler.list(list_request)
                except HTTPException as e:
                    raise e
                except Exception as e:
                    print(e)
                    raise HTTPException(
                        status_code=500,
                        detail=f"Internal server error: {str(e)}",
                    )

        if "delete" in enabled_methods:
            @self.router.delete(
                f"/database/{handler.name}/{{item_id}}",
                response_model=handler.model_type,
                summary=f"Delete {handler.name} by id",
                tags=["datastream"],
            )
            async def delete_item(item_id: str) -> handler.model_type:
                try:
                    return await handler.delete(item_id)
                except HTTPException as e:
                    raise e
                except Exception as e:
                    print(e)
                    raise HTTPException(
                        status_code=500,
                        detail=f"Internal server error: {str(e)}",
                    )

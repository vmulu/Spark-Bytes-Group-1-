from pydantic import BaseModel, Field
from typing import Annotated, Literal, Optional
from uuid import UUID


class ListRequest(BaseModel):
    user_id: Annotated[UUID, Field(
        ...,
        description="The unique identifier for the user that this data belongs to",
        examples=["AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"]
    )]
    # Limit to 100 items to avoid abuse/attacks
    limit: Annotated[int, Field(
        100,
        description="The maximum number of items to return",
        le=100,
        examples=[100]
    )]
    order: Annotated[Literal["asc", "desc"], Field(
        "desc",
        description="The order in which to return the items",
        examples=["desc"]
    )]
    order_by: Annotated[str, Field(
        "created_at",
        description="The field to order the items by",
        examples=["created_at"]
    )]
    after_id: Annotated[Optional[str], Field(
        None,
        description="The id of the item to start the list from (this item will not be included in the response)",
        examples=["abcdefghijklmnopqrstuvwxyz"]
    )]
    before_id: Annotated[Optional[str], Field(
        None,
        description="The id of the item to end the list at (this item will not be included in the response)",
        examples=["abcdefghijklmnopqrstuvwxyz"]
    )]

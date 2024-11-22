import time
import uuid
from typing import Annotated

from sqlmodel import SQLModel, Field
from uuid import UUID


def get_current_timestamp():
    return int(time.time())


class SparkBytesModel(SQLModel):
    """
    Base class for all SQL objects
    """
    user_id: Annotated[str, Field(
        ...,
        description="The unique identifier for the user that this data belongs to",
        index=True,
    )]
    id: Annotated[str, Field(
        default_factory=uuid.uuid4,
        description="The unique identifier for this item of data",
        index=True,
        primary_key=True,
    )]
    created_at: Annotated[int, Field(
        default_factory=get_current_timestamp,
        description="The unix timestamp of when this item of data was created, used internally for sorting",
        index=True,
    )]

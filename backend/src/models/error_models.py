from typing import Annotated

from pydantic import BaseModel, Field



class ErrorDetail(BaseModel):
    message: Annotated[str, Field(
        ...,
        description="A human-readable error message describing the problem",
        examples=["Invalid input: 'to_number' must be in E.164 format"]
    )]

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "message": "Authentication failed: Invalid or expired token"
                }
            ]
        }
    }
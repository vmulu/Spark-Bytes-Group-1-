from ..models.base import SparkBytesModel


class User(SparkBytesModel, table=True):
    __tablename__ = "users"

    is_vegan: bool

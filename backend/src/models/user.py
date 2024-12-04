from ..models.base import SparkBytesModel


class User(SparkBytesModel, table=True):
    __tablename__ = "users"

    is_vegan: bool
    is_halal: bool
    is_vegetarian: bool
    is_gluten_free: bool

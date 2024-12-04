from ..models.base import SparkBytesModel


class Event(SparkBytesModel, table=True):
    __tablename__ = "events"

    name: str
    description: str
    location: str
    latitude: float
    longitude: float
    start_time: str  # ISO date string
    end_time: str  # ISO date string
    is_vegan: bool
    is_halal: bool
    is_vegetarian: bool
    is_gluten_free: bool

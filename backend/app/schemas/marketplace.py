from pydantic import BaseModel
from typing import Optional, List

class ApiSubmitSchema(BaseModel):
    name: str
    description: str
    category: str
    base_url: str
    logo: Optional[str] = None
    plan: str = "Free"
    tags: List[str] = []

class ApiRatingSchema(BaseModel):
    rating: float

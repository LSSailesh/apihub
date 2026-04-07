from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ApiListing(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    category: str
    base_url: str
    logo: Optional[str] = None
    plan: str = "Free"
    rating: float = 0.0
    rating_count: int = 0
    tags: List[str] = []
    submitted_by: Optional[str] = None
    approved: bool = False
    created_at: datetime = datetime.utcnow()

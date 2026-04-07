from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AddKeySchema(BaseModel):
    name: str
    service: str
    key_value: str
    environment: str = "Development"
    tags: List[str] = []
    expires_at: Optional[datetime] = None

class UpdateKeySchema(BaseModel):
    name: Optional[str] = None
    environment: Optional[str] = None
    tags: Optional[List[str]] = None
    expires_at: Optional[datetime] = None

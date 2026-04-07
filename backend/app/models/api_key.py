from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ApiKey(BaseModel):
    id: Optional[str] = None
    user_id: str
    name: str
    service: str
    encrypted_key: str
    environment: str = "Development"
    tags: List[str] = []
    expires_at: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()

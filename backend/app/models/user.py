from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserModel(BaseModel):
    id: Optional[str] = None
    name: str
    email: EmailStr
    password: str
    avatar: Optional[str] = None
    created_at: datetime = datetime.utcnow()

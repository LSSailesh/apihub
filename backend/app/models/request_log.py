from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RequestLog(BaseModel):
    id: Optional[str] = None
    user_id: str
    method: str
    url: str
    status_code: int
    response_time_ms: float
    api_name: Optional[str] = None
    created_at: datetime = datetime.utcnow()

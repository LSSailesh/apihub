from pydantic import BaseModel
from typing import Optional

class TesterRequestSchema(BaseModel):
    method: str
    url: str
    headers: Optional[dict] = {}
    params: Optional[dict] = {}
    body: Optional[dict] = None
    api_name: Optional[str] = None

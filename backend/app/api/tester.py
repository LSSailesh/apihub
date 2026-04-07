from fastapi import APIRouter, Depends
from app.schemas.analytics import TesterRequestSchema
from app.services.tester_service import proxy_request
from app.core.dependencies import get_current_user

router = APIRouter()

@router.post("/send")
async def send_request(data: TesterRequestSchema, user=Depends(get_current_user)):
    try:
        result = await proxy_request(data, user["_id"])
        return result
    except Exception as e:
        return {"error": str(e)}

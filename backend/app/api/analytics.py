from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
import io
from app.core.dependencies import get_current_user
from app.services import analytics_service

router = APIRouter()

@router.get("/summary")
async def summary(user=Depends(get_current_user)):
    return await analytics_service.get_summary(user["_id"])

@router.get("/logs")
async def logs(user=Depends(get_current_user)):
    return await analytics_service.get_recent_logs(user["_id"])

@router.get("/usage-by-api")
async def usage_by_api(user=Depends(get_current_user)):
    return await analytics_service.get_usage_by_api(user["_id"])

@router.get("/export")
async def export_csv(user=Depends(get_current_user)):
    csv_data = await analytics_service.export_logs_csv(user["_id"])
    return StreamingResponse(
        io.StringIO(csv_data),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=apihub_logs.csv"},
    )

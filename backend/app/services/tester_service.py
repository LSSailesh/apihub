import httpx
import time
from app.db.mongodb import get_database
from app.schemas.analytics import TesterRequestSchema
import uuid

async def proxy_request(data: TesterRequestSchema, user_id: str):
    start = time.time()
    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.request(
                method=data.method.upper(),
                url=data.url,
                headers=data.headers or {},
                params=data.params or {},
                json=data.body if data.body else None,
            )
        elapsed = round((time.time() - start) * 1000, 2)

        await log_request(user_id, data, response.status_code, elapsed)

        return {
            "status_code": response.status_code,
            "headers": dict(response.headers),
            "body": response.text,
            "response_time_ms": elapsed,
        }
    except httpx.RequestError as e:
        raise Exception(f"Request failed: {str(e)}")

async def log_request(user_id: str, data: TesterRequestSchema, status_code: int, response_time_ms: float):
    db = get_database()
    log = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "method": data.method.upper(),
        "url": data.url,
        "status_code": status_code,
        "response_time_ms": response_time_ms,
        "api_name": data.api_name or "",
    }
    await db["request_logs"].insert_one(log)

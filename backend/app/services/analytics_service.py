import csv
import io
from app.db.mongodb import get_database

async def get_summary(user_id: str):
    db = get_database()
    logs = await db["request_logs"].find({"user_id": user_id}).to_list(1000)
    total = len(logs)
    errors = sum(1 for l in logs if l["status_code"] >= 400)
    avg_time = round(sum(l["response_time_ms"] for l in logs) / total, 2) if total else 0
    keys_count = await db["api_keys"].count_documents({"user_id": user_id})
    return {
        "total_requests": total,
        "error_count": errors,
        "avg_response_time_ms": avg_time,
        "active_keys": keys_count,
    }

async def get_recent_logs(user_id: str, limit: int = 20):
    db = get_database()
    logs = await db["request_logs"].find(
        {"user_id": user_id}, {"_id": 0}
    ).sort("created_at", -1).limit(limit).to_list(limit)
    return logs

async def get_usage_by_api(user_id: str):
    db = get_database()
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$group": {"_id": "$api_name", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    result = await db["request_logs"].aggregate(pipeline).to_list(10)
    return [{"api": r["_id"], "count": r["count"]} for r in result]

async def export_logs_csv(user_id: str):
    db = get_database()
    logs = await db["request_logs"].find(
        {"user_id": user_id}, {"_id": 0}
    ).sort("created_at", -1).to_list(1000)

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["method", "url", "status_code", "response_time_ms", "api_name", "created_at"])
    writer.writeheader()
    for log in logs:
        writer.writerow({
            "method": log.get("method", ""),
            "url": log.get("url", ""),
            "status_code": log.get("status_code", ""),
            "response_time_ms": log.get("response_time_ms", ""),
            "api_name": log.get("api_name", ""),
            "created_at": log.get("created_at", ""),
        })
    return output.getvalue()

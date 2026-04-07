from fastapi import APIRouter, Depends, Query
from app.schemas.marketplace import ApiSubmitSchema, ApiRatingSchema
from app.core.dependencies import get_current_user
from app.db.mongodb import get_database
import uuid

router = APIRouter()

@router.get("/")
async def list_apis(
    category: str = Query(None),
    search: str = Query(None),
    sort: str = Query("popular"),
):
    db = get_database()
    query = {"approved": True}
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    sort_field = "rating" if sort == "popular" else "created_at"
    apis = await db["api_listings"].find(query).sort(sort_field, -1).to_list(100)
    for api in apis:
        api["id"] = api.pop("_id")
    return apis

@router.get("/{api_id}")
async def get_api(api_id: str):
    db = get_database()
    api = await db["api_listings"].find_one({"_id": api_id})
    if not api:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="API not found")
    api["id"] = api.pop("_id")
    return api

@router.post("/submit")
async def submit_api(data: ApiSubmitSchema, user=Depends(get_current_user)):
    db = get_database()
    listing = {
        "_id": str(uuid.uuid4()),
        **data.model_dump(),
        "submitted_by": user["_id"],
        "approved": False,
        "rating": 0.0,
        "rating_count": 0,
    }
    await db["api_listings"].insert_one(listing)
    return {"message": "API submitted for review"}

@router.post("/{api_id}/rate")
async def rate_api(api_id: str, data: ApiRatingSchema, user=Depends(get_current_user)):
    db = get_database()
    api = await db["api_listings"].find_one({"_id": api_id})
    if not api:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="API not found")
    new_count = api["rating_count"] + 1
    new_rating = ((api["rating"] * api["rating_count"]) + data.rating) / new_count
    await db["api_listings"].update_one(
        {"_id": api_id},
        {"$set": {"rating": round(new_rating, 2), "rating_count": new_count}},
    )
    return {"message": "Rating submitted"}

@router.post("/{api_id}/favorite")
async def toggle_favorite(api_id: str, user=Depends(get_current_user)):
    db = get_database()
    existing = await db["favorites"].find_one({"user_id": user["_id"], "api_id": api_id})
    if existing:
        await db["favorites"].delete_one({"_id": existing["_id"]})
        return {"favorited": False}
    await db["favorites"].insert_one({"_id": str(uuid.uuid4()), "user_id": user["_id"], "api_id": api_id})
    return {"favorited": True}

@router.get("/user/favorites")
async def get_favorites(user=Depends(get_current_user)):
    db = get_database()
    favs = await db["favorites"].find({"user_id": user["_id"]}).to_list(100)
    api_ids = [f["api_id"] for f in favs]
    apis = await db["api_listings"].find({"_id": {"$in": api_ids}}).to_list(100)
    for api in apis:
        api["id"] = api.pop("_id")
    return apis

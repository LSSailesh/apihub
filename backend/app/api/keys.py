from fastapi import APIRouter, Depends
from app.schemas.keys import AddKeySchema, UpdateKeySchema
from app.core.dependencies import get_current_user
from app.services.encryption_service import encrypt, decrypt
from app.db.mongodb import get_database
import uuid

router = APIRouter()

@router.get("/")
async def list_keys(user=Depends(get_current_user)):
    db = get_database()
    keys = await db["api_keys"].find({"user_id": user["_id"]}).to_list(100)
    for key in keys:
        key["id"] = key.pop("_id")
        key.pop("encrypted_key", None)
    return keys

@router.post("/")
async def add_key(data: AddKeySchema, user=Depends(get_current_user)):
    db = get_database()
    key_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user["_id"],
        "name": data.name,
        "service": data.service,
        "encrypted_key": encrypt(data.key_value),
        "environment": data.environment,
        "tags": data.tags,
        "expires_at": data.expires_at,
    }
    await db["api_keys"].insert_one(key_doc)
    return {"message": "Key added successfully"}

@router.get("/{key_id}/reveal")
async def reveal_key(key_id: str, user=Depends(get_current_user)):
    db = get_database()
    key = await db["api_keys"].find_one({"_id": key_id, "user_id": user["_id"]})
    if not key:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Key not found")
    return {"key": decrypt(key["encrypted_key"])}

@router.patch("/{key_id}")
async def update_key(key_id: str, data: UpdateKeySchema, user=Depends(get_current_user)):
    db = get_database()
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    await db["api_keys"].update_one({"_id": key_id, "user_id": user["_id"]}, {"$set": update_data})
    return {"message": "Key updated"}

@router.delete("/{key_id}")
async def delete_key(key_id: str, user=Depends(get_current_user)):
    db = get_database()
    await db["api_keys"].delete_one({"_id": key_id, "user_id": user["_id"]})
    return {"message": "Key deleted"}

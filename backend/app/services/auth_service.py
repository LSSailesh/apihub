from app.db.mongodb import get_database
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import RegisterSchema, LoginSchema
from fastapi import HTTPException, status
import uuid

async def register_user(data: RegisterSchema):
    db = get_database()
    existing = await db["users"].find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = {
        "_id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
    }
    await db["users"].insert_one(user)
    token = create_access_token({"sub": user["_id"]})
    return {"access_token": token, "token_type": "bearer"}

async def login_user(data: LoginSchema):
    db = get_database()
    user = await db["users"].find_one({"email": data.email})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["_id"]})
    return {"access_token": token, "token_type": "bearer"}

async def get_profile(user: dict):
    return {
        "id": user["_id"],
        "name": user["name"],
        "email": user["email"],
        "avatar": user.get("avatar"),
    }

from fastapi import APIRouter, Depends
from app.schemas.auth import RegisterSchema, LoginSchema
from app.services import auth_service
from app.core.dependencies import get_current_user

router = APIRouter()

@router.post("/register")
async def register(data: RegisterSchema):
    return await auth_service.register_user(data)

@router.post("/login")
async def login(data: LoginSchema):
    return await auth_service.login_user(data)

@router.get("/me")
async def me(user=Depends(get_current_user)):
    return await auth_service.get_profile(user)

from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from app.services.oauth_service import get_github_user, get_google_user, handle_oauth_user
from app.core.config import settings

router = APIRouter()

@router.get("/github")
def github_login():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize"
        f"?client_id={settings.GITHUB_CLIENT_ID}"
        f"&scope=user:email"
    )

@router.get("/github/callback")
async def github_callback(code: str):
    user_data = await get_github_user(code)
    token = await handle_oauth_user(**user_data)
    return RedirectResponse(f"{settings.FRONTEND_URL}/oauth/success?token={token}")

@router.get("/google")
def google_login():
    return RedirectResponse(
        f"https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={settings.FRONTEND_URL}/auth/google/callback"
        f"&response_type=code"
        f"&scope=openid%20email%20profile"
    )

@router.get("/google/callback")
async def google_callback(code: str):
    user_data = await get_google_user(code)
    token = await handle_oauth_user(**user_data)
    return RedirectResponse(f"{settings.FRONTEND_URL}/oauth/success?token={token}")

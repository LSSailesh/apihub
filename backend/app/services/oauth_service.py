import httpx
import uuid
from app.db.mongodb import get_database
from app.core.security import create_access_token
from app.core.config import settings

async def handle_oauth_user(email: str, name: str, avatar: str = None):
    db = get_database()
    user = await db["users"].find_one({"email": email})
    if not user:
        user = {
            "_id": str(uuid.uuid4()),
            "name": name,
            "email": email,
            "password": "",
            "avatar": avatar,
        }
        await db["users"].insert_one(user)
    token = create_access_token({"sub": user["_id"]})
    return token

async def get_github_user(code: str):
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        access_token = token_res.json().get("access_token")

        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        user_data = user_res.json()

        email_res = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        emails = email_res.json()
        primary_email = next((e["email"] for e in emails if e["primary"]), None)

    return {
        "email": primary_email or user_data.get("email"),
        "name": user_data.get("name") or user_data.get("login"),
        "avatar": user_data.get("avatar_url"),
    }

async def get_google_user(code: str):
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": f"{settings.FRONTEND_URL}/auth/google/callback",
                "grant_type": "authorization_code",
            },
        )
        access_token = token_res.json().get("access_token")

        user_res = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        user_data = user_res.json()

    return {
        "email": user_data.get("email"),
        "name": user_data.get("name"),
        "avatar": user_data.get("picture"),
    }

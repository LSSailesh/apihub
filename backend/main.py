from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, marketplace, tester, keys, analytics, oauth, sandbox
from app.db.mongodb import connect_db, close_db

app = FastAPI(title="APIHub", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_event_handler("startup", connect_db)
app.add_event_handler("shutdown", close_db)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(oauth.router, prefix="/api/oauth", tags=["OAuth"])
app.include_router(marketplace.router, prefix="/api/marketplace", tags=["Marketplace"])
app.include_router(tester.router, prefix="/api/tester", tags=["Tester"])
app.include_router(keys.router, prefix="/api/keys", tags=["Keys"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])
app.include_router(sandbox.router, prefix="/api/sandbox", tags=["Sandbox"])
@app.get("/")
def root():
    return {"message": "APIHub is running"}

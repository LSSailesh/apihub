import base64
from cryptography.fernet import Fernet
from app.core.config import settings

def get_fernet():
    key = settings.ENCRYPTION_KEY.encode()
    key = base64.urlsafe_b64encode(key[:32].ljust(32, b"0"))
    return Fernet(key)

def encrypt(value: str) -> str:
    return get_fernet().encrypt(value.encode()).decode()

def decrypt(value: str) -> str:
    return get_fernet().decrypt(value.encode()).decode()

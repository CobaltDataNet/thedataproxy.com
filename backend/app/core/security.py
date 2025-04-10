# app/core/security.py
from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Dict
import jwt
from passlib.context import CryptContext
from jose import JWTError
from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

def create_access_token(subject: str | Any, expires_delta: timedelta) -> str:
    """Create a JWT access token"""
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate a password hash"""
    return pwd_context.hash(password)

def generate_api_key(user_id: str) -> str:
    """Generate a secure API key tied to a user"""
    to_encode = {
        "user_id": user_id,
        "iat": datetime.now(timezone.utc).timestamp(),
        "exp": (datetime.now(timezone.utc) + timedelta(days=365)).timestamp()
    }
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)

def verify_api_key(api_key: str) -> Optional[Dict]:
    """Verify an API key and return its payload"""
    try:
        payload = jwt.decode(api_key, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
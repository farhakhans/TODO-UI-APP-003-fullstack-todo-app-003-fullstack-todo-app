from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from jose import jwt, JWTError
from src.auth.jwt_handler import verify_token
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current user from the token in the Authorization header."""
    token = credentials.credentials

    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {"user_id": user_id, "email": payload.get("email")}


def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current user if token is provided, otherwise return None."""
    try:
        token = credentials.credentials
        payload = verify_token(token)
        if payload is None:
            return None

        user_id: str = payload.get("sub")
        if user_id is None:
            return None

        return {"user_id": user_id, "email": payload.get("email")}
    except:
        return None
from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime, timedelta
from typing import Optional
import uuid
import os
from sqlmodel import Session, select
from src.models.user_model import User, UserCreate, UserRead
from src.database.database_config import get_session
from src.auth.jwt_handler import verify_password, get_password_hash, create_access_token
from src.middleware.auth_middleware import get_current_user
from jose import jwt, JWTError
from pydantic import BaseModel

router = APIRouter()

class SigninRequest(BaseModel):
    email: str
    password: str


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: UserCreate, session: Session = Depends(get_session)):
    """Register a new user"""
    # Check if user with this email already exists
    existing_user = session.exec(select(User).where(User.email == user.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Create new user
    db_user = User(
        email=user.email,
        password_hash=hashed_password
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create JWT token for the newly registered user
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(db_user.id), "email": db_user.email},
        expires_delta=access_token_expires
    )

    return {"token": access_token, "user": {"id": db_user.id, "email": db_user.email}}


@router.post("/signin")
def signin(request: SigninRequest, session: Session = Depends(get_session)):
    """Authenticate a user and return JWT token"""
    email = request.email
    password = request.password

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    # Find user by email
    user = session.exec(select(User).where(User.email == email)).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create JWT token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=access_token_expires
    )

    return {"token": access_token, "user": {"id": user.id, "email": user.email}}


@router.post("/logout")
def logout(current_user: dict = Depends(get_current_user)):
    """Logout user (client-side token removal)"""
    # In a stateless JWT system, logout is typically handled on the client-side
    # by removing the token from storage. We can still provide this endpoint
    # for any server-side cleanup if needed.
    return {"message": "Logged out successfully"}


class ForgotPasswordRequest(BaseModel):
    email: str


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, session: Session = Depends(get_session)):
    """Initiate password reset process"""
    # Find user by email
    user = session.exec(select(User).where(User.email == request.email)).first()

    if not user:
        # Don't reveal whether the email exists to prevent enumeration
        return {"message": "If an account with that email exists, a password reset link has been sent."}

    # In a real application, you would:
    # 1. Generate a password reset token
    # 2. Save it to the database with expiration
    # 3. Send an email with the reset link
    # For now, we'll simulate the process

    # Generate a password reset token (in real app, this would be stored in DB)
    reset_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "type": "reset"},
        expires_delta=timedelta(hours=1)  # Valid for 1 hour
    )

    # In a real application, you would send an email here
    # send_reset_email(user.email, reset_token)

    return {"message": "If an account with that email exists, a password reset link has been sent."}


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, session: Session = Depends(get_session)):
    """Reset user password with valid token"""
    try:
        # Decode the reset token
        payload = jwt.decode(request.token, os.getenv("SECRET_KEY", "your-default-secret-key-change-this-in-production"), algorithms=[os.getenv("ALGORITHM", "HS256")])

        # Verify this is a reset token
        if payload.get("type") != "reset":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token type"
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token"
            )

        # Find user by ID
        user = session.exec(select(User).where(User.id == uuid.UUID(user_id))).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User not found"
            )

        # Hash and update the new password
        hashed_password = get_password_hash(request.new_password)
        user.password_hash = hashed_password

        session.add(user)
        session.commit()

        return {"message": "Password has been reset successfully"}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
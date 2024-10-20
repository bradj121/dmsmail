from datetime import timedelta

from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from .auth import authenticate_user, create_access_token, get_current_active_user, get_password_hash

from .database import engine

from . import schemas, models


router = APIRouter(prefix="/api/auth")

ACCESS_TOKEN_EXPIRE_MINUTES = 43200


@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detaile="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signin", response_model=schemas.TokenJson)
def login_for_access_token(signin_request: schemas.SignInRequest):
    user = authenticate_user(signin_request.email, signin_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detaile="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)

    return {"token": access_token, "token_type": "bearer"}


@ router.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User =Depends(get_current_active_user)):# TODO: schema or model?
    return current_user


from fastapi import File

from datetime import date
from typing import Optional, List

from pydantic import BaseModel


class PolicyBase(BaseModel):
    recipients: str
    subject: str
    body: str
    expiration_date: str
    attachments: str
    status: str


class PolicyCreate(PolicyBase):
    pass


class PolicyUpdate(PolicyBase):
    id: int


class Policy(PolicyBase):
    id: int
    sender_id: int

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: str
    hashed_password: str


class User(UserBase):
    id: int
    is_active: bool
    policies: list[Policy] = []

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenJson(BaseModel):
    token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class SignInRequest(BaseModel):
    email: str
    password: str

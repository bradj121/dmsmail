from datetime import date

from pydantic import BaseModel


class PolicyBase(BaseModel):
    recipients: str
    subject: str 
    body: str
    expiration_date: date
    attachments: str
    status: str


class PolicyCreate(PolicyBase):
    pass 


class Policy(PolicyBase):
    id: int
    sender_id: int 

    class Config:
        from_attributes = True 


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int 
    is_active: bool
    policies: list[Policy] = []

    class Config:
        from_attributes = True 

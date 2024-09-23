from pydantic import BaseModel


class PolicyBase(BaseModel):
    recipients: str  # TODO: make a list
    subject: str 
    body: str
    expiration_date: int
    # attachments: str  # TODO figure out files
    is_active: bool


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

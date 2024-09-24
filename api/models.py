from sqlalchemy import ForeignKey, Boolean, Column, Integer, String 
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    policies = relationship("Policy", back_populates="owner")
    

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    recipients = Column(String)  # TODO: Make handle list 
    subject = Column(String)
    body = Column(String)
    expiration_date = Column(Integer)
    attachments = Column(String)  # TODO: figure this out
    is_active = Column(Boolean, default=True)

    owner = relationship("User", back_populates="policies")




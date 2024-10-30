from datetime import datetime, timedelta
from typing import Optional

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, status, HTTPException

from passlib.context import CryptContext

from jose import JWTError, jwt

from sqlalchemy.orm import Session

from .database import engine, SessionLocal
from . import models, schemas


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


SECRET_KEY = "f6089f8c5cd8b0fd0edef389e9050fd5602bdd996119e8a354ab5ff33cd581f8"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")


def verify_password(plain_password, hashed_password):
    """Compares the plaintext password with the hashed password

    Args:
        plain_password (str): password in plaintext
        hashed_password (str): hashed password

    Returns:
        bool: True if hashed version fo plaintext password matches saved hash
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Gets a hashed version of the plaintext password

    Args:
        password (str): The password to obtain the hash for

    Returns:
        str: The hashed password
    """
    return pwd_context.hash(password)


def authenticate_user(email: str, password: str):
    """Verfies that the user exists in the system and the supplied password matches the hashed password

    Args:
        email (str): The email identifier of the user
        password (str): The plaintext password

    Returns:
        User: a User object if found, else False
    """
    with Session(engine) as session:
        user = session.query(models.User).filter(models.User.email == email).first()

        if not user:
            return False
        if not verify_password(password, user.hashed_password):
            return False
        return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Creates an encoded access token

    Args:
        data (dict): A dictionary of data to encode in the token
        expires_delta (Optional[timedelta], optional): A timedelta to set as the expiration time. Defaults to None.

    Returns:
        str: An encoded JWT token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Gets the current user based on the jwt token

    Args:
        token (str, optional): The token passed from the client. Defaults to Depends(oauth2_scheme).
        db (Session, optional): A db session object used to get the current user from the db. Defaults to Depends(get_db).

    Raises:
        credentials_exception: Returns 401 unauthorized exception if the token is malformed, or belongs to a user not in the system.

    Returns:
        User: a User object
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user


def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    """Gets current active user, wrapper for get_current_user

    Args:
        current_user (models.User, optional): The current user as verified by the authorization header. Defaults to Depends(get_current_user).

    Returns:
        User: a User object
    """
    return current_user

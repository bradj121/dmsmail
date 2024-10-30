from datetime import datetime

from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.jobstores.memory import MemoryJobStore

from contextlib import asynccontextmanager

from sqlalchemy.orm import Session

from . import crud, models, schemas, routers
from .database import SessionLocal, engine
from .send_emails import send_policy_email


models.Base.metadata.create_all(bind=engine)


scheduler = AsyncIOScheduler(jobstores={"default": MemoryJobStore()})


@asynccontextmanager
async def lifespan(app: FastAPI):
    """A context manager used to set lifespan events

    Args:
        app (FastAPI): The application to add lifespan events to
    """
    scheduler.start()
    yield
    scheduler.shutdown()


app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json", lifespan=lifespan)
app.include_router(routers.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    """Database session used for dependency injection

    Yields:
        sessionmaker: A database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@scheduler.scheduled_job("interval", hours=1)
async def send_messages_job():
    """
    An scheduled task to check whether any policies have expired and if they have to send the policy email
    """
    with Session(engine) as db:
        policies = db.query(models.Policy).all()
        for policy in policies:
            policy_expiration = datetime.strptime(policy.expiration_date, "%m/%d/%Y").date()
            if policy_expiration >= datetime.today().date() and policy.status == 'active':
                user = db.query(models.User).filter(models.User.id == policy.sender_id).first()
                send_policy_email(user, policy)
                policy.status = 'inactive'
                db.commit()


@app.post("/api/auth/signup", response_model=schemas.User)
def sign_up(user: schemas.UserCreate, db: Session = Depends(get_db)) -> schemas.User:
    """The endpoint used to create users and onboard them to the app

    Args:
        user (schemas.UserCreate): The data to use to create the user
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: 400 if user is already registered

    Returns:
        schemas.User: The created user
    """
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/api/users", response_model=schemas.UserLogin)
def get_user_by_email(user: schemas.UserBase, db: Session = Depends(get_db)) -> schemas.User:
    """Checks if user is registered

    Args:
        user (schemas.UserBase): The user to check for
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404 if user is not registered

    Returns:
        schemas.User: The user if found
    """
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.get("/api/users", response_model=list[schemas.User])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> List[schemas.User]:
    """Get a list of users

    Args:
        skip (int, optional): The number of users to skip, used for pagination. Defaults to 0.
        limit (int, optional): The maximum number of users to return. Defaults to 100.
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Returns:
        List[schemas.User]: A list of users from the database
    """
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/api/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)) -> schemas.User:
    """Gets user by Id

    Args:
        user_id (int): The id of the user to get
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404 if user is not registered

    Returns:
        schemas.User: The user from the database
    """
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)) -> str:
    """Deletes the specified user from the database

    Args:
        user_id (int): The id of the user to delete
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: 400 if the user was not deleted

    Returns:
        str: Message indicating that the user was deleted
    """
    deleted = crud.delete_user(db=db, user_id=user_id)
    if deleted:
        return f"User {user_id} has been deleted"
    else:
        raise HTTPException(status_code=400, detail="Failed to delete user")


@app.get("/api/policies/{policy_id}", response_model=schemas.Policy)
def get_policy_by_id(policy_id: int, db: Session = Depends(get_db)) -> schemas.Policy:
    """Gets a policy by id

    Args:
        policy_id (int): The id of the policy to get
        db (Session, optional): Database session. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404 if policy not found

    Returns:
        schemas.Policy: The policy from the database
    """
    policy = crud.get_policy_by_id(db, policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

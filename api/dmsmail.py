from datetime import datetime

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


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@scheduler.scheduled_job("interval", hours=1)
async def send_messages_job():
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
def sign_up(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/api/users", response_model=schemas.UserLogin)
def get_user_by_email(user: schemas.UserBase, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.get("/api/users", response_model=list[schemas.User])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/api/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.delete("/api/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_user(db=db, user_id=user_id)
    if deleted:
        return f"User {user_id} has been deleted"
    else:
        raise HTTPException(status_code=400, detail="Failed to delete user")


@app.get("/api/policies/{policy_id}", response_model=schemas.Policy)
def get_policy_by_id(policy_id: int, db: Session = Depends(get_db)):
    policy = crud.get_policy_by_id(db, policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

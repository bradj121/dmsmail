from typing import List, Optional, Any

from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine


models.Base.metadata.create_all(bind=engine)

app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


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


@app.post("/api/users/{user_id}/policies", response_model=schemas.Policy)
def create_policy_for_user(user_id: int, policy: schemas.PolicyCreate, db: Session = Depends(get_db)):
    return crud.create_policy(db=db, policy=policy, user_id=user_id)


@app.get("/api/policies", response_model=list[schemas.Policy])
def get_policies(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    policies = crud.get_policies(db, skip=skip, limit=limit)
    return policies

@app.get("/api/policies/{policy_id}", response_model=schemas.Policy)
def get_policy_by_id(policy_id: int, db: Session = Depends(get_db)):
    policy = crud.get_policy_by_id(db, policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy 

@app.put("/api/users/{user_id}/policies/{policy_id}", response_model=schemas.Policy)  # TODO: get user from cookies or something
def update_policy(user_id: int, policy_id: int, policy_updates: schemas.PolicyUpdate, db: Session = Depends(get_db)):
    return crud.update_policy(db=db, policy_id=policy_id, policy=policy_updates)


@app.delete("/api/users/{user_id}/policies/{policy_id}")
def delete_policy(user_id: int, policy_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_policy(db, user_id=user_id, policy_id=policy_id)
    if deleted:
        return f"Policy {policy_id} for user {user_id} has been deleted"
    else:
        raise HTTPException(status_code=400, detail=f"Failed to delete policy {policy_id} for user {user_id}")

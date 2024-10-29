import shutil
import os

from typing import List

from datetime import timedelta

from fastapi import APIRouter, Depends, status, HTTPException, File, UploadFile, Form
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from .auth import authenticate_user, create_access_token, get_current_active_user

from .database import SessionLocal

from . import schemas, crud


router = APIRouter(prefix="/api/auth")

ACCESS_TOKEN_EXPIRE_MINUTES = 43200


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signin", response_model=schemas.TokenJson)
def login_for_token(signin_request: schemas.SignInRequest):
    user = authenticate_user(signin_request.email, signin_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)

    return {"token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user


@router.get("/users/me/policies", response_model=list[schemas.Policy])
def get_my_policies(current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return current_user.policies


@router.post("/users/me/policies", response_model=schemas.Policy)
def create_policy(
    policy: schemas.PolicyCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    db_policy = crud.create_policy(db=db, policy=policy, user_id=current_user.id)
    return db_policy


@router.put("/users/me/policies", response_model=schemas.Policy)
def update_policy(
    policy: schemas.PolicyUpdate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    updated_policy = crud.update_policy(db=db, policy_id=policy.id, policy=policy)

    db_attachments = updated_policy.attachments.split(',')
    policy_attachments_path = f"files/{current_user.id}/{policy.id}"
    current_attachments = [
        f for f in os.listdir(policy_attachments_path) if os.path.isfile(os.path.join(policy_attachments_path, f))
    ]
    for attachment in current_attachments:
        if attachment not in db_attachments:
            os.remove(f"{policy_attachments_path}/{attachment}")

    return updated_policy


@router.post("/users/me/policies/files")
def upload_policy_files(
    policy_id: int = Form(...),
    files: List[UploadFile] = File(...),
    current_user: schemas.User = Depends(get_current_active_user),
):
    fileDir = f'files/{current_user.id}/{policy_id}'

    if not os.path.isdir(fileDir):
        os.makedirs(fileDir, exist_ok=True)

    for file in files:
        try:
            with open(f"{fileDir}/{file.filename}", 'wb') as f:
                shutil.copyfileobj(file.file, f)
        except:
            # clear attachments field
            db = get_db()
            db_policy = crud.get_policy_by_id(db=db, policy_id=policy_id)
            db_policy.attachments = ""
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to save policy attachments"
            )
        finally:
            file.file.close()


@router.delete("/users/me/policies/{policy_id}")
def delete_policy(
    policy_id: int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)
):
    deleted = crud.delete_policy(db, policy_id=policy_id)
    if deleted:
        policy_attachments_path = f"files/{current_user.id}/{policy_id}"
        if os.path.isdir(policy_attachments_path):
            current_attachments = [
                f
                for f in os.listdir(policy_attachments_path)
                if os.path.isfile(os.path.join(policy_attachments_path, f))
            ]
            for attachment in current_attachments:
                os.remove(f"{policy_attachments_path}/{attachment}")
            os.rmdir(policy_attachments_path)
        return f"Policy {policy_id} for user {current_user.id} has been deleted"
    else:
        raise HTTPException(status_code=400, detail=f"Failed to delete policy {policy_id} for user {current_user.id}")

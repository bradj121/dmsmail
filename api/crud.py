from sqlalchemy.orm import Session 

from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(email=user.email, hashed_password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        return False 
    else:
        return True


def get_policies(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Policy).offset(skip).limit(limit).all()


def get_policy_by_id(db: Session, policy_id: int):
    return db.query(models.Policy).filter(models.Policy.id == policy_id).first()


def create_policy(db: Session, policy: schemas.PolicyCreate, user_id: int):
    db_policy = models.Policy(**policy.dict(), sender_id=user_id)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy


def update_policy(db: Session, policy_id: int, policy: schemas.PolicyUpdate):
    db_policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    db_policy.recipients = policy.recipients
    db_policy.subject = policy.subject
    db_policy.body = policy.body
    db_policy.attachments = policy.attachments
    db_policy.expiration_date = policy.expiration_date
    db_policy.status = policy.status
    db.commit()
    return db_policy


def delete_policy(db: Session, user_id: int, policy_id: int):
    policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if policy:
        db.delete(policy)
        db.commit()
    policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if policy:
        return False
    else:
        return True

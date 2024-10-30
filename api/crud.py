from typing import List

from sqlalchemy.orm import Session

from . import models, schemas


def get_user(db: Session, user_id: int) -> schemas.User:
    """Gets user from DB by ID

    Args:
        db (Session): Database session
        user_id (int): User id to find

    Returns:
        schemas.User: The found User object
    """
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> schemas.User:
    """Gets user from DB by email

    Args:
        db (Session): Database session
        email (str): The email of the user to find

    Returns:
        schemas.User: The found User object
    """
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[schemas.User]:
    """Get users from DB

    Args:
        db (Session): Database session
        skip (int, optional): The number of users to skip, used for pagination. Defaults to 0.
        limit (int, optional): The maximum number of users to return. Defaults to 100.

    Returns:
        List[schemas.User]: A list of found users
    """
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate) -> schemas.User:
    """Create a user and save it do the database

    Args:
        db (Session): Database session
        user (schemas.UserCreate): A User object to be created

    Returns:
        schemas.User: The created user
    """
    db_user = models.User(email=user.email, hashed_password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    """Delete user from databse

    Args:
        db (Session): Database session
        user_id (int): The id of the user to delete

    Returns:
        bool: True if the user was deleted, otherwise False
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        return False
    else:
        return True


def get_policies(db: Session, skip: int = 0, limit: int = 100) -> List[schemas.Policy]:
    """Gets policies from the database

    Args:
        db (Session): Database session
        skip (int, optional): The number of policies to skip, used for pagination. Defaults to 0.
        limit (int, optional): The maximum number of policies to return. Defaults to 100.

    Returns:
        List[schemas.Policy]: A list of found policies
    """
    return db.query(models.Policy).offset(skip).limit(limit).all()


def get_policy_by_id(db: Session, policy_id: int) -> schemas.Policy:
    """Gets a policy by id

    Args:
        db (Session): Database session
        policy_id (int): The id of the policy to retrieve

    Returns:
        schemas.Policy: A policy object
    """
    return db.query(models.Policy).filter(models.Policy.id == policy_id).first()


def create_policy(db: Session, policy: schemas.PolicyCreate, user_id: int) -> schemas.Policy:
    """Creates a policy in the databaase

    Args:
        db (Session): Database session
        policy (schemas.PolicyCreate): Instance of the policy to save to the database
        user_id (int): The user to which the policy relates

    Returns:
        schemas.Policy: The policy that was saved to the database
    """
    db_policy = models.Policy(**policy.dict(), sender_id=user_id)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy


def update_policy(db: Session, policy_id: int, policy: schemas.PolicyUpdate) -> schemas.Policy:
    """Updates the database with the policy data passed in

    Args:
        db (Session): Database session
        policy_id (int): The policy to update
        policy (schemas.PolicyUpdate): The updated policy fields

    Returns:
        schemas.Policy: The updated policy
    """
    db_policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    db_policy.recipients = policy.recipients
    db_policy.subject = policy.subject
    db_policy.body = policy.body
    db_policy.attachments = policy.attachments
    db_policy.expiration_date = policy.expiration_date
    db_policy.status = policy.status
    db.commit()
    return db_policy


def delete_policy(db: Session, policy_id: int) -> bool:
    """Deletes the policy from the database

    Args:
        db (Session): Database session
        policy_id (int): The id of the policy to delete from the database

    Returns:
        bool: True if the policy was deleted, otherwise False
    """
    policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if policy:
        db.delete(policy)
        db.commit()
    policy = db.query(models.Policy).filter(models.Policy.id == policy_id).first()
    if policy:
        return False
    else:
        return True

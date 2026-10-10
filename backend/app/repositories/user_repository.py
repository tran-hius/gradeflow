from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from typing import Optional
from ..models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        return self.db.scalar(stmt)

    def get_all(self, skip: int = 0, limit: int = 10) -> list[User]:
        stmt = select(User).offset(skip).limit(limit)
        return self.db.scalars(stmt).all()

    def create(self, user: User) -> User:
        try:
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except SQLAlchemyError:
            self.db.rollback()
            raise

    def update(self, user_id: int, user_data: dict) -> Optional[User]:
        user = self.get_by_id(user_id)
        if user is None:
            return None

        try:
            for key, value in user_data.items():
                if key in {"name", "email", "role"} and value is not None:
                    setattr(user, key, value)

            self.db.commit()
            self.db.refresh(user)
            return user
        except SQLAlchemyError:
            self.db.rollback()
            raise

    def delete(self, user_id: int) -> bool:
        user = self.get_by_id(user_id)

        if user is None:
            return False

        try:
            self.db.delete(user)
            self.db.commit()
            return True

        except SQLAlchemyError:
            self.db.rollback()
            raise

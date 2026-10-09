from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User

class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> list[User]:
        stmt = select(User)
        result = self.session.execute(stmt)
        return list(result.scalars().all())

    def get_by_id(self, user_id: int) -> User | None:
        stmt = select(User).where(User.user_id == user_id)
        result = self.session.execute(stmt)
        return result.scalars().first()

    def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        result = self.session.execute(stmt)
        return result.scalars().first()

    def create(self, user_data: dict) -> User:
        user = User(**user_data)
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from typing import Optional
import logging

from ..models.user import User
from ..utils.exception_handlers import (
    UserNotFoundError,
    EmailAlreadyExistsError,
    InternalServerError,
)

logger = logging.getLogger(__name__)

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int) -> Optional[User]:
        return await self.db.get(User, user_id)

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        return await self.db.scalar(stmt)

    async def get_all(self, skip: int = 0, limit: int = 10) -> list[User]:
        stmt = select(User).offset(skip).limit(limit)
        result = await self.db.scalars(stmt)
        return list(result.all())

    async def create(self, user: User) -> User:
        try:
            self.db.add(user)
            await self.db.commit()
            await self.db.refresh(user)
            return user

        except IntegrityError as e:
            await self.db.rollback()
            logger.warning("Database integrity constraint violated")
            raise EmailAlreadyExistsError() from e

        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.exception("Database error while creating user")
            raise InternalServerError("A database error occurred") from e

    async def update(self, user_id: int, user_data: dict) -> User:
        user = await self.get_by_id(user_id)

        if user is None:
            raise UserNotFoundError()

        try:
            for key, value in user_data.items():
                if key in {"name", "email", "role"} and value is not None:
                    setattr(user, key, value)

            await self.db.commit()
            await self.db.refresh(user)
            return user

        except IntegrityError as e:
            await self.db.rollback()
            logger.warning("Database integrity constraint violated")
            raise EmailAlreadyExistsError() from e

        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.exception("Database error while updating user")
            raise InternalServerError("A database error occurred") from e

    async def delete(self, user_id: int) -> bool:
        user = await self.get_by_id(user_id)

        if user is None:
            raise UserNotFoundError()

        try:
            await self.db.delete(user)
            await self.db.commit()
            return True

        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.exception("Database error while deleting user")
            raise InternalServerError("A database error occurred") from e

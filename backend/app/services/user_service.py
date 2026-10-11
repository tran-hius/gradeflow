from ..repositories.user_repository import UserRepository
from ..models.user import User
from ..utils.exception_handlers import (
    UserNotFoundError,
    EmailAlreadyExistsError,
    BadRequestError,
)

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    @staticmethod
    def normalize_email(email: str) -> str:
        return email.strip().lower()

    async def get_user(self, user_id: int) -> User:
        user = await self.user_repo.get_by_id(user_id)

        if user is None:
            raise UserNotFoundError()

        return user

    async def get_all_users(
        self,
        skip: int = 0,
        limit: int = 10,
    ) -> list[User]:
        if skip < 0 or limit < 1:
            raise BadRequestError("Invalid pagination parameters")

        return await self.user_repo.get_all(
            skip=skip,
            limit=limit,
        )

    async def create_user(self, user_data: dict) -> User:
        data = user_data.copy()

        email = data.get("email")

        if not isinstance(email, str) or not email.strip():
            raise BadRequestError("Email is required")

        email = self.normalize_email(email)
        data["email"] = email

        existing_user = await self.user_repo.get_by_email(email)

        if existing_user is not None:
            raise EmailAlreadyExistsError()

        new_user = User(**data)

        return await self.user_repo.create(new_user)

    async def update_user(
        self,
        user_id: int,
        user_data: dict,
    ) -> User:
        data = user_data.copy()

        if not data:
            raise BadRequestError("No update data provided")

        new_email = data.get("email")

        if new_email is not None:
            if not isinstance(new_email, str) or not new_email.strip():
                raise BadRequestError("Email cannot be empty")

            email = self.normalize_email(new_email)
            data["email"] = email

            existing_user = await self.user_repo.get_by_email(email)

            if existing_user is not None and existing_user.user_id != user_id:
                raise EmailAlreadyExistsError()

        return await self.user_repo.update(user_id, data)

    async def delete_user(self, user_id: int) -> bool:
        return await self.user_repo.delete(user_id)

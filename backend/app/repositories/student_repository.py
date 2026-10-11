from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm import joinedload
from typing import Optional
from ..models.student import Student
from ..utils.exception_handlers import (
    StudentNotFoundError,
    DuplicateResourceError,
    InternalServerError,
)

class StudentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: int) -> Optional[Student]:
        stmt = select(Student).options(joinedload(Student.user)).where(
            Student.user_id == user_id
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_student_id(self, student_id: str) -> Optional[Student]:
        stmt = select(Student).options(joinedload(Student.user)).where(
            Student.student_id == student_id
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 10) -> list[Student]:
        stmt = (
            select(Student)
            .options(joinedload(Student.user))
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().unique().all())

    async def create(self, student: Student) -> Student:
        try:
            self.db.add(student)
            await self.db.commit()
            await self.db.refresh(student)
            return student
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateResourceError("Student")
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise InternalServerError(f"Database error: {str(e)}")

    async def update(self, user_id: int, student_data: dict) -> Student:
        student = await self.get_by_user_id(user_id)
        if student is None:
            raise StudentNotFoundError()

        try:
            for key, value in student_data.items():
                if (
                    key in {"class_name", "major", "year", "gpa", "status", "enrolled_date"}
                    and value is not None
                ):
                    setattr(student, key, value)

            await self.db.commit()
            await self.db.refresh(student)
            return student
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateResourceError("Student")
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise InternalServerError(f"Database error: {str(e)}")

    async def delete(self, user_id: int) -> bool:
        student = await self.get_by_user_id(user_id)
        if student is None:
            raise StudentNotFoundError()

        try:
            await self.db.delete(student)
            await self.db.commit()
            return True
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise InternalServerError(f"Database error: {str(e)}")

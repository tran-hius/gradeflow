from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm import joinedload
from typing import Optional, List
from ..models.grade import Grade
from ..models.student import Student
from ..utils.enums import Subject
from ..utils.exception_handlers import (
    GradeNotFoundError,
    DuplicateResourceError,
    InternalServerError,
)

class GradeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, grade_id: int) -> Optional[Grade]:
        stmt = select(Grade).where(Grade.grade_id == grade_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_student_and_subject(
        self, student_id: int, subject: Subject
    ) -> Optional[Grade]:
        stmt = select(Grade).where(
            Grade.student_id == student_id,
            Grade.subject == subject,
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_student_id(self, student_id: int) -> List[Grade]:
        stmt = (
            select(Grade)
            .where(Grade.student_id == student_id)
            .order_by(Grade.subject)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_subject(self, subject: Subject) -> List[Grade]:
        stmt = (
            select(Grade)
            .where(Grade.subject == subject)
            .order_by(Grade.student_id)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def create(self, grade: Grade) -> Grade:
        try:
            self.db.add(grade)
            await self.db.commit()
            await self.db.refresh(grade)
            return grade
        except IntegrityError:
            await self.db.rollback()
            raise DuplicateResourceError(f"Grade for subject '{grade.subject}'")
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise InternalServerError(f"Database error: {str(e)}")

    async def update(self, grade_id: int, score: float) -> Grade:
        grade = await self.get_by_id(grade_id)
        if grade is None:
            raise GradeNotFoundError()

        try:
            grade.score = score
            await self.db.commit()
            await self.db.refresh(grade)
            return grade
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise InternalServerError(f"Database error: {str(e)}")

    async def delete(self, grade_id: int) -> bool:
        grade = await self.get_by_id(grade_id)
        if grade is None:
            raise GradeNotFoundError()

        try:
            await self.db.delete(grade)
            await self.db.commit()
            return True
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise InternalServerError(f"Database error: {str(e)}")

    async def get_matrix_dataset(self) -> dict:
        try:

            student_stmt = (
                select(Student)
                .options(joinedload(Student.user))
                .order_by(Student.user_id)
            )
            student_result = await self.db.execute(student_stmt)
            students = student_result.scalars().unique().all()

            grade_stmt = select(Grade).order_by(Grade.student_id, Grade.subject)
            grade_result = await self.db.execute(grade_stmt)
            grades = grade_result.scalars().all()

            student_ids = [s.user_id for s in students]
            student_names = [s.user.name for s in students]
            subjects = [s.value for s in Subject]

            raw_scores = [
                {
                    "student_id": g.student_id,
                    "subject": (
                        g.subject.value
                        if hasattr(g.subject, "value")
                        else str(g.subject)
                    ),
                    "score": g.score,
                }
                for g in grades
            ]

            return {
                "student_ids": student_ids,
                "student_names": student_names,
                "subjects": subjects,
                "raw_scores": raw_scores,
            }
        except SQLAlchemyError as e:
            raise InternalServerError(f"Database error: {str(e)}")

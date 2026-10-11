from typing import List, Optional
from ..models.grade import Grade
from ..repositories.grade_repository import GradeRepository
from ..repositories.student_repository import StudentRepository
from ..utils.enums import Subject, StudentStatus
from ..utils.exception_handlers import (
    GradeNotFoundError,
    StudentNotFoundError,
    ConflictError,
    BadRequestError,
)

class GradeService:
    def __init__(
        self,
        grade_repo: GradeRepository,
        student_repo: StudentRepository,
    ):
        self.grade_repo = grade_repo
        self.student_repo = student_repo

    async def create_grade(self, data: dict) -> Grade:
        student_id = data.get("student_id")
        subject = data.get("subject")
        score = data.get("score")

        if student_id is None or subject is None or score is None:
            raise BadRequestError("student_id, subject, and score are required")

        student = await self.student_repo.get_by_user_id(student_id)
        if student is None:
            raise StudentNotFoundError()

        existing = await self.grade_repo.get_by_student_and_subject(
            student_id, subject
        )
        if existing is not None:
            subj_name = subject.value if hasattr(subject, "value") else str(subject)
            raise ConflictError(f"Sinh viên đã có điểm môn {subj_name}")

        new_grade = Grade(
            student_id=student_id,
            subject=subject,
            score=score,
        )
        created_grade = await self.grade_repo.create(new_grade)

        await self._recalculate_student_gpa(student_id)

        return created_grade

    async def update_grade(self, grade_id: int, score: float) -> Grade:

        grade = await self.grade_repo.get_by_id(grade_id)
        if grade is None:
            raise GradeNotFoundError()

        updated_grade = await self.grade_repo.update(grade_id, score)

        await self._recalculate_student_gpa(grade.student_id)

        return updated_grade

    async def delete_grade(self, grade_id: int) -> bool:

        grade = await self.grade_repo.get_by_id(grade_id)
        if grade is None:
            raise GradeNotFoundError()

        student_id = grade.student_id

        await self.grade_repo.delete(grade_id)

        await self._recalculate_student_gpa(student_id)

        return True

    async def get_grade_by_id(self, grade_id: int) -> Grade:
        grade = await self.grade_repo.get_by_id(grade_id)
        if grade is None:
            raise GradeNotFoundError()
        return grade

    async def get_student_grades(self, student_id: int) -> dict:
        student = await self.student_repo.get_by_user_id(student_id)
        if student is None:
            raise StudentNotFoundError()

        grades = await self.grade_repo.get_by_student_id(student_id)
        return {
            "student_id": student.user_id,
            "student_name": student.user.name,
            "class_name": student.class_name,
            "grades": grades,
        }

    async def get_grades_by_subject(self, subject: Subject) -> List[Grade]:
        return await self.grade_repo.get_by_subject(subject)

    async def get_matrix_dataset(self) -> dict:
        return await self.grade_repo.get_matrix_dataset()

    async def _recalculate_student_gpa(self, student_id: int) -> None:
        grades = await self.grade_repo.get_by_student_id(student_id)
        if not grades:
            gpa = 0.0
            status = StudentStatus.AVERAGE.value
        else:
            gpa = round(sum(g.score for g in grades) / len(grades), 2)
            if gpa >= 8.5:
                status = StudentStatus.EXCELLENT.value
            elif gpa >= 7.0:
                status = StudentStatus.GOOD.value
            elif gpa >= 5.0:
                status = StudentStatus.AVERAGE.value
            elif gpa >= 3.5:
                status = StudentStatus.AT_RISK.value
            else:
                status = StudentStatus.FAILING.value

        await self.student_repo.update(student_id, {"gpa": gpa, "status": status})

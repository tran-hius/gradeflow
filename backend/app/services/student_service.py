from typing import List
from ..repositories.student_repository import StudentRepository
from ..repositories.user_repository import UserRepository
from ..models.student import Student
from ..models.user import User, Role
from ..utils.exception_handlers import (
    StudentNotFoundError,
    EmailAlreadyExistsError,
    DuplicateResourceError,
    BadRequestError,
)

class StudentService:
    def __init__(
        self,
        student_repo: StudentRepository,
        user_repo: UserRepository,
    ):
        self.student_repo = student_repo
        self.user_repo = user_repo

    @staticmethod
    def normalize_email(email: str) -> str:
        return email.strip().lower()

    async def get_student(self, user_id: int) -> dict:
        student = await self.student_repo.get_by_user_id(user_id)
        if student is None:
            raise StudentNotFoundError()
        return self._to_response(student)

    async def get_all_students(
        self,
        skip: int = 0,
        limit: int = 10,
    ) -> List[dict]:
        if skip < 0 or limit < 1:
            raise BadRequestError("Invalid pagination parameters")

        students = await self.student_repo.get_all(skip=skip, limit=limit)
        return [self._to_response(s) for s in students]

    async def create_student(self, data: dict) -> dict:

        email = data.get("email")
        if not isinstance(email, str) or not email.strip():
            raise BadRequestError("Email is required")

        email = self.normalize_email(email)

        existing_user = await self.user_repo.get_by_email(email)
        if existing_user is not None:
            raise EmailAlreadyExistsError()

        student_id = data.get("student_id")
        existing_student = await self.student_repo.get_by_student_id(student_id)
        if existing_student is not None:
            raise DuplicateResourceError("Student ID")

        new_user = User(
            name=data["name"],
            email=email,
            role=Role.STUDENT,
        )
        created_user = await self.user_repo.create(new_user)

        new_student = Student(
            user_id=created_user.user_id,
            student_id=data["student_id"],
            class_name=data["class_name"],
            major=data["major"],
            year=data["year"],
            gpa=data.get("gpa", 0.0),
            status=data.get("status", "average"),
            enrolled_date=data["enrolled_date"],
        )
        await self.student_repo.create(new_student)

        student = await self.student_repo.get_by_user_id(created_user.user_id)
        return self._to_response(student)

    async def update_student(self, user_id: int, data: dict) -> dict:
        if not data:
            raise BadRequestError("No update data provided")

        student = await self.student_repo.get_by_user_id(user_id)
        if student is None:
            raise StudentNotFoundError()

        user_data = {}
        student_data = {}

        if "name" in data:
            user_data["name"] = data["name"]
        if "email" in data:
            new_email = data["email"]
            if not isinstance(new_email, str) or not new_email.strip():
                raise BadRequestError("Email cannot be empty")
            email = self.normalize_email(new_email)
            existing = await self.user_repo.get_by_email(email)
            if existing is not None and existing.user_id != user_id:
                raise EmailAlreadyExistsError()
            user_data["email"] = email

        for key in ("class_name", "major", "year", "gpa", "status"):
            if key in data:
                student_data[key] = data[key]

        if user_data:
            await self.user_repo.update(user_id, user_data)

        if student_data:
            await self.student_repo.update(user_id, student_data)

        updated = await self.student_repo.get_by_user_id(user_id)
        return self._to_response(updated)

    async def delete_student(self, user_id: int) -> bool:

        await self.student_repo.delete(user_id)

        await self.user_repo.delete(user_id)
        return True

    @staticmethod
    def _to_response(student: Student) -> dict:
        return {
            "user_id": student.user_id,
            "student_id": student.student_id,
            "name": student.user.name,
            "email": student.user.email,
            "class_name": student.class_name,
            "major": student.major,
            "year": student.year,
            "gpa": student.gpa,
            "status": student.status.value if hasattr(student.status, "value") else student.status,
            "enrolled_date": student.enrolled_date,
        }

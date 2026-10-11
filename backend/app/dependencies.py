from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .database.session import get_db

from .repositories.user_repository import UserRepository
from .repositories.student_repository import StudentRepository
from .repositories.grade_repository import GradeRepository

from .services.user_service import UserService
from .services.student_service import StudentService
from .services.grade_service import GradeService

def get_user_repository(
    db: AsyncSession = Depends(get_db),
) -> UserRepository:
    return UserRepository(db)

def get_student_repository(
    db: AsyncSession = Depends(get_db),
) -> StudentRepository:
    return StudentRepository(db)

def get_grade_repository(
    db: AsyncSession = Depends(get_db),
) -> GradeRepository:
    return GradeRepository(db)

def get_user_service(
    user_repo: UserRepository = Depends(get_user_repository),
) -> UserService:
    return UserService(user_repo)

def get_student_service(
    student_repo: StudentRepository = Depends(get_student_repository),
    user_repo: UserRepository = Depends(get_user_repository),
) -> StudentService:
    return StudentService(student_repo=student_repo, user_repo=user_repo)

def get_grade_service(
    grade_repo: GradeRepository = Depends(get_grade_repository),
    student_repo: StudentRepository = Depends(get_student_repository),
) -> GradeService:
    return GradeService(grade_repo=grade_repo, student_repo=student_repo)


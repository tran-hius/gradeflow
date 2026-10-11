import asyncio
import os
import sys
from pathlib import Path
import random

CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from dotenv import load_dotenv

load_dotenv(BACKEND_DIR.parent / ".env")
load_dotenv(BACKEND_DIR / ".env")

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)
from sqlalchemy import select, delete
from app.models import Base
from app.models.student import Student, StudentStatus
from app.models.grade import Grade
from app.utils.enums import Subject

def get_status(gpa: float) -> StudentStatus:
    if gpa >= 8.5:
        return StudentStatus.EXCELLENT
    if gpa >= 7.0:
        return StudentStatus.GOOD
    if gpa >= 5.0:
        return StudentStatus.AVERAGE
    if gpa >= 3.5:
        return StudentStatus.AT_RISK
    return StudentStatus.FAILING

async def seed_grades():
    db_url = os.getenv(
        "DATABASE_URL",
        "mysql+asyncmy://gradeflow_user:gradeflow_password_123@127.0.0.1:3306/gradeflow_db?charset=utf8mb4",
    )
    if "@db:" in db_url:
        db_url = db_url.replace("@db:", "@127.0.0.1:")

    engine = create_async_engine(db_url, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables verified/created.")

    session_factory = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )

    subjects = [
        Subject.MATH,
        Subject.PHYSICS,
        Subject.CHEMISTRY,
        Subject.ENGLISH,
        Subject.LITERATURE,
    ]

    async with session_factory() as session:

        stmt = select(Student).order_by(Student.user_id)
        students = (await session.scalars(stmt)).all()
        total_students = len(students)
        print(f"Found {total_students} students in database.")

        if total_students == 0:
            print("No students found! Please run seed_students.py first.")
            await engine.dispose()
            return

        await session.execute(delete(Grade))
        await session.commit()
        print("Cleared existing grades for clean statistical distribution.")

        grades_to_add = []

        for idx, student in enumerate(students):
            student_scores = {}

            if idx < 5:

                for sub in subjects:
                    student_scores[sub] = round(random.uniform(8.5, 9.8), 1)
            elif idx < 18:

                for sub in subjects:
                    student_scores[sub] = round(random.uniform(6.5, 8.4), 1)
            elif idx < 20:

                student_scores[Subject.MATH] = round(random.uniform(9.5, 10.0), 1)
                student_scores[Subject.PHYSICS] = round(random.uniform(8.8, 9.5), 1)
                student_scores[Subject.CHEMISTRY] = round(random.uniform(6.5, 7.5), 1)
                student_scores[Subject.ENGLISH] = round(random.uniform(5.0, 6.0), 1)
                student_scores[Subject.LITERATURE] = round(random.uniform(2.0, 2.5), 1)
            elif idx < 30:

                for sub in subjects:
                    student_scores[sub] = round(random.uniform(5.0, 6.4), 1)
            else:

                for sub in subjects:
                    student_scores[sub] = round(random.uniform(2.5, 4.8), 1)

                student_scores[Subject.MATH] = round(random.uniform(1.5, 2.8), 1)

            for sub, score in student_scores.items():
                g = Grade(
                    student_id=student.user_id,
                    subject=sub,
                    score=score,
                )
                grades_to_add.append(g)

            avg_gpa = round(sum(student_scores.values()) / len(student_scores), 2)
            student.gpa = avg_gpa
            student.status = get_status(avg_gpa)

        session.add_all(grades_to_add)
        await session.commit()
        print(f"Successfully seeded {len(grades_to_add)} grade records for {total_students} students!")
        print("All student GPAs and statuses updated.")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_grades())

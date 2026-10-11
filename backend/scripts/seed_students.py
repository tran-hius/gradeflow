import asyncio
import os
import sys
from pathlib import Path
from datetime import date
import random

CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from dotenv import load_dotenv
load_dotenv(BACKEND_DIR.parent / ".env")
load_dotenv(BACKEND_DIR / ".env")

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
from app.models.user import User, Role
from app.models.student import Student, StudentStatus

CLASSES = ["CS2021A", "CS2021B", "CS2022A", "CS2022B", "CS2023A", "CS2023B"]
MAJORS = ["Computer Science", "Software Engineering", "Information Technology", "Data Science"]

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

async def seed_students():
    db_url = os.getenv("DATABASE_URL", "mysql+asyncmy://gradeflow_user:gradeflow_password_123@127.0.0.1:3306/gradeflow_db?charset=utf8mb4")
    if "@db:" in db_url:
        db_url = db_url.replace("@db:", "@127.0.0.1:")

    engine = create_async_engine(db_url, echo=False)
    session_factory = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with session_factory() as session:

        stmt = select(User).where(User.role == Role.STUDENT)
        users = (await session.scalars(stmt)).all()
        print(f"Found {len(users)} student users.")

        existing_student_user_ids = set((await session.scalars(select(Student.user_id))).all())

        new_students = []
        for idx, user in enumerate(users):
            if user.user_id in existing_student_user_ids:
                continue

            year = 2021 + (idx % 3)
            student_id = f"SV{year}{str(idx + 1).padStart if hasattr(str, 'padStart') else str(idx + 1).zfill(4)}"
            gpa = round(random.uniform(4.5, 9.5), 2)
            student = Student(
                user_id=user.user_id,
                student_id=student_id,
                class_name=CLASSES[idx % len(CLASSES)],
                major=MAJORS[idx % len(MAJORS)],
                year=year,
                gpa=gpa,
                status=get_status(gpa),
                enrolled_date=date(year, 9, 1),
            )
            new_students.append(student)

        if new_students:
            session.add_all(new_students)
            await session.commit()
            print(f"Successfully seeded {len(new_students)} students!")
        else:
            print("All student users already have profiles in students table.")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_students())

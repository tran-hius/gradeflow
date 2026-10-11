import enum

from sqlalchemy import String, Enum, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database.session import Base

class StudentStatus(str, enum.Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    AVERAGE = "average"
    AT_RISK = "at-risk"
    FAILING = "failing"

class Student(Base):
    __tablename__ = "students"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id", ondelete="CASCADE"),
        primary_key=True,
    )
    student_id: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False
    )
    class_name: Mapped[str] = mapped_column(String(50), nullable=False)
    major: Mapped[str] = mapped_column(String(100), nullable=False)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    gpa: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    status: Mapped[StudentStatus] = mapped_column(
        Enum(StudentStatus), nullable=False, default=StudentStatus.AVERAGE
    )
    enrolled_date: Mapped[str] = mapped_column(Date, nullable=False)

    user = relationship("User", lazy="joined")

    grades = relationship(
        "Grade", back_populates="student", cascade="all, delete-orphan"
    )


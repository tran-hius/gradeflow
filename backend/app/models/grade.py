from datetime import datetime
from sqlalchemy import (
    Integer,
    Float,
    ForeignKey,
    UniqueConstraint,
    CheckConstraint,
    DateTime,
    func,
    Enum,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..database.session import Base
from ..utils.enums import Subject

class Grade(Base):
    __tablename__ = "grades"
    __table_args__ = (
        UniqueConstraint("student_id", "subject", name="uq_student_subject"),
        CheckConstraint("score >= 0.0 AND score <= 10.0", name="chk_score_range"),
    )

    grade_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    student_id: Mapped[int] = mapped_column(
        ForeignKey("students.user_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    subject: Mapped[Subject] = mapped_column(
        Enum(Subject),
        nullable=False,
        index=True,
    )
    score: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    student = relationship("Student", back_populates="grades")

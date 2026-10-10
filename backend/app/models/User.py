import enum

from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column
from database.session import Base


class Role(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), nullable=False, default=Role.STUDENT)

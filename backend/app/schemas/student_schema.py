from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Literal, Optional
from datetime import date

class StudentCreate(BaseModel):

    name: str = Field(min_length=1, max_length=100)
    email: EmailStr

    student_id: str = Field(min_length=1, max_length=20)
    class_name: str = Field(min_length=1, max_length=50)
    major: str = Field(min_length=1, max_length=100)
    year: int = Field(ge=2000, le=2100)
    gpa: float = Field(ge=0.0, le=10.0, default=0.0)
    status: Literal["excellent", "good", "average", "at-risk", "failing"] = "average"
    enrolled_date: date

class StudentUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    class_name: Optional[str] = Field(default=None, min_length=1, max_length=50)
    major: Optional[str] = Field(default=None, min_length=1, max_length=100)
    year: Optional[int] = Field(default=None, ge=2000, le=2100)
    gpa: Optional[float] = Field(default=None, ge=0.0, le=10.0)
    status: Optional[
        Literal["excellent", "good", "average", "at-risk", "failing"]
    ] = None

class StudentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    student_id: str
    name: str
    email: str
    class_name: str
    major: str
    year: int
    gpa: float
    status: str
    enrolled_date: date

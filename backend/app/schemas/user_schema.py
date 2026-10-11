from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Literal

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    role: Literal["student", "teacher", "admin"] = "student"

class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    role: Literal["student", "teacher", "admin"] | None = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    name: str
    email: EmailStr
    role: str

from datetime import datetime
from typing import List
from pydantic import BaseModel, ConfigDict, Field
from ..utils.enums import Subject

class GradeCreate(BaseModel):
    student_id: int
    subject: Subject
    score: float = Field(ge=0.0, le=10.0, description="Thang điểm 10 (0.0 đến 10.0)")

class GradeUpdate(BaseModel):
    score: float = Field(ge=0.0, le=10.0, description="Thang điểm 10 (0.0 đến 10.0)")

class GradeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    grade_id: int
    student_id: int
    subject: Subject
    score: float
    created_at: datetime
    updated_at: datetime

class StudentGradesResponse(BaseModel):
    student_id: int
    student_name: str
    class_name: str
    grades: List[GradeResponse]

class MatrixRawScore(BaseModel):
    student_id: int
    subject: str
    score: float

class MatrixDatasetResponse(BaseModel):
    student_ids: List[int]
    student_names: List[str]
    subjects: List[str]
    raw_scores: List[MatrixRawScore]

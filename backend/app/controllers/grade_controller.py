from fastapi import APIRouter, Depends, status
from typing import List

from ..dependencies import get_grade_service
from ..services.grade_service import GradeService
from ..schemas.grade_schema import (
    GradeCreate,
    GradeUpdate,
    GradeResponse,
    StudentGradesResponse,
    MatrixDatasetResponse,
)
from ..utils.enums import Subject

router = APIRouter(prefix="/grades", tags=["Grades"])

@router.post(
    "",
    response_model=GradeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Nhập điểm cho sinh viên",
)
async def create_grade(
    grade_in: GradeCreate,
    service: GradeService = Depends(get_grade_service),
):
    return await service.create_grade(grade_in.model_dump())

@router.get(
    "/matrix",
    response_model=MatrixDatasetResponse,
    status_code=status.HTTP_200_OK,
    summary="Trích xuất dữ liệu ma trận phục vụ NumPy & Analytics",
)
async def get_matrix_dataset(
    service: GradeService = Depends(get_grade_service),
):
    return await service.get_matrix_dataset()

@router.get(
    "/students/{student_id}",
    response_model=StudentGradesResponse,
    status_code=status.HTTP_200_OK,
    summary="Xem bảng điểm của một sinh viên",
)
async def get_student_grades(
    student_id: int,
    service: GradeService = Depends(get_grade_service),
):
    return await service.get_student_grades(student_id)

@router.get(
    "/subjects/{subject}",
    response_model=List[GradeResponse],
    status_code=status.HTTP_200_OK,
    summary="Xem danh sách điểm của một môn học",
)
async def get_grades_by_subject(
    subject: Subject,
    service: GradeService = Depends(get_grade_service),
):
    return await service.get_grades_by_subject(subject)

@router.get(
    "/{grade_id}",
    response_model=GradeResponse,
    status_code=status.HTTP_200_OK,
    summary="Lấy chi tiết một điểm số",
)
async def get_grade_by_id(
    grade_id: int,
    service: GradeService = Depends(get_grade_service),
):
    return await service.get_grade_by_id(grade_id)

@router.patch(
    "/{grade_id}",
    response_model=GradeResponse,
    status_code=status.HTTP_200_OK,
    summary="Sửa điểm một môn",
)
async def update_grade(
    grade_id: int,
    grade_in: GradeUpdate,
    service: GradeService = Depends(get_grade_service),
):
    return await service.update_grade(grade_id, grade_in.score)

@router.delete(
    "/{grade_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa điểm một môn",
)
async def delete_grade(
    grade_id: int,
    service: GradeService = Depends(get_grade_service),
):
    await service.delete_grade(grade_id)
    return None

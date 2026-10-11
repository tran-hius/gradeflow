from fastapi import APIRouter, Depends, status, Query
from typing import List

from ..dependencies import get_student_service
from ..services.student_service import StudentService
from ..schemas.student_schema import StudentCreate, StudentUpdate, StudentResponse

router = APIRouter(prefix="/students", tags=["Students"])

@router.post(
    "",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo sinh viên mới",
)
async def create_student(
    student_in: StudentCreate,
    service: StudentService = Depends(get_student_service),
):
    return await service.create_student(student_in.model_dump())

@router.get(
    "",
    response_model=List[StudentResponse],
    status_code=status.HTTP_200_OK,
    summary="Lấy danh sách sinh viên",
)
async def get_all_students(
    skip: int = Query(0, ge=0, description="Số lượng bản ghi bỏ qua"),
    limit: int = Query(10, ge=1, le=100, description="Số lượng bản ghi tối đa"),
    service: StudentService = Depends(get_student_service),
):
    return await service.get_all_students(skip=skip, limit=limit)

@router.get(
    "/{user_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK,
    summary="Lấy chi tiết sinh viên theo user_id",
)
async def get_student_by_id(
    user_id: int,
    service: StudentService = Depends(get_student_service),
):
    return await service.get_student(user_id)

@router.patch(
    "/{user_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK,
    summary="Cập nhật thông tin sinh viên",
)
async def update_student(
    user_id: int,
    student_in: StudentUpdate,
    service: StudentService = Depends(get_student_service),
):
    update_data = student_in.model_dump(exclude_unset=True)
    return await service.update_student(user_id, update_data)

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa sinh viên",
)
async def delete_student(
    user_id: int,
    service: StudentService = Depends(get_student_service),
):
    await service.delete_student(user_id)
    return None

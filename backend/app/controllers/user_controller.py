from fastapi import APIRouter, Depends, status, Query
from typing import List

from ..dependencies import get_user_service
from ..services.user_service import UserService
from ..schemas.user_schema import UserCreate, UserUpdate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo người dùng mới",
)
async def create_user(
    user_in: UserCreate,
    service: UserService = Depends(get_user_service),
):
    return await service.create_user(user_in.model_dump())

@router.get(
    "",
    response_model=List[UserResponse],
    status_code=status.HTTP_200_OK,
    summary="Lấy danh sách người dùng",
)
async def get_all_users(
    skip: int = Query(0, ge=0, description="Số lượng bản ghi bỏ qua"),
    limit: int = Query(10, ge=1, le=100, description="Số lượng bản ghi tối đa"),
    service: UserService = Depends(get_user_service),
):
    return await service.get_all_users(skip=skip, limit=limit)

@router.get(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Lấy chi tiết người dùng theo ID",
)
async def get_user_by_id(
    user_id: int,
    service: UserService = Depends(get_user_service),
):
    return await service.get_user(user_id)

@router.patch(
    "/{user_id}",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Cập nhật thông tin người dùng",
)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    service: UserService = Depends(get_user_service),
):

    update_data = user_in.model_dump(exclude_unset=True)
    return await service.update_user(user_id, update_data)

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa người dùng",
)
async def delete_user(
    user_id: int,
    service: UserService = Depends(get_user_service),
):
    await service.delete_user(user_id)
    return None

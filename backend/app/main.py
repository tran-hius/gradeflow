from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .config.settings import settings
from .database.session import engine
from .models import Base
from .controllers.user_controller import router as user_router
from .controllers.student_controller import router as student_router
from .controllers.grade_controller import router as grade_router
from .utils.exception_handlers import AppException

@asynccontextmanager
async def lifespan(app: FastAPI):

    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"Warning: Could not auto-create tables on startup: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    debug=settings.DEBUG,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=f"{settings.API_V1_PREFIX}/docs",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "status_code": exc.status_code,
        },
    )

app.include_router(user_router, prefix=settings.API_V1_PREFIX)
app.include_router(student_router, prefix=settings.API_V1_PREFIX)
app.include_router(grade_router, prefix=settings.API_V1_PREFIX)

@app.get("/health", tags=["Health"], status_code=status.HTTP_200_OK)
async def health_check():
    return {
        "status": "healthy",
        "app": settings.PROJECT_NAME,
    }

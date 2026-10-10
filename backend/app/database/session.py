from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config.settings import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Check connection liveness before usage
    pool_size=5,  # Default pool size
    max_overflow=10,  # Max extra connections if pool is exhausted
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

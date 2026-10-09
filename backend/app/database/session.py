from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config.settings import settings

connect_args = {}
# Only apply SQLite specific arguments if the database URL uses SQLite
if settings.DATABASE_URL and settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,      # Check connection liveness before usage
    pool_size=5,             # Default pool size
    max_overflow=10          # Max extra connections if pool is exhausted
)

SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False,   
    bind=engine
)

# SQLAlchemy 2.0 standard for base model
class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
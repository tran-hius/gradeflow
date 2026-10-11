import asyncio
import os
import sys
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from dotenv import load_dotenv

load_dotenv(BACKEND_DIR.parent / ".env")
load_dotenv(BACKEND_DIR / ".env")

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
from app.models.user import Base, User, Role

SAMPLE_USERS = [

    {"name": "Trần Quản Trị", "email": "admin1@gradeflow.edu.vn", "role": Role.ADMIN},
    {"name": "Nguyễn Hoàng Nam", "email": "admin2@gradeflow.edu.vn", "role": Role.ADMIN},
    {"name": "Lê Thanh Tùng", "email": "system.admin@gradeflow.edu.vn", "role": Role.ADMIN},

    {"name": "TS. Phạm Minh Tuấn", "email": "tuan.pm@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "ThS. Đỗ Thị Thu Hà", "email": "ha.dtt@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "ThS. Vũ Quang Huy", "email": "huy.vq@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "PGS. Đinh Quốc Bảo", "email": "bao.dq@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "ThS. Hoàng Mỹ Linh", "email": "linh.hm@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "TS. Bùi Anh Dũng", "email": "dung.ba@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "ThS. Nguyễn Thị Mai", "email": "mai.nt@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "TS. Trịnh Gia Huy", "email": "huy.tg@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "ThS. Ngô Văn Khánh", "email": "khanh.nv@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "ThS. Phan Thùy Trang", "email": "trang.pt@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "TS. Võ Ngọc Long", "email": "long.vn@gradeflow.edu.vn", "role": Role.TEACHER},
    {"name": "ThS. Đặng Hữu Tài", "email": "tai.dh@gradeflow.edu.vn", "role": Role.TEACHER},

    {"name": "Nguyễn Văn An", "email": "an.nv2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Trần Thị Bích", "email": "bich.tt2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Lê Hoàng Cường", "email": "cuong.lh2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Phạm Quốc Dũng", "email": "dung.pq2003@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Hoàng Thu Giang", "email": "giang.ht2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Vũ Minh Hải", "email": "hai.vm2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Đặng Thị Hoa", "email": "hoa.dt2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Bùi Đức Hùng", "email": "hung.bd2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Ngô Ngọc Hương", "email": "huong.nn2003@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Đỗ Tuấn Kiệt", "email": "kiet.dt2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Trịnh Mỹ Lan", "email": "lan.tm2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Võ Tiến Mạnh", "email": "manh.vt2003@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Dương Tuyết Nga", "email": "nga.dt2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Lý Văn Nam", "email": "nam.lv2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Mai Thảo Nguyên", "email": "nguyen.mt2003@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Đinh Công Phát", "email": "phat.dc2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Cao Diệu Quỳnh", "email": "quynh.cd2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Phan Hữu Quân", "email": "quan.ph2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Tạ Trọng Sang", "email": "sang.tt2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Lương Thanh Tâm", "email": "tam.lt2003@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Hồ Bảo Thạch", "email": "thach.hb2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Quách Thu Thảo", "email": "thao.qt2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Lâm Quốc Thịnh", "email": "thinh.lq2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Chu Văn Thắng", "email": "thang.cv2003@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Huỳnh Phương Trinh", "email": "trinh.hp2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Nghiêm Anh Tuấn", "email": "tuan.na2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Đoàn Xuân Trường", "email": "truong.dx2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Châu Ngọc Uyên", "email": "uyen.cn2003@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "La Tấn Vĩ", "email": "vi.lt2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Tô Khánh Vy", "email": "vy.tk2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Bạch Gia Vũ", "email": "vu.bg2003@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Hà Minh Trí", "email": "tri.hm2002@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Từ Minh Khang", "email": "khang.tm2001@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Kim Yến Nhi", "email": "nhi.ky2003@gradeflow.edu.vn", "role": Role.STUDENT},
    {"name": "Thái Vĩnh Phúc", "email": "phuc.tv2002@gradeflow.edu.vn", "role": Role.STUDENT},
]

def get_db_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        user = os.getenv("MYSQL_USER", "gradeflow_user")
        password = os.getenv("MYSQL_PASSWORD", "gradeflow_password_123")
        host = os.getenv("MYSQL_HOST", "127.0.0.1")
        port = os.getenv("MYSQL_PORT", "3306")
        db = os.getenv("MYSQL_DATABASE", "gradeflow_db")
        url = f"mysql+asyncmy://{user}:{password}@{host}:{port}/{db}?charset=utf8mb4"

    if "@db:" in url:
        url = url.replace("@db:", "@127.0.0.1:")
    return url

async def seed():
    db_url = get_db_url()
    print(f"Connecting to database: {db_url}")
    engine = create_async_engine(db_url, echo=False)

    async with engine.begin() as conn:
        print("Checking & creating tables if not exists...")
        await conn.run_sync(Base.metadata.create_all)
        print("Tables verified/created successfully.")

    async_session = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:

        existing_emails_result = await session.scalars(select(User.email))
        existing_emails = set(existing_emails_result.all())

        new_users = []
        for user_data in SAMPLE_USERS:
            if user_data["email"] not in existing_emails:
                new_users.append(User(**user_data))

        if new_users:
            session.add_all(new_users)
            await session.commit()
            print(f"Successfully imported {len(new_users)} sample users into database!")
        else:
            print("All sample users already exist in database. No new records inserted.")

        total_users = await session.scalars(select(User))
        all_users = list(total_users.all())
        print(f"Total users in database: {len(all_users)}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed())

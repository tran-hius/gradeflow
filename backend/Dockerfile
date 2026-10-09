# 1. Base image Python gọn nhẹ
FROM python:3.12-slim

# 2. Thiết lập biến môi trường để Python tối ưu trong container
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 3. Đặt thư mục làm việc trong container
WORKDIR /app

# 4. Cài đặt các dependencies hệ thống (nếu cần build C extensions)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy file requirements và cài đặt packages
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 6. Copy toàn bộ mã nguồn vào container
COPY . .

# 7. Mở port 8000 cho FastAPI
EXPOSE 8000

# 8. Lệnh khởi chạy ứng dụng mặc định
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

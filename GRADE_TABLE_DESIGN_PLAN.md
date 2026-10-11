# Kế Hoạch Thiết Kế Bảng Điểm (Grades Table) — GradeFlow API

> **Mục tiêu:** Thiết kế và triển khai bảng lưu trữ điểm số học sinh (`grades`), liên kết chặt chẽ với bảng `students` và `users`, hỗ trợ đầy đủ CRUD qua REST API, và cấu trúc hóa dữ liệu đầu ra để đưa trực tiếp vào ma trận **NumPy** cho module **Academic Analytics**.

---

## 1. Kiến Trúc Dữ Liệu (Data Modeling)

### 1.1. Thực thể `Grade` và quan hệ
- **Quan hệ:** `1 Student -> N Grades` (Một sinh viên có nhiều điểm cho các môn học khác nhau).
- **Ràng buộc toàn vẹn:**
  - `student_id`: Khóa ngoại liên kết với `students.user_id` (`ON DELETE CASCADE`).
  - Mỗi sinh viên chỉ có **tối đa một điểm số duy nhất cho mỗi môn học** $\rightarrow$ Ràng buộc `UNIQUE (student_id, subject)`.
  - Điểm số hợp lệ nằm trong khoảng thang điểm 10 $\rightarrow$ `CheckConstraint: 0.0 <= score <= 10.0`.

### 1.2. Danh sách môn học chuẩn (`Subject` Enum)
Khai báo Enum chuẩn trong `app/utils/enums.py`:
```python
class Subject(str, enum.Enum):
    MATH = "math"              # Toán học
    PHYSICS = "physics"        # Vật lý
    CHEMISTRY = "chemistry"    # Hóa học
    ENGLISH = "english"        # Tiếng Anh
    LITERATURE = "literature"  # Ngữ văn
```

### 1.3. Cấu trúc bảng `grades` (MySQL)

```sql
CREATE TABLE grades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject ENUM('math', 'physics', 'chemistry', 'english', 'literature') NOT NULL,
    score FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_grades_student FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    CONSTRAINT uq_student_subject UNIQUE (student_id, subject),
    CONSTRAINT chk_score_range CHECK (score >= 0.0 AND score <= 10.0)
);

CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_subject ON grades(subject);
```

---

## 2. Chi Tiết Triển Khai Các Tầng (Implementation Blueprint)

```
[ app/models/grade.py ] ◄── (Quan hệ 1-N) ──► [ app/models/student.py ]
         │
[ app/schemas/grade_schema.py ]
         │
[ app/repositories/grade_repository.py ]
         ├── CRUD chuẩn (Thêm, Sửa, Xóa, Lấy danh sách)
         └── get_matrix_dataset() ──► Dành riêng để nạp vào NumPy
         │
[ app/services/grade_service.py ]
         │
[ app/controllers/grade_controller.py ]
```

### 2.1. Tầng Model (`app/models/grade.py`)
- Định nghĩa class `Grade(Base)` với SQLAlchemy 2.0 (`Mapped`, `mapped_column`).
- Cấu hình quan hệ hai chiều:
  - Trong `Grade`: `student = relationship("Student", back_populates="grades")`
  - Trong `Student`: `grades = relationship("Grade", back_populates="student", cascade="all, delete-orphan")`

### 2.2. Tầng Schema (`app/schemas/grade_schema.py`)
- `GradeCreate`: `student_id: int`, `subject: Subject`, `score: float = Field(ge=0.0, le=10.0)`.
- `GradeUpdate`: `score: float = Field(ge=0.0, le=10.0)`.
- `GradeResponse`: `grade_id`, `student_id`, `subject`, `score`, `created_at`.
- `StudentGradesResponse`: `student_id`, `student_name`, `class_name`, `grades: list[GradeResponse]`.

### 2.3. Tầng Repository (`app/repositories/grade_repository.py`)
- Các hàm CRUD cơ bản:
  - `get_by_id(grade_id)`
  - `get_by_student_id(student_id)`
  - `create(grade)`
  - `update(grade_id, score)`
  - `delete(grade_id)`
- **Hàm trích xuất dữ liệu ma trận phục vụ NumPy:**
  - `get_matrix_dataset()`: Truy vấn toàn bộ điểm của tất cả sinh viên, trả về dữ liệu cấu trúc phẳng:
    ```python
    {
        "student_ids": [15, 16, 17, ...],
        "student_names": ["Nguyễn Văn An", "Trần Thị Bích", ...],
        "subjects": ["math", "physics", "chemistry", "english", "literature"],
        "raw_scores": [
            {"student_id": 15, "subject": "math", "score": 8.5},
            ...
        ]
    }
    ```

### 2.4. Tầng Service (`app/services/grade_service.py`)
- Kiểm tra `student_id` có tồn tại trong bảng `students` trước khi nhập điểm.
- Bắt lỗi trùng môn học nếu sinh viên đã có điểm môn đó.
- Tự động cập nhật lại trường `gpa` trong bảng `students` khi có điểm mới hoặc khi sửa điểm.

### 2.5. Tầng Controller (`app/controllers/grade_controller.py`)
- `POST /api/v1/grades`: Nhập điểm cho sinh viên.
- `GET /api/v1/grades/students/{student_id}`: Xem bảng điểm của 1 sinh viên.
- `GET /api/v1/grades/subjects/{subject}`: Xem danh sách điểm của một môn học.
- `PATCH /api/v1/grades/{grade_id}`: Sửa điểm một môn.
- `DELETE /api/v1/grades/{grade_id}`: Xóa điểm một môn.

---

## 3. Seed Dữ Liệu Mẫu (Chuẩn bị dữ liệu cho NumPy)

Sau khi tạo bảng `grades`, chạy script nạp điểm cho **35 sinh viên** hiện có:
- Mỗi sinh viên có điểm của **5 môn**: Toán, Lý, Hóa, Anh, Văn ($35 \times 5 = 175$ bản ghi).
- Tạo phân bố điểm đa dạng có chủ đích để kiểm thử các hàm NumPy:
  - **Nhóm Xuất sắc (5 bạn):** Điểm 8.5 - 10.0 (kiểm thử xếp hạng top, phân vị `percentile 90`).
  - **Nhóm Khá/Giỏi (15 bạn):** Điểm 6.5 - 8.4.
  - **Nhóm Trung bình (10 bạn):** Điểm 5.0 - 6.4.
  - **Nhóm Nguy cơ / Cảnh báo (5 bạn):** Điểm < 5.0 hoặc có điểm liệt < 3.0 (kiểm thử thuật toán lọc `at_risk`).
  - **Nhóm học lệch:** 1-2 bạn có điểm Toán 10.0 nhưng Văn 2.0 (kiểm thử độ lệch chuẩn `std`).

---

## 4. Cầu Nối Tích Hợp Sang NumPy (`AnalyticsService`)

Sau khi có bảng `grades` và dữ liệu, tầng `AnalyticsService` chuyển đổi sang ma trận NumPy:

```python
import numpy as np

# 1. Tạo ma trận kích thước (số_sinh_viên, số_môn) khởi tạo bằng np.nan
N = len(student_ids)
M = len(subjects)
matrix = np.full((N, M), np.nan, dtype=np.float64)

# 2. Điền điểm vào tọa độ ma trận (i: sinh viên, j: môn học)
for record in raw_scores:
    i = student_idx_map[record["student_id"]]
    j = subject_idx_map[record["subject"]]
    matrix[i, j] = record["score"]

# 3. NumPy tính toán thống kê siêu tốc:
student_gpa = np.nanmean(matrix, axis=1)        # Điểm TB từng sinh viên (axis=1)
subject_avg = np.nanmean(matrix, axis=0)        # Điểm TB từng môn học (axis=0)
student_std = np.nanstd(matrix, axis=1)         # Độ lệch chuẩn (học đều hay lệch)
ranked_idx  = np.argsort(-student_gpa)          # Xếp hạng sinh viên từ cao xuống thấp
```

---

## 5. Check-list Các Bước Triển Khai (Execution Tasks)

- [ ] **Task 1:** Thêm `Subject` enum vào [enums.py](file:///D:/gradeflow/backend/app/utils/enums.py).
- [ ] **Task 2:** Tạo model `Grade` tại `app/models/grade.py` và liên kết với `students` trong [student.py](file:///D:/gradeflow/backend/app/models/student.py).
- [ ] **Task 3:** Tạo Pydantic schemas tại `app/schemas/grade_schema.py`.
- [ ] **Task 4:** Viết `GradeRepository` tại `app/repositories/grade_repository.py` (bao gồm hàm trích xuất dữ liệu ma trận).
- [ ] **Task 5:** Viết `GradeService` tại `app/services/grade_service.py` và `GradeController` tại `app/controllers/grade_controller.py`.
- [ ] **Task 6:** Đăng ký router mới vào [main.py](file:///D:/gradeflow/backend/app/main.py) và tạo bảng trong MySQL.
- [ ] **Task 7:** Tạo script `backend/scripts/seed_grades.py` nạp 175 bản ghi điểm mẫu có phân phối thống kê rõ ràng.
- [ ] **Task 8:** Kiểm thử toàn bộ API điểm số trên Swagger UI (`/docs`).
- [ ] **Task 9:** Bắt đầu xây dựng `AnalyticsService` với NumPy dựa trên dữ liệu từ bảng điểm này.

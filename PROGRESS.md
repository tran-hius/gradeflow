# GradeFlow — Tiến Độ Triển Khai & Bàn Giao Dự Án

> Tài liệu tổng hợp kiến trúc hệ thống, các module đã hoàn thành và hướng dẫn cho giai đoạn phân tích thống kê với NumPy.

---

## 1. Trạng Thái Hệ Thống (System Status)
- **Database (MySQL 8.0):** Đang chạy trên port `3306`, cơ sở dữ liệu `gradeflow_db`, tài khoản `gradeflow_user`.
- **Backend (FastAPI):** Đang chạy trên port `8000` (`http://localhost:8000/api/v1/docs`).
  - Đã chuyển đổi hoàn toàn sang kiến trúc bất đồng bộ `asyncmy` + `AsyncSession`.
  - Quản lý Dependency Injection tập trung tại `backend/app/dependencies.py`.
- **Frontend (Next.js 16 App Router):** Đang chạy trên port `3000` (`http://localhost:3000/students`).
  - Docker node:20-alpine tương thích hoàn toàn Next.js 16.
  - Xử lý Hybrid SSR/CSR Axios: Container gọi `http://api:8000/api/v1`, Browser gọi `http://localhost:8000/api/v1`.

---

## 2. Các Module Đã Triển Khai

### 2.1. Phân Hệ Users & Students
- Bảng `users` (id, name, email, role) liên kết 1:1 với bảng `students` (user_id, student_id, class_name, major, year, gpa, status, enrolled_date).
- CRUD đồng bộ 2 bảng tự động qua `StudentService`.
- Nút **Add Student** đặt thẳng hàng cạnh nút **Xuất** trong toolbar, có Modal Thêm mới và Chỉnh sửa đầy đủ.

### 2.2. Phân Hệ Điểm Số (Grades Module)
- Bảng `grades`: Khóa ngoại `student_id -> students.user_id` (`ON DELETE CASCADE`).
- Ràng buộc: `UNIQUE (student_id, subject)`, `CHECK (score >= 0.0 AND score <= 10.0)`.
- Enum `Subject`: `math`, `physics`, `chemistry`, `english`, `literature`.
- Đã nạp 170 bản ghi điểm mẫu cho 34 sinh viên qua script `backend/scripts/seed_grades.py`.
### 2.3. Phân Hệ Giao Diện Phân Tích Học Thuật (Academic Analytics Dashboard)
- Giao diện hiện đại tại `/analytics` (`AnalyticsPageClient.tsx`) sử dụng `recharts`, `framer-motion`, `@radix-ui`, `lucide-react`.
- Trực quan hóa 16 bài toán phân tích với 4 Tabs tương tác chuyên sâu:
  1. **Tổng quan & Phổ điểm:** KPI Cards (Điểm TB toàn trường, Độ lệch chuẩn toàn khóa, Tỷ lệ đạt chuẩn %), Histogram BarChart 7 khoảng điểm (`np.histogram`), Xếp loại học lực 5 bậc (`np.select`).
  2. **Phân tích môn học:** So sánh Điểm TB, Max, Min, Độ lệch chuẩn $\sigma$ và Phương sai (đo mức độ phân hóa đề thi), Tỷ lệ qua môn và vinh danh Thủ khoa từng môn.
  3. **Trọng số & Xếp hạng:** Bộ công cụ tương tác chỉnh số tín chỉ 5 môn tính Weighted GPA tức thì (Vector Dot Product/Broadcasting), Bảng vinh danh Top 5 sinh viên với huy hiệu Vàng/Bạc/Đồng (`argsort`).
  4. **Cảnh báo sớm & Học lệch:** Thanh trượt lọc sinh viên nguy cơ (GPA < ngưỡng hoặc điểm liệt < 3.0), Bảng phát hiện sinh viên học lệch ($\sigma \ge 1.8$).
  5. **Tính năng Xuất dữ liệu:** Xuất báo cáo cấu trúc JSON/CSV hoàn chỉnh.

---

## 3. Kế Hoạch 16 Bài Toán NumPy Analytics
Xem chi tiết toàn bộ công thức, mã nguồn và kiến trúc tại [NUMPY_ANALYTICS_PLAN.md](file:///D:/gradeflow/NUMPY_ANALYTICS_PLAN.md).
- Toàn bộ module analytics bằng NumPy ở phía backend đã được để trống để lập trình viên tự tay triển khai.


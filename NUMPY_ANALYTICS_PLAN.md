# Kế Hoạch Triển Khai Phân Tích Thống Kê Điểm Số Với NumPy (Academic Analytics)

> **Mục tiêu:** Xây dựng module phân tích học thuật độc lập bằng thư viện **NumPy**, áp dụng tư duy tính toán mảng nhiều chiều (**Vectorization**) và loại bỏ hoàn toàn các vòng lặp `for` chậm chạp. Module này sẽ lấy dữ liệu ma trận từ `GradeRepository` và xử lý toàn bộ 16 bài toán thống kê thực tế.

---

## 1. Kiến Trúc Dữ Liệu & Quy Ước Ma Trận (Matrix Conventions)

Mọi bài toán phân tích đều vận hành trên ma trận điểm số 2 chiều $M \in \mathbb{R}^{N \times S}$:
- **$N$:** Tổng số sinh viên (Trục hàng: `axis=1`).
- **$S$:** Tổng số môn học (Trục cột: `axis=0`).
- **Phần tử $M[i, j]$:** Điểm số môn thứ $j$ của sinh viên thứ $i$.
- **Giá trị khuyết thiếu:** Đại diện bởi `np.nan` (Not a Number) khi sinh viên chưa thi/vắng thi.

```
                  Toán(0)    Lý(1)    Hóa(2)    Anh(3)    Văn(4)
Sinh viên 0 (i=0) [ 8.5       9.0      7.5       8.0       8.5  ]  ──► axis=1 (Sinh viên)
Sinh viên 1 (i=1) [ 6.0       6.5      5.5       7.0       6.0  ]
Sinh viên 2 (i=2) [ 9.5      10.0      8.0       np.nan    4.0  ]  (có điểm thiếu)
Sinh viên 3 (i=3) [ 3.0       2.5      4.0       3.5       2.0  ]  (nguy cơ)
                     │
                     ▼
                   axis=0 (Môn học)
```

---

## 2. Bản Kế Hoạch Chi Tiết 16 Bài Toán NumPy

---

### Nhóm I: Thống Kê Cơ Bản & Phép Giảm Trục (Reductions)

#### Bài 01: Tính điểm trung bình của toàn bộ lớp / trường
* **Mục tiêu:** Đo lường mặt bằng điểm chung của toàn bộ học kỳ trên tất cả các môn.
* **Hàm NumPy:** `np.nanmean(matrix)`
* **Công thức toán:** $\mu = \frac{1}{|V|} \sum_{(i,j) \in V} M[i, j]$ (với $V$ là tập các ô có điểm hợp lệ).
* **Code mẫu triển khai:**
  ```python
  overall_mean = float(np.nanmean(matrix))
  ```
* **Đầu ra:** Giá trị float (vd: `7.24`).

#### Bài 02: Tính điểm trung bình (GPA) của từng sinh viên
* **Mục tiêu:** Tính điểm tổng kết trung bình môn cho từng sinh viên làm cơ sở xếp loại và cấp học bổng.
* **Hàm NumPy:** `np.nanmean(matrix, axis=1)`
* **Quy ước trục:** `axis=1` quét ngang qua tất cả các cột của từng hàng.
* **Code mẫu triển khai:**
  ```python
  student_gpas = np.nanmean(matrix, axis=1)
  # Xử lý sinh viên không có bất kỳ điểm nào (tránh nan)
  student_gpas = np.nan_to_num(student_gpas, nan=0.0)
  ```
* **Đầu ra:** Mảng 1D kích thước $(N,)$ chứa GPA của $N$ sinh viên.

#### Bài 03: Tính điểm trung bình của từng môn học
* **Mục tiêu:** Đo lường độ khó/dễ của từng môn học (môn nào lớp làm bài tốt, môn nào điểm thấp).
* **Hàm NumPy:** `np.nanmean(matrix, axis=0)`
* **Quy ước trục:** `axis=0` quét dọc từ trên xuống dưới qua từng cột môn học.
* **Code mẫu triển khai:**
  ```python
  subject_means = np.nanmean(matrix, axis=0)
  ```
* **Đầu ra:** Mảng 1D kích thước $(S,)$ tương ứng điểm TB của từng môn.

---

### Nhóm II: Truy Vấn, Cắt Lát & Điểm Cực Trị

#### Bài 04: Lấy điểm của một sinh viên hoặc một nhóm môn
* **Mục tiêu:** Truy vấn nhanh lát cắt dữ liệu (Sub-matrix / Vector) mà không cần duyệt dữ liệu tuần tự.
* **Kỹ thuật NumPy:** 2D Slicing & Fancy Indexing.
* **Code mẫu triển khai:**
  ```python
  # 1. Lấy toàn bộ điểm của sinh viên thứ i (hàng i, tất cả cột)
  student_scores = matrix[i, :]

  # 2. Lấy điểm của khối tự nhiên (Toán=0, Lý=1, Hóa=2) cho tất cả sinh viên
  science_block = matrix[:, [0, 1, 2]]

  # 3. Lấy điểm của sinh viên k môn tự nhiên
  student_science_scores = matrix[k, :3]
  ```

#### Bài 05: Tìm điểm cao nhất, thấp nhất từng môn & sinh viên thủ khoa môn
* **Mục tiêu:** Tìm ra điểm Max/Min của từng môn học và xác định sinh viên đạt điểm số đó.
* **Hàm NumPy:** `np.nanmax()`, `np.nanmin()`, `np.nanargmax()`, `np.nanargmin()`.
* **Code mẫu triển khai:**
  ```python
  # Điểm cao nhất, thấp nhất từng môn
  max_per_subject = np.nanmax(matrix, axis=0)
  min_per_subject = np.nanmin(matrix, axis=0)

  # Index sinh viên đạt điểm cao nhất từng môn
  top_student_idx_per_sub = np.nanargmax(matrix, axis=0)
  ```
* **Ứng dụng:** Tuyên dương thủ khoa môn: `student_names[top_student_idx_per_sub[0]]` là thủ khoa Toán.

#### Bài 06: Đo độ phân tán điểm của từng môn học
* **Mục tiêu:** Xác định môn học có phân hóa mạnh hay điểm số đồng đều (Độ lệch chuẩn & Phương sai).
* **Hàm NumPy:** `np.nanstd(matrix, axis=0)`, `np.nanvar(matrix, axis=0)`.
* **Ý nghĩa:**
  - $\sigma$ lớn: Đề thi có độ phân hóa cao, học lực chênh lệch lớn giữa sinh viên giỏi và yếu.
  - $\sigma$ nhỏ: Điểm số tập trung sát quanh giá trị trung bình.
* **Code mẫu triển khai:**
  ```python
  subject_stds = np.nanstd(matrix, axis=0)
  subject_vars = np.nanvar(matrix, axis=0)
  ```

---

### Nhóm III: Lọc Dữ Liệu & Phân Loại (Boolean Masking & Conditions)

#### Bài 07: Đếm số lượng sinh viên đạt từ 5.0 trở lên
* **Mục tiêu:** Thống kê tỷ lệ sinh viên đạt chuẩn môn học và chuẩn GPA.
* **Kỹ thuật NumPy:** Boolean indexing kết hợp `np.sum()`.
* **Code mẫu triển khai:**
  ```python
  # 1. Đếm sinh viên có GPA >= 5.0
  passed_students_count = int(np.sum(student_gpas >= 5.0))

  # 2. Đếm số lượng sinh viên đạt >= 5.0 cho từng môn học (axis=0)
  passed_per_subject = np.sum(matrix >= 5.0, axis=0)
  ```

#### Bài 08: Phân loại Đạt / Trượt (Pass / Fail)
* **Mục tiêu:** Tạo ma trận trạng thái phân loại nhị phân cho từng môn hoặc từng sinh viên.
* **Hàm NumPy:** `np.where(condition, x, y)`.
* **Code mẫu triển khai:**
  ```python
  # 1. Ma trận Pass/Fail từng môn
  pass_fail_matrix = np.where(matrix >= 5.0, "Pass", "Fail")

  # 2. Phân loại sinh viên tốt nghiệp / chưa tốt nghiệp
  student_status = np.where(student_gpas >= 5.0, "Qualified", "Unqualified")
  ```

#### Bài 09: Phân loại học lực theo các thang điểm ngưỡng
* **Mục tiêu:** Xếp loại học lực tự động (Xuất sắc, Giỏi, Khá, Trung bình, Yếu) dựa trên GPA.
* **Hàm NumPy:** `np.select(condlist, choicelist, default)`.
* **Code mẫu triển khai:**
  ```python
  conditions = [
      student_gpas >= 8.5,
      student_gpas >= 7.0,
      student_gpas >= 6.0,
      student_gpas >= 5.0,
  ]
  choices = ["Xuất sắc", "Giỏi", "Khá", "Trung bình"]
  academic_rank = np.select(conditions, choices, default="Yếu")
  ```
* **Đặc tính:** Chạy toàn bộ mảng trong 1 bước tính toán song song vector, không cần chuỗi `if-elif-else`.

---

### Nhóm IV: Phép Toán Mảng Nâng Cao & Xếp Hạng

#### Bài 10: Tính điểm tổng kết theo trọng số tín chỉ (Weighted GPA)
* **Mục tiêu:** Các môn có số tín chỉ khác nhau (Toán 4 tín, Lý 3 tín, Văn 2 tín...). Tính điểm trung bình có trọng số.
* **Kỹ thuật NumPy:** Broadcasting & Vector Dot Product (`np.dot` hoặc `np.average`).
* **Công thức toán:** $GPA_w = \frac{\sum_{j=1}^{S} w_j \cdot M[i, j]}{\sum_{j=1}^{S} w_j}$
* **Code mẫu triển khai:**
  ```python
  weights = np.array([4.0, 3.0, 3.0, 2.0, 2.0], dtype=np.float64)  # Trọng số tín chỉ

  # Cách 1: Sử dụng np.average với weights
  weighted_gpas = np.average(np.nan_to_num(matrix), axis=1, weights=weights)

  # Cách 2: Sử dụng broadcasting và np.dot
  weighted_gpas = np.dot(matrix, weights) / np.sum(weights)
  ```

#### Bài 11: Xếp hạng và tìm Top 3 sinh viên xuất sắc
* **Mục tiêu:** Xếp thứ hạng từ 1 đến N và trích xuất danh sách khen thưởng.
* **Hàm NumPy:** `np.argsort()` (trả về mảng các chỉ số index sau khi sắp xếp).
* **Code mẫu triển khai:**
  ```python
  # Sắp xếp giảm dần bằng dấu âm:
  sorted_indices = np.argsort(-student_gpas)

  # Top 3 sinh viên:
  top_3_indices = sorted_indices[:3]
  for rank, idx in enumerate(top_3_indices, 1):
      print(f"Hạng {rank}: ID={student_ids[idx]}, GPA={student_gpas[idx]:.2f}")
  ```

#### Bài 12: Tìm sinh viên cần hỗ trợ học tập (At-risk Early Warning)
* **Mục tiêu:** Cảnh báo sớm các sinh viên có nguy cơ bị cảnh cáo học vụ.
* **Điều kiện:** GPA < 5.0 HOẶC có bất kỳ môn nào bị điểm liệt (< 3.0).
* **Kỹ thuật NumPy:** Phép toán logic mảng bitwise `|` và `np.any()`.
* **Code mẫu triển khai:**
  ```python
  is_low_gpa = student_gpas < 5.0
  has_failing_subject = np.any(matrix < 3.0, axis=1)

  at_risk_mask = is_low_gpa | has_failing_subject
  at_risk_student_indices = np.where(at_risk_mask)[0]
  ```

---

### Nhóm V: Phân Tích Chuyên Sâu & Xử Lý Dữ Liệu Khuyết Thiếu

#### Bài 13: So sánh kết quả giữa hai học kỳ (Semester 1 vs Semester 2)
* **Mục tiêu:** Đo lường sự tiến bộ/sụt giảm điểm số của sinh viên và từng môn học qua thời gian.
* **Kỹ thuật NumPy:** Phép trừ ma trận cùng kích thước (Element-wise matrix subtraction).
* **Code mẫu triển khai:**
  ```python
  # delta_matrix[i, j] = Điểm kỳ 2 - Điểm kỳ 1
  delta = sem2_matrix - sem1_matrix

  # 1. Mức độ tiến bộ của từng sinh viên:
  student_progress = np.nanmean(delta, axis=1)

  # 2. Môn học có sự tiến bộ rõ rệt nhất toàn trường:
  subject_progress = np.nanmean(delta, axis=0)
  ```

#### Bài 14: Phát hiện điểm bất thường (Outlier Detection / Z-Score)
* **Mục tiêu:** Phát hiện những điểm số dị biệt (nhập sai điểm, gian lận, hoặc sinh viên học lệch bất thường).
* **Công thức Z-score:** $Z = \frac{X - \mu}{\sigma}$ (Nếu $|Z| > 2.5 \Rightarrow$ Outlier).
* **Code mẫu triển khai:**
  ```python
  mean_sub = np.nanmean(matrix, axis=0)
  std_sub = np.nanstd(matrix, axis=0)

  # Broadcasting trừ vector trung bình và chia độ lệch chuẩn:
  z_scores = (matrix - mean_sub) / (std_sub + 1e-8)

  # Vị trí các điểm dị biệt (hàng i, cột j)
  outlier_coords = np.where(np.abs(z_scores) > 2.5)
  ```

#### Bài 15: Xử lý điểm bị thiếu (Missing Value Imputation)
* **Mục tiêu:** Xử lý các giá trị `np.nan` trước khi đưa vào các thuật toán Machine Learning hoặc tính toán đòi hỏi ma trận đầy đủ.
* **Chiến lược:**
  1. Kiểm tra vị trí thiếu: `np.isnan(matrix)`.
  2. Điền thế (Imputation) bằng trung bình môn tương ứng.
* **Code mẫu triển khai:**
  ```python
  # Tạo bản sao
  imputed_matrix = matrix.copy()

  # Lấy trung bình từng môn
  sub_means = np.nanmean(matrix, axis=0)

  # Tìm các vị trí nan và thay bằng sub_means tương ứng (sử dụng np.where)
  nan_indices = np.where(np.isnan(imputed_matrix))
  imputed_matrix[nan_indices] = np.take(sub_means, nan_indices[1])
  ```

#### Bài 16: Tổng hợp báo cáo hoàn chỉnh cho API
* **Mục tiêu:** Kết nối kết quả của 15 bài toán trên thành một cấu trúc Python dict hoàn chỉnh để trả về qua FastAPI endpoint `/api/v1/analytics/overview`.
* **Cấu trúc JSON đầu ra mẫu:**
  ```python
  return {
      "summary": {
          "overall_mean": overall_mean,
          "total_students": N,
          "passed_students": passed_students_count,
          "at_risk_count": len(at_risk_student_indices),
      },
      "subjects": [
          {
              "subject": subjects[j],
              "mean": subject_means[j],
              "std": subject_stds[j],
              "highest": max_per_subject[j],
              "lowest": min_per_subject[j],
              "pass_rate": round(passed_per_subject[j] / N * 100, 1),
          }
          for j in range(S)
      ],
      "rankings": {
          "top_3": [
              {"rank": r, "name": student_names[idx], "gpa": student_gpas[idx]}
              for r, idx in enumerate(top_3_indices, 1)
          ],
          "at_risk": [
              {"name": student_names[idx], "gpa": student_gpas[idx]}
              for idx in at_risk_student_indices
          ],
      },
  }
  ```

---

## 3. Lộ Trình Triển Khai Step-by-Step Cho Bạn

Bạn có thể tự tay triển khai lần lượt theo 4 giai đoạn logic sau:

```
[ Giai đoạn 1: Chuẩn bị Ma trận ]
   └── Viết hàm nạp dữ liệu từ GradeRepository thành ma trận numpy (N, S)

[ Giai đoạn 2: Viết Module Core NumPy Analytics (pure Python/NumPy) ]
   ├── File: backend/app/services/analytics_engine.py
   ├── Chứa class AcademicAnalytics(matrix: np.ndarray)
   └── Viết các method độc lập giải quyết Bài 01 -> Bài 15

[ Giai đoạn 3: Viết Schema & Service Tích Hợp ]
   ├── File: backend/app/schemas/analytics_schema.py
   └── File: backend/app/services/analytics_service.py (gọi engine + nạp DB)

[ Giai đoạn 4: Viết Controller & Đăng Ký API ]
   ├── File: backend/app/controllers/analytics_controller.py
   └── Kiểm thử trên Swagger UI (/docs)
```

---

## 4. File Test Mẫu Để Bạn Chạy Thử Tại Chỗ

Bạn có thể tạo một file script test nhanh tại `backend/scripts/test_numpy_analytics.py` để chạy thử tất cả 16 bài toán trên dữ liệu thật của 34 sinh viên:

```python
import asyncio
import numpy as np
from app.database.session import async_sessionmaker, create_async_engine
from app.repositories.grade_repository import GradeRepository

async def run():
    engine = create_async_engine("mysql+asyncmy://gradeflow_user:gradeflow_password_123@127.0.0.1:3306/gradeflow_db?charset=utf8mb4")
    async with async_sessionmaker(engine)() as session:
        repo = GradeRepository(session)
        data = await repo.get_matrix_dataset()

        N, S = len(data["student_ids"]), len(data["subjects"])
        matrix = np.full((N, S), np.nan)
        s_map = {sid: i for i, sid in enumerate(data["student_ids"])}
        sub_map = {sub: j for j, sub in enumerate(data["subjects"])}
        for r in data["raw_scores"]:
            matrix[s_map[r["student_id"]], sub_map[r["subject"]]] = r["score"]

        print(f"=== MA TRẬN ĐIỂM SỐ ({N} SV x {S} MÔN) ===")
        print("Bài 01 - TB toàn lớp:", np.nanmean(matrix))
        print("Bài 02 - GPA 5 bạn đầu:", np.nanmean(matrix, axis=1)[:5])
        print("Bài 03 - TB từng môn:", np.nanmean(matrix, axis=0))
        print("Bài 05 - Max từng môn:", np.nanmax(matrix, axis=0))
        print("Bài 06 - Độ lệch chuẩn môn:", np.nanstd(matrix, axis=0))
        print("Bài 07 - Số bạn GPA >= 5.0:", np.sum(np.nanmean(matrix, axis=1) >= 5.0))
        print("Bài 11 - Top 3 SV index:", np.argsort(-np.nanmean(matrix, axis=1))[:3])

if __name__ == "__main__":
    asyncio.run(run())
```

# Đánh Giá Tiến Độ Dự Án NomNam (trước đây: CaliTrack)

> **Lưu ý (2026-10-05):** Tài liệu này mô tả bản draft v0.1 và đã lỗi thời. Trạng thái hiện tại xem [checklist.md](checklist.md), thay đổi xem [changelog.md](changelog.md).

Dựa trên yêu cầu ban đầu của bạn, dưới đây là bảng đánh giá chi tiết những gì chúng ta đã làm được, những gì còn thiếu, và các hướng nâng cấp tiếp theo để hoàn thiện web app.

## 1. Bảng Đối Chiếu Yêu Cầu (Checklist)

| Yêu cầu ban đầu | Trạng thái | Chi tiết / Đánh giá |
| :--- | :---: | :--- |
| **Tính toán & Theo dõi Calorie intake** | 🔄 Đang làm | Đã làm UI tính toán calo cho 1 bữa ăn. *Chưa có Dashboard theo dõi tổng ngày.* |
| **Ước lượng bằng hình ảnh (Visual Portion)** | ✅ Hoàn thành | Đã xây dựng UI thanh trượt (Slider) thay đổi hình ảnh theo số gram. |
| **Thêm/Bớt thành phần (Nước lèo, rau,...)** | ✅ Hoàn thành | Đã làm UI Modifiers (Cộng trừ calo trực tiếp). |
| **Theo dõi Cân nặng, Tỉ lệ cơ/mỡ** | ❌ Chưa làm | Cần xây dựng màn hình Profile & Biểu đồ theo dõi theo thời gian. |
| **Ghi nhận Vận động (Đá bóng, Gym)** | ❌ Chưa làm | Cần xây dựng module trừ calo vận động vào tổng calo hàng ngày. |
| **Tính toán lượng Calo/Protein cần thiết** | ❌ Chưa làm | Cần làm form nhập liệu (Tuổi, Chiều cao, Cân nặng, Mục tiêu) để tính TDEE. |
| **[Thêm mới] Nhận diện món ăn bằng AI** | ✅ Hoàn thành | Tích hợp thành công Gemini 2.5 Flash để đọc ảnh mâm cơm. |

---

## 2. Điểm Tốt (Những gì đã hoạt động ổn)

> [!TIP] Thiết kế UI/UX hiện đại
> Việc sử dụng Tailwind CSS và shadcn/ui mang lại giao diện rất gọn gàng, giống các ứng dụng native trên điện thoại (đặc biệt phù hợp khi cài đặt dưới dạng PWA).

*   **Tính năng AI Photo Log:** Chạy trực tiếp trên trình duyệt, gọi API thẳng đến Google nên tốc độ phản hồi nhanh, bảo mật cao (chỉ dùng API key của chính bạn) và hoàn toàn miễn phí.
*   **Kiến trúc linh hoạt:** Việc kết hợp AI + Visual Slider + Modifiers giải quyết triệt để bài toán khó nhất của các app Calorie: "Người dùng lười nhập liệu và không biết ước lượng".

---

## 3. Điểm Chưa Ổn (Cần khắc phục ngay)

> [!WARNING] Dữ liệu đang là giả lập (Mock Data)
> Hiện tại hình ảnh và lượng calo gốc (150kcal/100g) đang được "hardcode" (viết cứng) trong code để test giao diện.

*   **Hình ảnh minh họa:** Visual Slider đang dùng ảnh ngẫu nhiên trên mạng. Chúng ta cần tạo một bộ Cơ sở dữ liệu (Database) thực sự chứa ảnh của 100g, 200g thịt, cơm...
*   **Chưa có "Bộ nhớ" (Database):** Bạn bấm nút "Lưu vào nhật ký" hiện tại chưa có tác dụng vì chúng ta chưa kết nối Supabase hoặc LocalStorage. F5 lại trang là mất dữ liệu.

---

## 4. Lộ trình Nâng Cấp (Upgrades)

Để biến bản Demo này thành một Web App hoàn chỉnh sử dụng hàng ngày, tôi đề xuất lộ trình sau:

### Giai đoạn 1: Hoàn thiện Database (Ưu tiên cao nhất)
*   Tích hợp **Supabase** (hoặc IndexedDB cục bộ).
*   Tạo bảng `foods` (chứa tên món, calo gốc, và link ảnh cho từng mức khối lượng).
*   Làm cho nút **"Lưu vào nhật ký"** hoạt động thực sự.

### Giai đoạn 2: Xây dựng Dashboard (Tổng quan ngày)
*   Thêm màn hình Home hiển thị: **Tổng Calo Đã Ăn / Mục Tiêu Calo**.
*   Thêm 3 vòng tròn (Rings) tiến độ cho **Protein, Carbs, Fats**.
*   Form tính TDEE (để tự động tính Mục Tiêu Calo dựa trên việc bạn muốn tăng cơ hay giảm mỡ).

### Giai đoạn 3: Body & Activity Tracking
*   Thêm nút **"Log Activity"** (Đá bóng, Gym...) -> Tự động tính toán lượng calo đốt được và cộng thêm vào quỹ calo được phép ăn trong ngày.
*   Thêm trang biểu đồ đường (Line Chart) theo dõi Cân nặng và Body Fat.

### Giai đoạn 4: Trải nghiệm AI mượt mà hơn
*   Hiển thị hình ảnh crop (cắt đúng vào món ăn) thay vì chỉ hiển thị tên món khi AI nhận diện.
*   Cho phép AI tự động nhận diện nhiều món cùng lúc trong 1 bức ảnh và tạo ra nhiều khung Visual Slider (ví dụ: mâm cơm có Cơm, Thịt, Canh -> Tạo ra 3 slider).

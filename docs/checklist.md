# Checklist tính năng — NomNam

Đối chiếu với các app tham khảo (MacroFactor, Cronometer, MyFitnessPal, Lose It!, Cal AI). Cột "v0.1" là bản draft ban đầu, "v0.2" là bản hiện tại.

| Nhóm | Tính năng | v0.1 | v0.2 |
|---|---|:-:|:-:|
| **Nền tảng** | Build pass, lint 0 cảnh báo, type-check sạch | ❌ | ✅ |
| | Unit test cho công thức (BMR, macro, MET, ngày, tìm kiếm, DB món) | ❌ | ✅ 48 test (gồm store: thêm/xoá/Hoàn tác, sync merge) |
| | Lưu dữ liệu bền vững (F5 không mất) | ❌ | ✅ IndexedDB |
| | Đồng bộ điện thoại ↔ máy tính | ❌ | ✅ Supabase (cần cấu hình .env + chạy SQL) |
| | Offline vẫn log, tự đồng bộ khi có mạng | ❌ | ✅ outbox |
| | Cài lên màn hình điện thoại (PWA) | ❌ | ✅ |
| **Hôm nay** | Phương trình Mục tiêu − Đã ăn + Tập (50%) = Còn lại | ❌ | ✅ |
| | Vòng calo + thanh Protein nổi bật, Carbs / Fat / Xơ | ❌ | ✅ |
| | Chia bữa Sáng / Trưa / Tối / Ăn vặt | ❌ | ✅ |
| | Sửa gram / đổi bữa / xoá + Hoàn tác | ❌ | ✅ |
| | Dải 7 ngày có chấm đạt/không đạt, xem lại ngày cũ | ❌ | ✅ |
| **Log món** | Tìm không dấu, gõ đến đâu ra đến đó | ❌ | ✅ |
| | Gần đây / Hay ăn (theo bữa) / Bữa mẫu / Món của tôi | ❌ | ✅ |
| | Thêm 1 chạm (nút + cạnh món, nhớ khẩu phần lần trước) | ❌ | ✅ |
| | Khẩu phần chuẩn (chén, quả, tô, muỗng) × số lượng, hoặc gram tự do | ⚠️ ±50g | ✅ |
| | Nhập nhanh kcal / macro | ❌ | ✅ |
| | Chép bữa / cả ngày hôm trước | ❌ | ✅ |
| | Thêm nhiều món liên tục, thanh tổng "Đã thêm N món" | ❌ | ✅ |
| | DB món Việt có chất xơ | ⚠️ 13 món | ✅ ~110 món |
| | Tạo món riêng (theo nhãn dinh dưỡng) | ❌ | ✅ |
| | Lưu bữa mẫu (combo) | ❌ | ✅ |
| | Quét mã vạch | ❌ | ⏳ chưa làm |
| **AI** | Gõ mô tả → tách món kèm gram, kcal, P/C/F/xơ | ❌ | ✅ |
| | Chụp ảnh → nhiều món | ⚠️ 1 món, lỗi | ✅ |
| | Màn kiểm tra: sửa tên/gram, bỏ món, đánh dấu ước lượng thô | ❌ | ✅ |
| **Vận động** | 12 môn (đá banh, gym, chạy, đạp xe, bơi, cầu lông, pickleball…) × cường độ × thời gian → kcal (MET) | ❌ | ✅ |
| | Nhập kcal tay (từ đồng hồ) | ❌ | ✅ |
| **Mục tiêu** | TDEE Mifflin-St Jeor, chọn giảm mỡ / giữ cân / tăng cơ | ⚠️ không lưu | ✅ |
| | Tách NEAT khỏi buổi tập (tránh tính 2 lần) | ❌ | ✅ |
| | Tự đặt mục tiêu (override), chỉnh % calo tập ăn lại | ❌ | ✅ |
| **Tuần** | Biểu đồ kcal vs quỹ ngày, protein vs mục tiêu | ❌ | ✅ |
| | Bảng ✓/✗ từng ngày, chuỗi ngày đạt, trung bình tuần | ❌ | ✅ |
| | Gợi ý (thiếu protein → thêm bao nhiêu whey/ức gà) | ❌ | ✅ |
| | Cân nặng + trung bình 7 ngày + thay đổi/tuần | ❌ | ✅ |
| **UX** | Bottom nav, dark mode, animation, empty state | ❌ | ✅ |
| | Xuất CSV, sao lưu / khôi phục JSON | ❌ | ✅ |
| **An toàn** | `.env` trong .gitignore | ❌ | ✅ |
| | RLS Supabase (chỉ đọc/ghi dữ liệu của mình) | ❌ | ✅ |
| | Validate dữ liệu AI (zod) | ❌ | ✅ |

## Ý tưởng tiếp theo

- Quét mã vạch sản phẩm đóng gói (Open Food Facts).
- Mục tiêu thích ứng kiểu MacroFactor: điều chỉnh kcal theo xu hướng cân nặng thực tế 2–3 tuần.
- Lưu snapshot mục tiêu theo ngày (để lịch sử không đổi khi đổi mục tiêu).
- Nhắc log bữa (Web Push) và nhắc cân buổi sáng.
- Ảnh khẩu phần tham chiếu (bộ ảnh `public/images/food/beef/*` hiện chưa dùng).

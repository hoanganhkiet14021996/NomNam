# Phân Tích & Phát Hiện (Findings) - NomNam

Tài liệu này lưu trữ những vấn đề kỹ thuật và các quyết định thiết kế đã được thảo luận trong quá trình phát triển web app NomNam (tên cũ: CaliTrack).

## 1. Vấn đề liên quan đến UI / Frontend Stack
*   **Tailwind CSS v4 & shadcn/ui:** Trình khởi tạo `npx shadcn@latest init` hiện tại chưa hỗ trợ tốt cấu trúc không cần file config của Tailwind v4. **Quyết định:** Khóa phiên bản Tailwind ở v3 (`tailwindcss@3`) để đảm bảo hệ sinh thái UI hoạt động mượt mà.
*   **Vite & Đường dẫn (Alias):** `shadcn` yêu cầu đường dẫn `@/*` trỏ vào `./src/*`. Với Vite 5+, cấu trúc tsconfig bị chia làm 3 file (`tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`). Đã tiến hành gộp/bổ sung `compilerOptions` vào root `tsconfig.json` để các tool tự động (như shadcn CLI) đọc được chính xác đường dẫn.

## 2. Vấn đề liên quan đến AI (Gemini)
*   **Chi phí:** Đã quyết định sử dụng mô hình BYOK (Bring Your Own Key) kết hợp với Google Gemini 1.5/2.5 Flash API qua Google AI Studio. 
*   **Lợi ích:** API này có gói miễn phí (Free Tier) cực kỳ hào phóng (15 request/phút, 1500 request/ngày), hoàn toàn dư sức đáp ứng cho nhu cầu theo dõi lượng calo ăn uống hàng ngày của cá nhân mà không tốn một đồng chi phí duy trì.
*   **SDK:** Sử dụng SDK thế hệ mới `@google/genai` thay cho phiên bản cũ.
*   **AI nhận diện, bảng món tính số (2026-10):** AI tự ước kcal thì mỗi lần mỗi khác. Quyết định: AI trả thành phần + `foodId` + gram; app tính dinh dưỡng từ `foods.vn.ts`. Chỉ khớp theo id hoặc tên/alias **chính xác** không dấu (không khớp mờ để tránh nhầm món một cách tự tin). Sai số còn lại nằm ở nhận diện và gram → xử lý bằng câu hỏi lại, top 3 ứng viên, khẩu phần quen.
*   **Khẩu phần quen tính từ log, không lưu riêng:** log đã lưu gram người dùng chốt và đã sync → trung vị 10 lần gần nhất, không cần bảng mới.
*   **Món chờ bổ sung qua Supabase:** agent food-researcher chạy trên máy tính, không đọc được IndexedDB của điện thoại → bảng `food_requests` + script `npm run food-requests` (người dùng tự nhập PIN). App tự nhận ra món đã bổ sung khi tên/alias khớp; log cũ chỉ cập nhật khi người dùng bấm (log là snapshot).
*   **Mở rộng bảng món: script thay agent (2026-10-17):** 5 agent research song song tốn ~1 triệu token cho ~300 món (~3k token/món), dính giới hạn phiên, và còn làm mất/trùng món (cháo sườn, súp cua cùng bị hai agent gỡ). Quyết định: nguyên liệu nhập bằng script từ bộ dữ liệu chính thức (0 token AI), món phức hợp tính từ công thức bằng script, agent chỉ duyệt món bị gắn cờ. Số liệu Bảng VN cho đồ nấu/ốc/sò có nhiều giá trị đáng ngờ (nghi tính theo khô hoặc sai trạng thái) → script không tự tin, người duyệt loại (ghi lý do trong log).
*   **Gemini Pro:** gói đăng ký Gemini (app) tách riêng với Gemini API. Model Pro gọi được qua API bằng cách đổi tên model, nhưng chậm hơn và gói miễn phí giới hạn thấp → Flash mặc định.

## 3. Quyết định về Database — ĐÃ CHỐT (v0.2)
*   **Supabase + local-first**: IndexedDB là nguồn hiển thị (mở app thấy ngay, offline vẫn log), outbox đẩy lên Supabase khi online. Last-write-wins theo `updatedAt`, soft delete.
*   Đăng nhập bằng email OTP (link + mã 6 số, mã cần cho PWA trên iOS).
*   Log lưu snapshot dinh dưỡng; Gemini key chỉ lưu trên từng thiết bị.
*   Calo tập: (MET − 1) × kg × giờ, chỉ cộng lại 50% vào quỹ ngày (người dùng chọn — strict hơn). NEAT tách khỏi buổi tập để không tính 2 lần.

### Ghi chú lịch sử (trước v0.2)
*   **Mục tiêu:** Cần lưu trữ lịch sử ăn uống, thông tin body fat, số liệu TDEE. Đang cân nhắc giữa 2 giải pháp cho một ứng dụng cá nhân miễn phí:
    *   **Supabase (Khuyên dùng):** Database PostgreSQL thực thụ, tốc độ cực nhanh, chuyên nghiệp, đồng bộ tốt mọi thiết bị, bảo mật cao. Cần cài đặt ban đầu.
    *   **Google Sheets:** Dễ kiểm soát bằng mắt thường, chỉnh sửa trực tiếp không cần code UI, vẽ biểu đồ dễ. Nhược điểm là chậm và cần dùng Google Apps Script làm trung gian để kết nối an toàn.
*   **LocalStorage:** Bị loại bỏ vì không đồng bộ được dữ liệu giữa Điện thoại và PC.

## 4. Ý tưởng Tính Năng Mở Rộng (Tương lai)
*   **Net Calories & Activities:** Khi người dùng điền "Đá bóng 60 phút", tự động gọi bảng quy đổi MET (Metabolic Equivalent of Task) để tính lượng calo đốt được và nới lỏng giới hạn calo được phép nạp trong ngày.
*   **Rolling Average Weight:** Thay vì nhìn cân nặng chênh lệch do nước mỗi ngày, app sẽ tính trung bình của 7 ngày gần nhất để báo cáo độ hiệu quả giảm mỡ chính xác.

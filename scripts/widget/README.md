# Widget NomNam cho iPhone (Scriptable)

Widget màn hình chính giống thẻ tổng kết ở màn Hôm nay: vòng **calo còn lại**, và **protein / carbs / fat / chất xơ** — đã ăn, mục tiêu, còn thiếu (hoặc đã vượt). Chỉ để xem — muốn thêm món thì bấm vào widget để mở app. Dữ liệu lấy từ Supabase (cùng tài khoản tên + PIN với app).

- **Nhỏ**: vòng calo + protein.
- **Vừa**: vòng calo + 4 thanh macro (đã ăn / mục tiêu · còn thiếu).
- **Lớn**: thêm mục tiêu, đã ăn, cộng calo tập, quỹ ngày; thanh macro lớn hơn.

## Cài đặt (làm một lần)

1. Cài **Scriptable** (miễn phí) từ App Store.
2. Đưa nội dung file `nomnam-widget.js` lên iPhone (AirDrop, iCloud Drive hoặc dán vào Ghi chú rồi copy).
3. Scriptable → dấu **+** → dán nội dung → đặt tên script là `NomNam`.
4. Sửa dòng `SUPABASE_KEY` thành giá trị `VITE_SUPABASE_PUBLISHABLE_KEY` trong file `.env` của dự án (key `sb_publishable_…`, vốn công khai — có trong bản build của app).
5. Bấm **▶ Run** trong Scriptable. Lần đầu nó hỏi **tên + PIN 6 số**, lưu vào Keychain của iPhone (không lưu trong file script). Widget xem trước hiện ra là thành công.
6. Giữ màn hình chính → **+** → **Scriptable** → chọn cỡ (nhỏ / vừa / lớn) → Thêm widget.
7. Giữ vào widget → **Sửa widget**: *Script* = `NomNam`, *When Interacting* = **Open URL** (để bấm vào mở app).

## Ghi chú

- iOS tự quyết định lúc làm mới widget (script xin 15 phút một lần, thực tế có thể thưa hơn) → số có thể trễ so với app.
- Bấm widget mở link web; trên iPhone link có thể mở bằng Safari thay vì app đã cài ở màn hình chính.
- Đổi PIN trong app → chạy lại script trong Scriptable và nhập lại. Xoá thông tin đã lưu: chạy `Keychain.remove('nomnam-pin')` trong một script bất kỳ.
- Công thức mục tiêu chép lại từ `src/lib/nutrition.ts`; `src/lib/widget.test.ts` kiểm tra hai bên khớp nhau. Đổi công thức trong app thì phải sửa script (test sẽ báo lệch).

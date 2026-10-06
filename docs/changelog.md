# Nhật Ký Thay Đổi (Changelog) - NomNam

## [V0.2.5] - 2026-10-06
### Thêm (Added)
- Thêm 53 món vào `foods.vn.ts` (cơm quán, món mặn, bún/miến/mì, bánh mì, món Tây, đồ uống, thịt/cá/trứng đã chín); chi tiết nguồn ở `docs/food-research-log.md`.
- Bảng màu **Hồng** (hồng phấn dịu, nữ tính) chọn ở Mục tiêu → Giao diện, dùng được với cả Sáng/Tối. Token ở `src/index.css` dưới `[data-palette="pink"]`; protein đổi sang tím lan để không lẫn với primary hồng. Lưu theo thiết bị (`calitrack-palette`), áp trước khi render để không nháy màu.
- Agent `.claude/agents/ui-design-reviewer.md` để audit màu / cân xứng / font; báo cáo ở `docs/ui-review.md`.
### Sửa (Fixed)
- Audit nhóm đạm (thịt/cá/hải sản/trứng/nội tạng/đậu hũ) với nguồn USDA FDC, Matvaretabellen, PhilFCT: sửa 15 món cũ (vd. cá ngừ hộp 116 → 99 kcal, ba chỉ sống 260 → 356, bò nạc sống 118 → 136, xúc xích 290 → 249), thêm 72 món đạm đã chín (13 món ước tính: cá lóc/trê/bớp/hú/nục, lươn, ốc, bắp bò, lạp xưởng, chả cá, cá viên, ba chỉ luộc — độ tin cậy thấp, ghi rõ trong log; trứng vịt/cút luộc tính từ hệ số trứng gà) (gà/vịt/dê/cừu/bò/heo/nội tạng/cá/hải sản/trứng/đậu hũ/tempeh), mọi nguyên liệu đạm có khẩu phần 100g và 200g, tên ghi rõ sống/đã chín. Chi tiết và URL nguồn ở `docs/food-research-log.md`.
- Bấm vào nhãn của ô số (Tự đặt mục tiêu, sửa món, Nhập nhanh, Món riêng) làm giảm giá trị: `<label>` bọc `NumberField` gắn vào nút "−" → đổi thành `<div>`.
- Chữ màu macro ở chế độ sáng quá nhạt (carbs chỉ 2.6:1): làm đậm token chữ (≥ 4.5:1 trên card); thanh/chấm dùng token tươi riêng `bg-*-fill`.

## [V0.2.4] - 2026-10-06
### Thêm (Added)
- Deploy GitHub Pages: `.github/workflows/deploy.yml` (lint → test → build → deploy), `base` theo `VITE_BASE`, manifest/service worker/logo theo base.
- `src/store/store.test.ts` (17 test): thêm/xoá/Hoàn tác món, vận động, cân nặng, bữa mẫu, món riêng, copy ngày, tổng kết ngày, merge sync, kiểm tra dữ liệu món. Lệnh `npm run check` (tsc + lint + test).
### Thay đổi (Changed)
- Email ảo của đăng nhập tên + PIN đổi từ `@calitrack.app` sang `@namnguyen27.app` (tài khoản cũ không đăng nhập được, phải tạo lại).

## [V0.2.3] - 2026-10-05
### Thay đổi (Changed)
- Dùng logo NomNam (`logoNomNam.svg`, giữ nguyên thiết kế gốc) làm favicon, icon PWA (192/512, maskable cho Android, apple-touch-icon cho iPhone) và logo màn chào.
- Đổi màu chủ đạo của app sang màu thương hiệu: nâu đỏ `#6A201A` + kem `#F6E9D8` (sáng), kem-be + cam đất (tối).
- Xoá ảnh bò không dùng của bản draft (`public/images/food/beef/`).

## [V0.2.2] - 2026-10-05
### Thay đổi (Changed)
- Đổi tên app **CaliTrack → NomNam** (tiêu đề, PWA, màn chào, tên file xuất, tài liệu). Giữ khoá nội bộ `calitrack-*` (IndexedDB/localStorage) và email ảo `@calitrack.app` để không mất dữ liệu/tài khoản cũ; file sao lưu cũ (`app: "calitrack"`) vẫn khôi phục được.

## [V0.2.1] - 2026-10-05
### Thay đổi (Changed)
- Đăng nhập bằng **tên + mã PIN 6 số** thay cho email OTP (`src/lib/auth.ts`). Tên được chuyển thành email ảo `<tên>@calitrack.app`; Supabase tắt "Confirm email".
- Kết nối project Supabase thật (dùng chung với app Personal CFO, bảng `fin_*`). `.env` dùng `VITE_SUPABASE_PUBLISHABLE_KEY` (key `sb_publishable_…`).
- Đã kiểm thử đồng bộ 2 thiết bị: log offline → tạo tài khoản → dữ liệu lên Supabase; máy mới đăng nhập kéo đúng dữ liệu; thêm món ở máy B hiện ở máy A; RLS chặn truy cập khi chưa đăng nhập.

## [V0.2.0] - 2026-10-05 — Viết lại toàn bộ
### Đã thêm (Added)
- Điều hướng mới: bottom nav **Hôm nay · Tuần · (+) · Vận động · Mục tiêu**, onboarding lần đầu.
- **Hôm nay**: vòng calo "còn lại", phương trình Mục tiêu − Đã ăn + Tập = Quỹ ngày, thanh Protein nổi bật + Carbs/Fat/Xơ, 4 bữa, dải 7 ngày có chấm đạt, sửa/xoá món có Hoàn tác, chép bữa/ngày hôm trước, lưu bữa mẫu.
- **Thêm món**: tìm không dấu, Gần đây / Hay ăn / Bữa mẫu / Món của tôi, thêm 1 chạm, khẩu phần chuẩn × số lượng hoặc gram, nhập nhanh, tạo món riêng, thêm liên tục nhiều món.
- **AI (Gemini)**: gõ mô tả hoặc chụp ảnh → tách nhiều món (gram, kcal, P/C/F/xơ) → màn kiểm tra sửa gram trước khi lưu. Dùng structured output + zod.
- **Vận động**: 12 môn × 3 cường độ theo bảng MET (Compendium), nhập kcal tay; 50% calo tập được cộng vào quỹ ngày.
- **Tuần**: thống kê ngày đạt, chuỗi đạt, TB calo/protein, bảng ✓/✗, biểu đồ kcal & protein, gợi ý, cân nặng + trung bình 7 ngày.
- **Mục tiêu**: hồ sơ, TDEE (NEAT tách khỏi buổi tập), giảm mỡ / giữ cân / tăng cơ, override mục tiêu, % calo tập, Gemini key, tài khoản & đồng bộ, theme sáng/tối, xuất CSV / sao lưu JSON.
- Bảng ~110 món Việt & đồ gym có chất xơ và khẩu phần chuẩn.
- Lưu local-first (IndexedDB) + đồng bộ Supabase (email OTP, outbox, RLS). Schema mới trong `supabase_schema.sql`.
- PWA (cài lên màn hình, chạy offline), font Be Vietnam Pro, dark mode, animation.
- Unit test (vitest) cho công thức dinh dưỡng, MET, ngày, tìm kiếm, kiểm tra chéo DB món.
- `CLAUDE.md`, `docs/checklist.md`, `.env.example`.

### Đã sửa lỗi (Fixed)
- AI Photo Log luôn lỗi: `response.text()` → `response.text` (getter).
- `npm run build` fail (TS 6 `baseUrl` deprecated, biến không dùng).
- App trắng trang khi `.env` chứa URL giữ chỗ → giờ tự chuyển chế độ chỉ lưu máy.
- `.env` chưa nằm trong `.gitignore`.
- `tailwind.config.js` dùng CommonJS trong package `"type": "module"` → chuyển ESM.
- Calo tập bị tính 2 lần (hệ số vận động 1.55 đã gồm buổi tập).
- Ngày tính theo giờ địa phương (tránh lệch ngày do UTC).

### Đã xoá (Removed)
- Meal builder cố định 4 ô, dữ liệu sổ tay giả, ảnh Unsplash/texture/avatar từ domain ngoài, file template Vite.

## [V0.1.0] - 2026-10-03
### Đã thêm (Added)
- Khởi tạo dự án bằng `Vite + React (TypeScript)`.
- Cài đặt thành công `Tailwind CSS v3` và thư viện UI `shadcn/ui`.
- Tích hợp các UI Components cơ bản: `Button`, `Card`, `Slider`, `Input`, `Label`.
- Tạo Component `AIFoodLogger`: Tích hợp Google Gemini 2.5 Flash SDK (`@google/genai`) để nhận diện món ăn, khối lượng, và lượng calo từ hình ảnh mâm cơm (Hỗ trợ upload ảnh/chụp từ camera).
- Tạo tính năng **Visual Portion Slider**: Thanh trượt điều chỉnh khối lượng thức ăn, tự động thay đổi calo tổng.
- Tạo tính năng **Meal Modifiers**: Các nút tùy chọn thêm/bớt calo (Húp nước lèo, thêm rau giá).
- Tạo file `.env` và `supabase_schema.sql` chuẩn bị cho giai đoạn Database.

### Đã sửa lỗi (Fixed)
- Sửa lỗi tương thích giữa `shadcn/ui` và `Tailwind CSS v4` bằng cách hạ cấp (downgrade) Tailwind xuống v3 để đảm bảo cấu trúc config chạy ổn định.
- Sửa lỗi đường dẫn alias `@/components` khi khởi tạo shadcn bằng cách ghi đè thủ công file `components.json` và di chuyển thư mục cho đúng chuẩn cấu trúc dự án.

### Đang chờ xử lý (Pending)
- Lựa chọn Database (Supabase vs Google Sheets) để code tính năng lưu trữ.
- Xây dựng màn hình Dashboard tổng hợp.

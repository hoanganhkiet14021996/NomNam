# NomNam

Web app theo dõi calo, protein, chất xơ và vận động hằng ngày — log bữa ăn trong vài giây, bám sát mục tiêu fitness.

## Chạy

```bash
npm install
npm run dev        # mở http://localhost:5173
```

Mở trên điện thoại cùng mạng Wi-Fi: `npm run dev -- --host`, rồi vào `http://<IP-máy-tính>:5173`.
Bản build (`npm run build && npm run preview`) có thể "Thêm vào màn hình chính" như app.

## Đồng bộ điện thoại ↔ máy tính (tuỳ chọn)

Không cấu hình thì app vẫn chạy đầy đủ, dữ liệu lưu trong trình duyệt của từng máy.

1. Tạo project tại [supabase.com](https://supabase.com) → **SQL Editor** → chạy toàn bộ `supabase_schema.sql`.
2. **Project Settings → API**: copy *Project URL* và *Publishable key* (`sb_publishable_…`) vào `.env` với tên `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (xem `.env.example` — phải có tiền tố `VITE_`, không phải `NEXT_PUBLIC_`).
3. **Authentication → Sign In / Providers → Email**: tắt **Confirm email** → Save (app đăng nhập bằng tên + PIN, không gửi email).
4. Khởi động lại `npm run dev`, vào tab **Mục tiêu → Tài khoản & đồng bộ** → **Tạo tài khoản** (tên + PIN 6 số). Trên máy khác chọn **Đăng nhập** với cùng tên + PIN.

## AI ghi món (tuỳ chọn)

Lấy Gemini API key miễn phí tại [aistudio.google.com/apikey](https://aistudio.google.com/apikey), dán vào tab **Mục tiêu → AI**. Key chỉ lưu trên thiết bị đó.

## Lệnh khác

```bash
npm test           # unit test
npm run lint       # oxlint
npm run build      # build production + service worker
```

Chi tiết kỹ thuật: [CLAUDE.md](CLAUDE.md) · Tính năng: [docs/checklist.md](docs/checklist.md)

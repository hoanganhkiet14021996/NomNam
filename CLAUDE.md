# NomNam — hướng dẫn cho Claude

Web app cá nhân **NomNam** (tên cũ: CaliTrack; PWA, mobile-first, tiếng Việt) để **log bữa ăn nhanh nhất có thể** → kcal / protein / carbs / fat / chất xơ, và theo dõi **ngày / tuần** đã đạt mục tiêu calo & protein chưa. Có tab vận động (đá banh, gym, chạy…) cộng thêm calo vào quỹ ngày. Ưu tiên của chủ app: **fitness goals, strict về calo & protein**, app phải đẹp, nhanh, đáng tin cậy.

Người dùng là người Việt — UI, comment, commit message viết **tiếng Việt**.

## Lệnh

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build (+ service worker PWA)
npm run lint      # oxlint — phải sạch 0 cảnh báo
npm test          # vitest run (src/**/*.test.ts)
npm run check     # tsc -b + oxlint + vitest — chạy cái này trước mỗi lần push/deploy
```

Chạy `npm run check` (= tsc + lint + test) trước khi báo xong việc / trước khi push. Workflow deploy cũng chạy lint + test: **test hỏng → không deploy**.

## Stack

Vite 8 · React 19 · TypeScript 6 · Tailwind 3 (giữ v3, shadcn chưa hợp v4) · Radix (slot, switch) · vaul (bottom sheet) · motion (`motion/react`) · sonner (toast + Hoàn tác) · recharts (lazy, chỉ tab Tuần) · zustand + idb-keyval (lưu IndexedDB) · Supabase (auth tên + PIN + sync) · `@google/genai` (lazy import) · zod · vite-plugin-pwa · font Be Vietnam Pro (@fontsource).

## Cấu trúc

```
src/
  App.tsx                  shell: hydrate store, theme, lazy WeekView, BottomNav, sheets
  types.ts                 mọi kiểu dữ liệu (FoodLog, ActivityLog, Profile, …)
  data/foods.vn.ts         ~110 món VN/gym (per 100g + khẩu phần); food() cho nguyên liệu, dish() cho món theo phần
  data/activities.ts       MET theo Compendium (nhẹ/vừa/mạnh)
  data/defaults.ts         DEFAULT_PROFILE (lean bulk, 50% eat-back)
  lib/nutrition.ts         BMR, TDEE, targets, scale/sum, dailyBudget, dayAdherence, fmt  ← logic thuần, có test
  lib/met.ts               activityKcal = (MET − 1) × kg × giờ
  lib/date.ts              key 'YYYY-MM-DD' theo GIỜ ĐỊA PHƯƠNG (không dùng toISOString cho ngày)
  lib/search.ts            tìm không dấu ("uc ga" → Ức gà), alias
  lib/sync.ts              local-first sync Supabase (pull → push outbox), auth helpers
  lib/supabase.ts          client = null nếu .env chưa hợp lệ → chế độ chỉ lưu máy
  lib/ai/gemini.ts         analyzeMeal (ảnh/chữ → items[]), responseJsonSchema + zod, prepareImage
  lib/export.ts            xuất CSV / sao lưu & khôi phục JSON
  store/useAppStore.ts     zustand persist (IndexedDB): dữ liệu + outbox + actions
  store/settings.ts        theme, Gemini key/model (localStorage, KHÔNG sync)
  store/ui.ts              tab (sync với #hash), ngày đang xem, trạng thái sheet
  store/derive.ts          selector thuần: logsForDate, summarizeDay, recent/frequent, weightTrend, MEALS
  store/store.test.ts      test bug cơ bản: thêm/xoá/Hoàn tác món, vận động, cân, bữa mẫu, copy ngày, tổng kết, merge sync, dữ liệu món (idb-keyval được mock)
  store/hooks.ts           useDay(date), useTargets(), useAllFoods()
  components/              CalorieRing, MacroBar, NumberField, AnimatedNumber, BottomNav, PageHeader, DayNav
  components/ui/           button, card, input, drawer (vaul), switch, segmented
  features/today|add|ai|activity|week|goals|onboarding
```

## Mô hình tính toán (đã chốt với người dùng)

- BMR **Mifflin-St Jeor**; TDEE nền = BMR × NEAT (1.2 / 1.375 / 1.55) — NEAT **không gồm buổi tập** (buổi tập log ở tab Vận động, tránh tính 2 lần).
- Mục tiêu kcal = TDEE nền × (cut 0.82 / maintain 1.0 / **bulk 1.10** — mặc định), tối thiểu 1200.
- Protein = g/kg × cân nặng (mặc định 2.0 bulk, 2.2 cut). Fat = 25% kcal. Xơ = 14 g / 1000 kcal. Carbs = phần còn lại.
- Override tay (`profile.overrides`) đè số tự tính; carbs tự tính lại cho khớp.
- Calo tập = (MET − 1) × kg × giờ. **Quỹ ngày = mục tiêu + 50% calo tập** (`exerciseEatBackPct`, chỉnh được).
- "Đạt" ngày: kcal trong **±10% quỹ ngày** VÀ protein **≥ 100%** mục tiêu (`dayAdherence`).
- Mục tiêu lịch sử dùng profile hiện tại (không lưu snapshot mục tiêu theo ngày).

## Dữ liệu & sync

- Store là nguồn sự thật hiển thị; mọi mutation: ghi local + thêm key `table:id` vào `outbox`.
- `FoodLog` lưu **snapshot** dinh dưỡng (tổng của phần ăn) → sửa DB món không làm sai lịch sử. Sửa gram = scale theo tỉ lệ.
- ID tạo ở client (`lib/id.ts`, có fallback khi không phải HTTPS). Xoá = soft delete `deletedAt` (để sync + Hoàn tác).
- Sync: `syncNow()` = pull (updated_at > lastPulledAt − 10 phút, phân trang 1000) rồi push outbox (upsert). Last-write-wins theo `updatedAt`. Timestamp từ Postgres được chuẩn hoá về ISO `…Z` trước khi so sánh chuỗi.
- Đăng nhập lần đầu trên máy: `_enqueueAll()` để đẩy dữ liệu local lên; đổi user khác → xoá dữ liệu local.
- Project Supabase **dùng chung** với app Personal CFO (bảng `fin_*`, cùng tài khoản đăng nhập). Bảng NomNam không có tiền tố — khi thêm bảng mới cho NomNam, tránh trùng tên với app khác; Redirect URLs phải chứa URL của cả hai app.
- Schema + RLS: `supabase_schema.sql` (bảng profiles, food_logs, activity_logs, weight_logs, saved_meals, custom_foods). Cột camelCase ↔ snake_case chuyển tự động trong `sync.ts` — thêm field mới thì thêm cột cùng tên dạng snake_case.
- Auth (`lib/auth.ts`): **tên + PIN 6 số**, không dùng email thật. Tên → email ảo `<tên-không-dấu>@namnguyen27.app`, PIN dùng thẳng làm mật khẩu. Supabase phải **tắt "Confirm email"** (app kiểm tra `mailer_autoconfirm` trước khi signUp để không gửi mail tới địa chỉ ảo). Đổi quy tắc tên → email sẽ làm hỏng tài khoản cũ.

## Quy ước UI

- Mobile-first, `max-w-lg` căn giữa; bottom nav 5 nút: Hôm nay · Tuần · (+) · Vận động · Mục tiêu.
- Màu macro dùng token, không hard-code: `kcal` (nâu đỏ thương hiệu), `protein` (rose), `carbs` (amber), `fat` (sky), `fiber` (lime), `success`, `warning` — định nghĩa ở `src/index.css` cho cả light/dark. Chart đọc màu qua `useCssColors()` (SVG không hiểu `var()`).
- Protein luôn nổi bật nhất (mục tiêu chính). Số dùng class `num` (tabular-nums).
- Thao tác xoá → toast có **Hoàn tác** (không dùng `confirm()`/`prompt()`).
- Nhập số dùng `NumberField` (có −/+, gõ trực tiếp, ô = 0 thì focus để trống).
- Sheet dùng `Drawer`/`DrawerContent` (vaul), luôn truyền `title` (a11y).
- Chart: 1 trục Y, legend khi ≥ 2 series, có tooltip, kèm bảng ✓/✗ (không chỉ dựa vào màu).
- Mỗi file component chỉ export component (oxlint `only-export-components`) — hằng số/hàm dùng chung để trong `lib/` hoặc `store/derive.ts`.
- Không gọi `setState` đồng bộ trong `useEffect` (oxlint) — dùng state nháp, `useSyncExternalStore`, hoặc cập nhật lúc render.

## Môi trường

- `.env` (không commit — đã có trong .gitignore), mẫu ở `.env.example`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (key `sb_publishable_…`; tên cũ `VITE_SUPABASE_ANON_KEY` vẫn nhận). Chỉ biến `VITE_*` được Vite đọc — `NEXT_PUBLIC_*` không dùng được. Project: `jaekhiuaybhsqtfsnuae.supabase.co`. Biến `VITE_*` được nhúng vào bản build lúc build (publishable key vốn công khai, dữ liệu được bảo vệ bằng RLS).
- Gemini API key do người dùng nhập trong app (tab Mục tiêu hoặc lần đầu dùng AI), lưu localStorage của từng thiết bị. Model mặc định `gemini-2.5-flash`, đổi được.
- Windows + PowerShell 5.1: khi sửa file có tiếng Việt bằng script, đọc/ghi bằng `[IO.File]::ReadAllText(..., UTF8)` — `Get-Content` mặc định làm hỏng dấu.

## Tên app & thương hiệu

- Logo gốc: `logoNomNam.svg` (người dùng tự thiết kế — **không tự ý sửa hình**). Bản dùng trong app: `public/brand/logo.svg` (bỏ metadata), `logo-fullbleed.svg` (bỏ 4 góc kem, cho icon cài máy), `logo-maskable.svg` (thu 78% cho Android). PNG: `icon-192/512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`; `favicon.svg` = logo gốc.
- Màu thương hiệu: nâu đỏ `#6A201A` (= `--primary` sáng) và kem `#F6E9D8`. Chế độ tối dùng primary màu kem-be để đủ tương phản.

- Tên hiển thị: **NomNam**. Các khoá nội bộ vẫn mang tên cũ `calitrack` **có chủ ý**: IndexedDB `calitrack-data`, localStorage `calitrack-settings` / `calitrack-theme`, email ảo `@namnguyen27.app` (đã đổi từ `@calitrack.app` ngày 2026-10-05). Không đổi các khoá này (mất dữ liệu / hỏng tài khoản).

## Trạng thái hiện tại (2026-10-06, v0.2.3)

- Đã xong & kiểm thử thật trong Chrome (puppeteer, cả sáng/tối): onboarding, Hôm nay, thêm món (tìm/khẩu phần/nhập nhanh/bữa mẫu/món riêng), sửa/xoá/Hoàn tác, Vận động, Tuần, Mục tiêu, AI (với phản hồi Gemini giả lập — **chưa thử bằng key thật**), lưu IndexedDB, đồng bộ Supabase 2 thiết bị.
- **Đã deploy**: https://hoanganhkiet14021996.github.io/NomNam/ (repo `hoanganhkiet14021996/NomNam`, nhánh `main`). Kiểm tra từ ngoài: trang, manifest, sw.js, icon, logo đều 200 và đúng base `/NomNam/`; địa chỉ Supabase đã nhúng vào bản build.
- Email ảo đã đổi sang `@namnguyen27.app` (2026-10-05). Tài khoản test cũ `nam@calitrack.app` cần xoá tay trong Supabase (Authentication → Users) — **chú ý project dùng chung với app CFO**: app CFO cũng phải đổi sang cùng domain mới thì mới còn chung tài khoản.
- Test: 48 test (nutrition, auth, utils, store). `npm run check` phải xanh trước khi push.
- **Chưa làm**: thử tay thêm/xoá món/bữa mẫu trên bản live và trên điện thoại thật; cài PWA; thử AI bằng Gemini key thật; thêm URL Pages vào Supabase Redirect URLs (nếu chưa).

## Deploy (GitHub Pages)

- Quy trình: sửa code → `npm run check` → `git add -A; git commit; git push` → workflow `.github/workflows/deploy.yml` tự chạy (lint → test → build → deploy, ~1–2 phút). Xem tiến trình ở tab Actions của repo.
- `base` lấy từ biến `VITE_BASE` (mặc định `/`; workflow tự đặt `/<tên repo>/`). Manifest `start_url`/`scope`/icon, `navigateFallback` và logo Onboarding (`BASE_URL`) đều theo base.
- Supabase URL/key đọc từ **repo Variables** (Settings → Secrets and variables → Actions → tab Variables): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`. Phải là Variables (workflow dùng `vars.*`), không phải Secrets. Đổi Variables xong phải Re-run workflow vì giá trị được nhúng lúc build.
- Pages: Settings → Pages → Source = GitHub Actions.
- Supabase Redirect URLs cần chứa URL Pages của mọi app dùng chung project.
- Test base cục bộ: dùng **PowerShell** (`$env:VITE_BASE='/x/'; npm run build`) — Git Bash bẻ `/x/` thành đường dẫn Windows.
- Máy này: git user đặt cục bộ trong repo (`hoanganhkiet14021996`). Không có `gh` CLI; tạo repo/Variables/Pages làm trên web. Push dùng Git Credential Manager đã đăng nhập.
- App không dùng router (tab lưu trong `#hash`) → không cần trick 404.html cho SPA. PWA `autoUpdate`: bản mới chỉ hiện sau khi tắt hẳn rồi mở lại app 1–2 lần.

## Tài liệu

- `docs/checklist.md` — checklist tính năng & trạng thái (cập nhật khi làm xong tính năng).
- `docs/changelog.md` — nhật ký thay đổi theo phiên bản.
- `docs/findings.md` — quyết định kỹ thuật & lý do.

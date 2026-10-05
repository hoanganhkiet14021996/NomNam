# NomNam — hướng dẫn cho Claude

Web app cá nhân **NomNam** (tên cũ: CaliTrack; PWA, mobile-first, tiếng Việt) để **log bữa ăn nhanh nhất có thể** → kcal / protein / carbs / fat / chất xơ, và theo dõi **ngày / tuần** đã đạt mục tiêu calo & protein chưa. Có tab vận động (đá banh, gym, chạy…) cộng thêm calo vào quỹ ngày. Ưu tiên của chủ app: **fitness goals, strict về calo & protein**, app phải đẹp, nhanh, đáng tin cậy.

Người dùng là người Việt — UI, comment, commit message viết **tiếng Việt**.

## Lệnh

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build (+ service worker PWA)
npm run lint      # oxlint — phải sạch 0 cảnh báo
npm test          # vitest run (src/**/*.test.ts)
```

Chạy `npx tsc -b && npm run lint && npm test` trước khi báo xong việc.

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

## Trạng thái hiện tại (2026-10-05, v0.2.3)

- Đã xong & kiểm thử thật trong Chrome (puppeteer, cả sáng/tối): onboarding, Hôm nay, thêm món (tìm/khẩu phần/nhập nhanh/bữa mẫu/món riêng), sửa/xoá/Hoàn tác, Vận động, Tuần, Mục tiêu, AI (với phản hồi Gemini giả lập — **chưa thử bằng key thật**), lưu IndexedDB, đồng bộ Supabase 2 thiết bị.
- Supabase: schema đã chạy (dùng chung với app CFO), "Confirm email" đã tắt. Tài khoản test: **Nam** (PIN do người dùng giữ; có 3 món test ngày 2026-10-05).
- Đã xoá ảnh bò thừa của bản draft (`public/images/`). Chưa có git repo.
- Chưa thử trên điện thoại thật.

## Deploy lên GitHub Pages (code đã sẵn sàng, chờ push)

Đã làm: `base` qua biến `VITE_BASE` (mặc định `/`), manifest `start_url`/`scope`/icon theo base, `navigateFallback` theo base, logo Onboarding dùng `BASE_URL`, `.github/workflows/deploy.yml` (test → build → deploy; `VITE_BASE=/<tên repo>/` tự đặt; Supabase URL/key đọc từ **Variables** của repo), `git init` (nhánh main). Còn lại: đặt git user, commit, tạo repo, push, bật Pages, thêm Variables, thêm URL Pages vào Supabase Redirect URLs. Build local test base: dùng PowerShell (`$env:VITE_BASE='/x/'`) — Git Bash bẻ `/x/` thành đường dẫn Windows.

Chi tiết các bước gốc:

Người dùng sẽ deploy bằng GitHub Pages. Những việc cần làm khi tới bước này:
1. `git init`, commit đầu tiên (kiểm tra `.env` KHÔNG bị add), tạo repo GitHub và push.
2. **Base path**: Pages phục vụ ở `https://<user>.github.io/<repo>/` → đặt `base: '/<repo>/'` trong `vite.config.ts` (hoặc qua biến môi trường lúc build). Các đường dẫn tuyệt đối hiện có phải đổi theo base:
   - manifest PWA trong `vite.config.ts`: `start_url: '/'`, `src: '/icon-…png'` → dùng đường dẫn tương đối hoặc ghép base; đặt `scope`.
   - `src/features/onboarding/Onboarding.tsx`: `src="/brand/logo.svg"` → `` `${import.meta.env.BASE_URL}brand/logo.svg` ``.
   - `index.html`: các `href="/favicon.svg"`, `/apple-touch-icon.png` — Vite tự thêm base cho asset trong index.html, kiểm tra lại sau build.
   - `navigateFallback` của workbox nên là `index.html` theo base.
3. App không dùng router (tab lưu trong `#hash`) → không cần trick 404.html cho SPA.
4. GitHub Actions workflow (`.github/workflows/deploy.yml`): checkout → `npm ci` → `npm run build` với env `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (đặt trong repo Settings → Secrets/Variables) → `actions/upload-pages-artifact` (thư mục `dist`) → `actions/deploy-pages`. Bật Pages: Settings → Pages → Source: GitHub Actions.
5. Sau deploy: mở link trên điện thoại, cài PWA, đăng nhập tên + PIN, thử AI với Gemini key thật.

## Tài liệu

- `docs/checklist.md` — checklist tính năng & trạng thái (cập nhật khi làm xong tính năng).
- `docs/changelog.md` — nhật ký thay đổi theo phiên bản.
- `docs/findings.md` — quyết định kỹ thuật & lý do.

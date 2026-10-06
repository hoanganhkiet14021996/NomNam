# Review giao diện NomNam (2026-10-06, v0.2.3 + palette Hồng đang làm)

Người review: agent `ui-design-reviewer`. Chỉ đọc code + tính toán, không chạy app. Tỉ lệ tương phản tính bằng WCAG 2.1 (HSL → sRGB → độ chói tương đối) từ token trong `src/index.css`. Độ phân biệt màu tính bằng ΔE (CIE76), có mô phỏng mù màu đỏ-lục (Machado, deutan/protan mức nặng).

## 1. Tóm tắt

| Mục | Điểm | Nhận xét ngắn |
|---|---|---|
| Màu | **6.5/10** | Chế độ tối rất tốt. Chế độ sáng: chữ carbs/fat/fiber/warning/success **dưới 4.5:1**, carbs chỉ 2.6:1. Viền ô nhập quá mờ. |
| Cân xứng | **7.5/10** | Có thang khoảng cách rõ (px-4, gap-2/3, space-y-4, bo góc xl/2xl). Điểm trừ: nhiều nút icon chỉ 32px, vài nút chỉ 16px. |
| Font | **7/10** | Be Vietnam Pro có subset tiếng Việt, số dùng `num` gần như khắp nơi. Điểm trừ: 11 cỡ chữ, 7 chỗ dùng 10px. |
| Dễ dùng | **7.5/10** | Luồng log món rất nhanh (chọn bữa sẵn, + 1 chạm, thêm nhiều món, Hoàn tác). Có **1 lỗi thật**: bấm vào nhãn của ô số làm giảm giá trị. |

**3 việc nên làm ngay**

1. **Sửa lỗi `<label>` bọc `NumberField`**: bấm vào chữ nhãn (hoặc vùng trống, chữ đơn vị "g") sẽ bấm luôn nút **−**, nên mục tiêu kcal/protein hoặc số gram bị giảm mà người dùng không biết. Đổi `<label>` thành `<div>` (hoặc thêm `htmlFor` trỏ tới input). Chi tiết ở mục 3.4 (🔴).
2. **Làm tối các token macro ở chế độ sáng** để chữ đạt ≥ 4.5:1 trên card: `--carbs: 32 95% 31%` (5.65), `--fat: 200 90% 33%` (5.54), `--fiber: 88 65% 26%` (5.94), `--warning: 24 90% 36%` (5.39), `--success: 152 65% 28%` (5.54), `--protein: 340 78% 46%` (5.17). Các số trong ngoặc là tỉ lệ đã tính lại trên card, đúng cho cả palette gốc lẫn Hồng. Nếu muốn thanh tiến độ vẫn tươi thì tách ra token riêng, ví dụ `--carbs-fill` (giữ màu cũ, dùng cho `bg-*`) và `--carbs` (màu đậm, dùng cho `text-*`).
3. **Nâng vùng chạm lên ≥ 40–44px**: `size="icon-sm"` (32px) đang dùng cho nút +, ⋯, X đóng sheet, quay lại, xoá. Riêng các nút chỉ có icon 16px (X bỏ món AI, X xoá tìm kiếm, nút hiện/ẩn key) cần vùng chạm ẩn khoảng 40px.

## 2. Bảng tương phản

Cách đọc: ✅ đạt chuẩn · ⚠️ đạt 3:1 (chỉ đủ cho chữ lớn ≥ 18.7px đậm, hoặc icon) · ❌ dưới 3:1. Chuẩn: chữ thường 4.5, UI/icon 3.

| Cặp màu | Sáng | Tối | Hồng sáng | Hồng tối | Chuẩn |
|---|---|---|---|---|---|
| foreground / background | 15.72 ✅ | 16.37 ✅ | 14.25 ✅ | 16.14 ✅ | 4.5 |
| foreground / card | 16.70 ✅ | 15.09 ✅ | 15.30 ✅ | 14.81 ✅ | 4.5 |
| muted-foreground / background | 5.49 ✅ | 7.68 ✅ | 5.82 ✅ | 7.47 ✅ | 4.5 |
| muted-foreground / card | 5.84 ✅ | 7.08 ✅ | 6.25 ✅ | 6.85 ✅ | 4.5 |
| muted-foreground / muted (chip, ô xám) | 4.89 ✅ | 6.15 ✅ | 5.25 ✅ | 5.94 ✅ | 4.5 |
| muted-foreground 80% / card (gợi ý 11px, SummaryCard) | 3.76 ⚠️ | 4.98 ✅ | 3.96 ⚠️ | 4.85 ✅ | 4.5 |
| primary-foreground / primary | 9.99 ✅ | 9.99 ✅ | 5.57 ✅ | 7.24 ✅ | 4.5 |
| primary / background | 10.54 ✅ | 13.77 ✅ | 5.11 ✅ | 9.26 ✅ | 4.5 |
| primary / card | 11.19 ✅ | 12.70 ✅ | 5.49 ✅ | 8.50 ✅ | 4.5 |
| primary / nền primary 10% (nút soft, QuickBtn, badge AI) | 9.33 ✅ | 10.07 ✅ | 4.74 ✅ | 7.06 ✅ | 4.5 |
| primary-foreground / ô `bg-white/15` trên primary (GoalsView) | 6.66 ✅ | 10.53 ✅ | 4.27 ⚠️ | 8.11 ✅ | 4.5 |
| destructive / card | 4.80 ✅ | 4.64 ✅ | 4.81 ✅ | 4.56 ✅ | 4.5 |
| destructive-foreground / destructive | 4.89 ✅ | 3.82 ⚠️ | 4.89 ✅ | 3.82 ⚠️ | 4.5 |
| **kcal / card** | 9.02 ✅ | 6.05 ✅ | 5.65 ✅ | 6.86 ✅ | 4.5 |
| **protein / card** | 4.49 ⚠️ | 5.74 ✅ | 5.52 ✅ | 7.56 ✅ | 4.5 |
| **carbs / card** | **2.61 ❌** | 9.48 ✅ | **2.62 ❌** | 9.31 ✅ | 4.5 |
| **fat / card** | 3.69 ⚠️ | 8.10 ✅ | 3.70 ⚠️ | 7.95 ✅ | 4.5 |
| **fiber / card** | 3.58 ⚠️ | 9.41 ✅ | 3.59 ⚠️ | 9.24 ✅ | 4.5 |
| **success / card** | 4.21 ⚠️ | 8.35 ✅ | 4.22 ⚠️ | 8.20 ✅ | 4.5 |
| **warning / card** | 3.20 ⚠️ | 8.24 ✅ | 3.21 ⚠️ | 8.09 ✅ | 4.5 |
| protein / nền protein 10% (icon Flame) | 3.85 ✅ | 5.05 ✅ | 4.80 ✅ | 6.37 ✅ | 3 |
| kcal (vòng) / muted (rãnh) | 7.57 ✅ | 5.25 ✅ | 4.75 ✅ | 5.95 ✅ | 3 |
| protein (thanh) / muted (rãnh) | 3.76 ✅ | 4.99 ✅ | 4.64 ✅ | 6.56 ✅ | 3 |
| ring (viền focus) / background | 7.90 ✅ | 10.01 ✅ | 3.34 ✅ | 7.12 ✅ | 3 |
| **input (viền ô nhập) / card** | **1.48 ❌** | **1.46 ❌** | **1.52 ❌** | **1.51 ❌** | 3 |
| border / card | 1.34 ❌ | 1.27 ❌ | 1.36 ❌ | 1.31 ❌ | 3* |
| muted (rãnh vòng) / card | 1.19 | 1.15 | 1.19 | 1.15 | (trang trí) |

\* `border` chủ yếu để chia khối (trang trí) nên không bắt buộc 3:1. Viền **ô nhập** (`--input`) thì có bắt buộc theo WCAG 1.4.11.

**Độ phân biệt giữa các màu (ΔE; mô phỏng mù màu deutan / protan)**

| Cặp | Sáng | Tối | Hồng sáng | Hồng tối |
|---|---|---|---|---|
| protein ~ kcal | 40.6 (22 / 25) | 39.7 (29 / 38) | 49.2 (53 / 44) | 33.7 (34 / 28) |
| protein ~ primary | 47.9 | 63.1 | 48.2 | 30.4 |
| protein ~ fat | 99.5 (66 / 38) | 87.3 (52 / 33) | 63.1 (**7.5** / 23) | 51.8 (13 / **6.9**) |
| carbs ~ warning | 16.7 (**6** / 10) | 12.3 (**5** / 9) | như Sáng | như Tối |
| carbs ~ fiber | 61.3 (26 / **7**) | 58.2 (12 / **4.7**) | như Sáng | như Tối |
| kcal ~ destructive (vòng khi vượt quỹ) | 39.1 | 22.9 (**6.4** / 13) | 44.6 | 37.4 |

Cách đọc: ΔE < 10 sau mô phỏng nghĩa là người mù màu gần như **không phân biệt** được. Hiện chỗ nào màu cũng đi kèm chữ (P/C/F/Xơ) hoặc icon ✓/✗, nên ảnh hưởng thật vẫn thấp.

## 3. Phát hiện

### 3.1 Màu sắc

- 🔴 **Chữ carbs ở chế độ sáng chỉ đạt 2.61:1.** `src/index.css:30` `--carbs: 36 92% 46%` được dùng làm chữ ở `src/components/MacroBar.tsx:83` (chữ "C" cỡ 10–12px, xuất hiện ở **mỗi dòng món**, `MealSection.tsx:137`) và cho icon ✓ ở `MacroBar.tsx:38`. Ngoài nắng gần như không đọc được. Đề xuất: tách 2 token, `--carbs-fill: 36 92% 46%` (cho `bg-carbs`) và `--carbs: 32 95% 31%` (cho `text-carbs`, khoảng 5:1). Làm tương tự cho fat (`200 90% 33%`) và fiber (`88 65% 26%`).
- 🟠 **warning/success dùng làm chữ nhỏ không đạt 4.5:1 ở chế độ sáng (3.20 và 4.21).** Các chỗ: `GoalsView.tsx:75` (dòng "Đang dùng mục tiêu tự đặt", text-xs), `WeightCard.tsx:43` (±kg / 7 ngày, text-xs), `AiLogView.tsx:143` ("ước lượng thô", 10px). Số 2xl ở `WeekView.tsx:134` thì vẫn ổn vì là chữ lớn đậm. Đề xuất: `--warning: 24 90% 36%`, `--success: 152 65% 28%`.
- 🟠 **protein ở chế độ sáng chỉ 4.49:1, sát ngưỡng.** Protein là mục tiêu chính, xuất hiện dạng text-xs đậm ở `MealSection.tsx:62`, `AddSheet.tsx:354,430,455`. Đề xuất: `--protein: 340 78% 46%` (khoảng 5.2:1), thanh tiến độ vẫn đủ tươi.
- 🟠 **Viền ô nhập quá mờ, chỉ 1.5:1, ở mọi theme.** Áp dụng cho `--input` (`index.css:21`), `Input`, `NumberField`. Trong sheet (nền `background`), ô nhập `bg-card` gần như trùng màu nền (card/background chỉ 1.06:1), nên người dùng khó thấy chỗ để gõ. Đề xuất: sáng `--input: 25 15% 56%` (3.15:1), tối `--input: 10 10% 42%` (3.17:1). Hoặc cho ô nhập nền `bg-muted/50`.
- 🟠 **Màu protein bị dùng cho "calo đốt" ở tab Vận động.** `ActivityView.tsx:40` (icon Flame `bg-protein/10 text-protein`) và `:180` (số kcal `text-protein`). Màu hồng vốn có nghĩa "protein", nay lại hiện ở số kcal, gây nhầm lẫn ngữ nghĩa. Đề xuất: dùng `text-warning` / `bg-warning/10` (lửa = cam), hoặc thêm token `--activity`.
- 🟠 **Ô macro trong thẻ mục tiêu bị hard-code `bg-white/15`.** `GoalsView.tsx:47`: ở chế độ tối primary là màu kem nên ô trắng 15% gần như vô hình, còn ở palette Hồng sáng thì chữ chỉ 4.27:1. Đề xuất: `bg-primary-foreground/10`.
- 🟢 Ở chế độ tối, destructive-foreground trên destructive chỉ 3.82:1. Hiện chưa có nút `variant="destructive"` nào dùng tới. Nếu sau này dùng, đặt `--destructive: 0 70% 50%` ở chế độ tối.
- 🟢 Màu không dùng token: `switch.tsx:15` `bg-white` và overlay `bg-black/40` (chấp nhận được); 2 chấm màu xem trước palette `GoalsView.tsx:242-243` (có ghi chú lý do). Ngoài ra không có `text-red-*`/`bg-gray-*` nào, rất sạch.

### 3.2 Cân xứng & khoảng cách

- 🟠 **Nút icon 32px (`size="icon-sm"`, `button.tsx:25`) dùng cho các thao tác chính:** + thêm vào bữa (`MealSection.tsx:99`), ⋯ (`:68`), X đóng sheet (`AddSheet.tsx:146`), ← quay lại (`PortionPicker.tsx:52`, `QuickAdd.tsx:28`, `CustomFoodForm.tsx:48`, `AiLogView.tsx:276`), xoá (`AddSheet.tsx:358,435`, `ActivityView.tsx:102`), mũi tên ngày/tuần (`DayNav.tsx:13,17`, `DateStrip.tsx:33,78`, `WeekView.tsx:62,68`). Apple/Material khuyến nghị 44/48px. Đề xuất: đổi `icon-sm` thành `h-10 w-10` (giữ icon 16px), hoặc thêm vùng chạm `relative after:absolute after:-inset-1.5`.
- 🟠 **Nút chỉ rộng bằng icon 16px:** X bỏ món trong màn AI (`AiLogView.tsx:145-152`, nằm sát số kcal, rất dễ bấm nhầm), X xoá ô tìm kiếm (`AddSheet.tsx:242`), mắt hiện/ẩn key (`GoalsView.tsx:196`). Đề xuất: `flex h-10 w-10 items-center justify-center -mr-2`.
- 🟢 QuickBtn (`AddSheet.tsx:470`) 36px và SyncBadge (`SyncBadge.tsx:28`) 32px: nên tăng lên `h-10 w-10`. Nút + là thao tác lặp nhiều nhất trong app.
- 🟢 Dòng món trong `MealSection.tsx:119` (`py-2.5` + ô emoji 36px ≈ 56px) và dòng trong AddSheet (≈ 56px) đều cao bằng nhau. Tốt.
- 🟢 Thang khoảng cách nhất quán: lề trang `px-4` (34 lần), card `p-4`, khoảng cách các section `space-y-4`, `gap-2/3`. Có vài ngoại lệ lẻ (`p-3.5` ở `WeekView.tsx:132,164`, `space-y-3.5` ở `SummaryCard.tsx:30`, `space-y-5` ở Onboarding) nhưng không gây lệch thấy rõ. Bo góc: card `2xl`, nút/ô `xl`, chip `full`, rất mạch lạc.
- 🟢 Safe-area: header (`PageHeader.tsx:5`) và bottom nav (`pb-safe`) đã xử lý. Nội dung trong Drawer chỉ có `pb-6` (24px), nhỏ hơn thanh home của iPhone (34px), nên nút "Lưu" cuối sheet (`EditLogSheet.tsx:54`, `ActivityView.tsx:167`, `MealSection.tsx:149`) sát mép dưới. Đề xuất: thêm `pb-[max(1.5rem,env(safe-area-inset-bottom))]`.

### 3.3 Font chữ

- 🟠 **Quá nhiều cỡ chữ: 11 cỡ**, gồm 3 cỡ tự chế (`text-[10px]` ×7, `text-[11px]` ×5, `text-[13px]` ×1). Chữ 10px là chữ thông tin, không phải trang trí: macro trên mỗi dòng món `MealSection.tsx:137`, % và gram trong bảng tuần `WeekView.tsx:185,198,209`, nhãn ô mục tiêu `GoalsView.tsx:48`, "ước lượng thô" `AiLogView.tsx:143`. Đề xuất: sàn tối thiểu 11px. Gộp `[10px]` và `[11px]` thành 1 cỡ (thêm `fontSize: { '2xs': ['11px', '14px'] }` vào `tailwind.config.js`), bỏ `[13px]` (`PortionPicker.tsx:72`, dùng `text-sm`).
- 🟢 Độ đậm: dùng 5 mức (400–800) và nạp 10 file font (`main.tsx:3-12`). `font-medium` chỉ có 4 chỗ, có thể đổi sang semibold rồi bỏ 2 file 500 cho nhẹ.
- 🟢 Dấu tiếng Việt: chỉ `CardTitle` dùng `leading-none` (`card.tsx:38`) mà component này không được dùng ở đâu. Các chỗ `leading-tight` đều là 1 dòng, không bị cắt dấu. Tiêu đề viết hoa + `tracking-wider` ("CHÀO BUỔI SÁNG") vẫn đủ khoảng trống cho dấu chồng (Ổ, Ữ).
- 🟢 `num` (tabular-nums) dùng đúng gần như mọi chỗ có số. Còn thiếu ở `TodayView.tsx:90` (phút vận động) và `ActivityView.tsx:52` (% calo tập), không quan trọng.

### 3.4 Dễ dùng (mobile, Gen Z)

- 🔴 **Bấm nhãn làm giảm giá trị ô số.** `<label>` bọc `NumberField` thì "control được gắn nhãn" là phần tử labelable đầu tiên bên trong, tức là **nút "Giảm" (−)**. Hệ quả: bấm vào chữ nhãn, vào chữ đơn vị ("g", "kcal") hoặc vào khoảng trống trong ô đều bấm nút −, nên giá trị giảm đi 1 bước mà không có phản hồi gì.
  - `src/features/goals/GoalsView.tsx:163`: ô **Tự đặt mục tiêu**. Bấm chữ "Kcal" làm mục tiêu kcal giảm 50, protein giảm 5g, và **lưu ngay vào profile + sync**. Chạm thẳng vào ưu tiên "strict calo & protein".
  - `src/features/today/EditLogSheet.tsx:81`: sửa kcal/macro của món nhập tay.
  - `src/features/add/QuickAdd.tsx:65` (component `Field`, dùng cả trong `CustomFoodForm.tsx:68-91`): ô "Nặng (g)" giảm 10g, kcal/macro giảm 1.
  - Sửa: đổi `<label>` thành `<div>`, nhãn để `<span id>` và truyền `aria-labelledby`. Hoặc cho NumberField nhận prop `id` gắn vào `<input>` rồi dùng `<label htmlFor>`. Thêm test: bấm nhãn thì giá trị không đổi.
- 🟠 **Chấm trạng thái ở DateStrip chỉ dựa vào màu.** `DateStrip.tsx:65-72`: xanh/vàng/xám, `aria-label` (`:48`) chỉ có ngày, không có trạng thái. Trái quy ước "không chỉ dựa vào màu" trong CLAUDE.md, và vàng (warning) với xanh (success) ở chế độ sáng chỉ đạt khoảng 3:1. Đề xuất: aria-label thêm "· đạt cả 2 / đạt 1 / chưa đạt". Có thể đổi chấm "đạt cả 2" thành dấu ✓ nhỏ.
- 🟠 **Protein chưa phải phần nổi bật nhất trên màn Hôm nay.** Vòng kcal 168px + số `text-4xl` (`CalorieRing.tsx:47`) chiếm spotlight, còn protein là thanh 12px + chữ `text-sm` (`MacroBar.tsx:35-46`). Đề xuất: số protein còn thiếu viết to (`text-2xl font-extrabold text-protein`) ngay trong hàng protein ("còn 42g"), hoặc thêm vòng protein nhỏ cạnh vòng kcal.
- 🟠 **Dấu calo tập không nhất quán.** `TodayView.tsx:95` hiện `−{kcal}` (màu primary), trong khi `SummaryCard.tsx:21` và `ActivityView.tsx:51` hiện `+` (được ăn thêm). Đề xuất: ở TodayView dùng "đốt 350" hoặc "+175 quỹ".
- 🟠 **Ô số không có dấu hiệu focus.** `NumberField.tsx:71` để input `outline-none` mà khung ngoài không có `focus-within:ring`. Đề xuất: thêm `focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring` vào khung (`:44`). Ô tên món trong màn AI (`AiLogView.tsx:137`) cũng vậy, lại không trông giống ô nhập, nên người dùng không biết là sửa được. Thêm `border-b border-dashed`.
- 🟢 Ngưỡng cảnh báo vòng calo: số chuyển đỏ khi `remaining < 0` (>100%), còn vòng chỉ đỏ khi >110% (`CalorieRing.tsx:20,47`). Trong khoảng 100–110% số đỏ mà vòng vẫn nâu. Nên thống nhất (vòng `warning` ở 100–110%, `destructive` khi >110%, khớp với "Đạt ±10%").
- 🟢 Toast `top-center` (`App.tsx:92`): khi cài PWA trên iPhone có tai thỏ nên kiểm tra offset (`offset={{ top: 'max(env(safe-area-inset-top),16px)' }}`).

### 3.5 Palette Hồng (`src/index.css:69-117`, đang làm)

Tổng quan: **dịu mắt, nữ tính đúng yêu cầu.** Nền `340 60% 97%` hồng phấn rất nhạt, card gần trắng, primary `#B63A63` hồng đất trầm (chế độ tối `#F19DB9` hồng phấn). Chữ chính, chữ phụ, primary đều đạt ≥ 5:1. Quyết định chuyển protein sang **tím lan 285°** là đúng: protein ~ primary đạt ΔE 48 (sáng) / 30 (tối), không còn lẫn. Nếu giữ protein rose 340° thì protein trùng hẳn primary (cùng hue, ΔE ≈ 1–3).

- 🟠 **Ghi chú trong CSS nói sai.** Ghi chú ghi "Tương phản chữ đã kiểm tra ≥ 4.5:1 trên card", nhưng palette Hồng **kế thừa** carbs/fat/fiber/success/warning của chế độ sáng, nên vẫn có carbs 2.62 ❌, fat 3.70, fiber 3.59, warning 3.21, success 4.22. Sửa token sáng như mục 3.1 là palette Hồng hết lỗi theo.
- 🟠 **Tím protein với xanh fat khó phân biệt với người mù màu.** Hồng sáng deutan ΔE 7.5, Hồng tối protan ΔE 6.9. Ở palette gốc cặp này là 66/33, rất an toàn. Đề xuất: đẩy protein sang tím-đỏ hơn (`300 50% 45%` sáng / `300 60% 72%` tối), hoặc làm fat ngả xanh ngọc (`190 85% 36%`) trong palette Hồng.
- 🟠 **Ở Hồng tối, protein và kcal đều là màu pastel sáng** (ΔE 33.7, thấp nhất trong 4 bộ). Thanh protein và vòng kcal hơi "cùng tông". Có thể chấp nhận vì protein có nhãn. Nếu muốn protein nổi hơn thì tăng bão hoà: `--protein: 285 70% 72%`.
- 🟢 Chấm xem trước "Hồng" `#E592B0` (`GoalsView.tsx:243`) **không khớp** primary thật `#B63A63` ở chế độ sáng. Nên dùng màu primary sáng thật, hoặc chia đôi chấm sáng/tối.
- 🟢 `ô bg-white/15` trên primary hồng chỉ 4.27:1 (xem 3.1, đổi sang `bg-primary-foreground/10`).
- 🟢 `<meta name="theme-color">` (`index.html:8-9`) vẫn là kem/nâu, nên thanh trạng thái điện thoại không đổi sang hồng. Có thể cập nhật meta trong `applyPalette()`.
- 🟢 Cần cập nhật CLAUDE.md, mục Quy ước UI: "protein (rose)" → "protein: rose; palette Hồng: tím lan".

## 4. Điểm làm tốt

- Hệ token màu chuẩn shadcn, cả 4 bộ theme khai báo đầy đủ. Không có màu Tailwind thô (`red-500`, `gray-*`). Chart đọc màu qua `useCssColors`, đã theo dõi cả `data-palette`.
- Chế độ tối được chăm chút: mọi màu macro ≥ 5.7:1, primary kem chuyển hợp lý.
- Luồng log món rất nhanh: bữa được chọn sẵn, nút + 1 chạm ở mọi dòng, thêm nhiều món mà sheet không đóng, có thanh tổng "Đã thêm n món", toast có **Hoàn tác**, rung nhẹ khi thêm, không tự focus ô tìm kiếm trên điện thoại (tránh bàn phím che danh sách).
- Trạng thái rỗng có hướng dẫn và hành động cụ thể ("Chép cả ngày hôm trước", "Mô tả bằng AI", hướng dẫn tạo bữa mẫu).
- a11y nền tảng tốt: Drawer luôn có `title`, nút icon có `aria-label`, Segmented dùng `radiogroup`, MacroBar có `progressbar`, bảng tuần có ✓/✗ + caption, tôn trọng `prefers-reduced-motion` ở AnimatedNumber.
- Font Be Vietnam Pro có subset `vietnamese`, số đều dùng tabular-nums nên không bị nhảy khi đếm.

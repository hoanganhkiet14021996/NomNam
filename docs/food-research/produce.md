# Nhật ký nguồn — nhóm nguyên liệu không phải thịt (`src/data/foods/produce.ts`)

## 2026-10-17 — Đợt 1: 123 món (rau củ, trái cây, tinh bột, đậu hạt, sữa, dầu/gia vị)

### Cách lấy nguồn (đọc trước)
- **Bảng thành phần thực phẩm Việt Nam (Viện Dinh dưỡng Quốc gia) — ĐÃ MỞ ĐƯỢC BẢN GỐC**: trang tra cứu `https://viendinhduong.vn/vi/cong-cu-va-tien-ich/gia-tri-dinh-duong-thuc-pham` gọi API công khai `https://viendinhduong.vn/api/fe/foodNatunal/getPageFoodData?page=1&pageSize=1000` (853 thực phẩm, có mã, năng lượng, protein, lipid, glucid, xơ, nước…). Ký hiệu trong bảng dưới: `VDD <mã>`. Lưu ý:
  - `carbohydrate-by-difference` của VDD **đã gồm xơ** (nước + đạm + béo + glucid + tro = 100), cùng quy ước với USDA, nên dùng thẳng làm C.
  - Năng lượng VDD tính glucid 4 kcal/g cả phần xơ nên hơi cao hơn công thức Atwater của app.
  - Xơ VDD là xơ thô (thấp hơn xơ tổng USDA) → ưu tiên xơ USDA khi có.
  - Một số mục VDD chép nguyên số USDA (nấm kim châm, dưa lưới, kiwi, các hạt rang óc chó/macca/hạnh nhân/dẻ cười) → **không tính là nguồn độc lập**.
- USDA FoodData Central CSV: SR Legacy 2018-04 (`SR <fdcId>`) và Foundation 2026-04-30 (`FD <fdcId>`). URL từng bản ghi: `https://fdc.nal.usda.gov/fdc-app.html#/food-details/<fdcId>/nutrients`.
- Matvaretabellen (Na Uy) `https://www.matvaretabellen.no/api/en/foods.json` (`MV <mã>`). Carb MV là carb khả dụng → đã cộng xơ để ra carb tổng.
- Nhãn thương mại (chỉ cho món đóng gói): Con Bò Cười (Colruyt `fic.colruytgroup.com/productinfo/en/algc/4692597`, Carrefour UAE, Supermarket.mt), Lee Kum Kee hoisin (McGrocer, Pak n Save), Kewpie sốt mè rang (Pak n Save, Knuspr).
- Quy tắc chốt: 3+ nguồn cùng trạng thái → trung vị/trung bình; 2 nguồn → trung bình khi lệch > 5%; 1 nguồn → ghi "thấp". Toàn bộ 123 món kiểm Atwater (4P + 4(C−xơ) + 2xơ + 9F) lệch < 10% (món < 60 kcal: lệch < 12 kcal) bằng script.
- Rau củ ghi số **sống** (rau lá luộc gần như không đổi trên 100 g: SR/VDD luộc ≈ sống). Hạt khô/gạo/sợi khô ghi rõ "(khô)/(sống)"; món đã chín ghi "(luộc)/(rang)/(nướng)".

### Món đã thêm

#### Rau củ (sống, trừ khi ghi luộc)

| Món (id) | kcal/P/C/F/xơ (100g) | Khẩu phần mặc định | Nguồn | Độ tin cậy, ghi chú |
|---|---|---|---|---|
| Cải bẹ xanh / cải xanh (`cai-be-xanh`) | 25/2.3/4.2/0.3/2.5 | 1 đĩa 150 g = 38 kcal, P 3.5 | SR 169256 27/2.86/4.67/0.42/3.2; VDD 4016 23/1.7/3.76/0.14/1.8 | Cao. Lệch 16%, lấy trung bình. Luộc gần như không đổi (SR luộc 26, VDD luộc 26). Atwater 24 (5%). |
| Cải thảo (`cai-thao`) | 15/1.1/2.9/0.2/1.2 | 1 đĩa 150 g = 23 kcal, P 1.6 | SR 169979 16/1.2/3.23/0.2/1.2; VDD 4109 14/0.9/2.57/0/- | Cao.  Atwater 15 (-3%). |
| Súp lơ trắng / bông cải trắng (`sup-lo-trang`) | 24/1.9/4.8/0.2/1.9 | 1 phần 150 g = 36 kcal, P 2.9 | SR 169986 25/1.92/4.97/0.28/2; FD 2685573 22.9/1.64/4.72/0.24/1.95; VDD 4099 34/2.5/5.65/0.15/0.9; MV 06.016 19/1.7/3.4/0/1 | Cao. 4 nguồn 19-34, lấy gần trung vị. Atwater 25 (-3%). |
| Mồng tơi (`mong-toi`) | 21/1.9/3.7/0.2/2.3 | 1 chén canh 80 g = 17 kcal, P 1.5 | SR 170474 19/1.8/3.4/0.3/-; VDD 4080 24/2/3.9/0/2.5; SR 169400 (chín) xơ 2.1 | Trung bình. Trung bình 2 nguồn; xơ trung bình VDD + SR bản chín. Atwater 20 (7%). |
| Rau dền (`rau-den`) | 25/2.9/3.4/0.3/1.6 | 1 chén canh 80 g = 20 kcal, P 2.3 | SR 168385 23/2.46/4.02/0.33/-; VDD 4072 (dền cơm) 27/3.4/2.69/0.31/1.6 | Trung bình. Dền đỏ/trắng VDD cao hơn (47-48 kcal); số này theo dền cơm/dền xanh. Atwater 25 (1%). |
| Cải bó xôi / rau chân vịt (`cai-bo-xoi`) | 21/2.9/3.1/0.3/2.2 | 1 đĩa 150 g = 32 kcal, P 4.3 | SR 168462 23/2.86/3.63/0.39/2.2; FD 1750353 21.6/2.91/2.64/0.6/1.59; MV 06.064 17/2.8/3.1/0/3 | Cao.  Atwater 22 (-6%). |
| Cải xoăn (kale) (`cai-xoan`) | 35/3.1/5.3/1.1/4.1 | 1 nắm 50 g = 18 kcal, P 1.6 | SR 168421 35/2.92/4.42/1.49/4.1; MV 06.035 36/3.3/6.2/0.7/4 | Cao.  Atwater 35 (-1%). |
| Nấm kim châm (`nam-kim-cham`) | 37/2.5/8/0.3/2.8 | 1 gói 150 g = 56 kcal, P 3.8 | SR 169382 37/2.66/7.81/0.29/2.7; FD 2003600 36.7/2.42/8.14/0.25/2.95 | Cao. VDD 4133 (44 kcal) chép số USDA nên không tính là nguồn độc lập. Atwater 39 (-6%). |
| Nấm bào ngư / nấm sò (`nam-bao-ngu`) | 31/2.7/5.9/0.3/2.4 | 1 phần 100 g = 31 kcal, P 2.7 | SR 168580 33/3.31/6.09/0.41/2.3; FD 1999627 33.3/2.9/6.94/0.19/2.85; MV 06.126 27/2/4.6/0.4/2 | Cao.  Atwater 32 (-4%). |
| Nấm đông cô / nấm hương (tươi) (`nam-dong-co`) | 35/2.4/7/0.3/3 | 1 phần 100 g = 35 kcal, P 2.4 | SR 169242 34/2.24/6.79/0.49/2.5; FD 1999628 36.4/2.41/8.17/0.2/4.17; MV 06.127 27/1.8/5.5/0.3/3; VDD 4127 51/5.5/6.1/0.5/3 | Cao. 4 nguồn 27-51, lấy gần trung vị. Bản khô lệch lớn giữa nguồn (VDD P 36 vs SR 9.6) nên chưa thêm. Atwater 34 (2%). |
| Nấm đùi gà (`nam-dui-ga`) | 38/2.4/8.5/0.3/3 | 1 cây 60 g = 23 kcal, P 1.4 | FD 2003599 38.5/2.41/8.5/0.31/3.01 | Thấp. 1 nguồn (USDA Foundation). Không tìm thấy trong SR, MV, VDD. Atwater 40 (-6%). |
| Cà tím (`ca-tim`) | 24/0.9/5.6/0.2/2.7 | 1 trái 200 g = 48 kcal, P 1.8 | SR 169228 25/0.98/5.88/0.18/3; FD 2685577 22.4/0.85/5.4/0.12/2.45; MV 06.015 26/0.9/8.5/0.1/6 | Cao. Số sống, chưa dầu. Cà tím xào/nướng mỡ hành hút nhiều dầu, cộng thêm Dầu ăn. Atwater 22 (7%). |
| Ớt chuông (đỏ/vàng) (`ot-chuong`) | 28/1/6.2/0.2/1.8 | 1 trái 150 g = 42 kcal, P 1.5 | SR 170108 26/0.99/6.03/0.3/2.1; FD 2258590 27/0.9/6.65/0.13/1.16; VDD 4061 31/0.99/6.04/0.3/2 | Cao. Ớt chuông xanh thấp hơn (SR 20 kcal). Atwater 27 (4%). |
| Hành tây (`hanh-tay`) | 40/1.3/9.3/0.1/1.7 | 1 củ 150 g = 60 kcal, P 1.9 | SR 170000 40/1.1/9.34/0.1/1.7; VDD 4039 45/1.8/9.29/0.11/1.1; MV 06.042 30/1/8.4/0/4 | Cao. Trung vị 40. Atwater 40 (0%). |
| Hành lá (`hanh-la`) | 29/1.6/6.3/0.1/1.8 | 1 nắm nhỏ 10 g = 3 kcal, P 0.2 | SR 170005 32/1.83/7.34/0.19/2.6; VDD 4038 26/1.3/5.2/0/0.9 | Cao.  Atwater 29 (0%). |
| Tỏi (`toi`) | 139/6.3/28.6/0.4/2.1 | 1 tép 5 g = 7 kcal, P 0.3 | SR 169230 149/6.36/33.06/0.5/2.1; FD 1104647 143/6.62/28.2/0.38/2.7; VDD 4103 126/6/24.65/0.35/1.5; MV 06.038 106 | Cao. Trung bình SR, FD, VDD (MV 106 thấp bất thường). Atwater 139 (0%). |
| Đậu Hà Lan hạt (luộc / đông lạnh) (`dau-ha-lan`) | 75/5.4/14/0.3/4.5 | 1 chén 100 g = 75 kcal, P 5.4 | SR 170017 (đông lạnh luộc) 78/5.15/14.26/0.27/4.5; SR 170419 (sống) 81; MV 06.027 65/4.9/15/0.4/9; VDD 4031 75/6.5/11.71/0.29/1 | Cao. Trung vị 75. Atwater 71 (5%). |
| Đậu Hà Lan non cả vỏ (đậu tuyết) (`dau-ha-lan-non`) | 42/3.1/7.9/0.2/2.8 | 1 phần 100 g = 42 kcal, P 3.1 | SR 170010 42/2.8/7.55/0.2/2.6; MV 06.031 42/3.5/8.3/0.1/3 | Cao.  Atwater 40 (4%). |
| Đậu nành Nhật / edamame (luộc, bóc vỏ) (`edamame`) | 126/11.6/8.4/6.2/5.1 | 1 chén 100 g = 126 kcal, P 11.6 | SR 168411 121/11.91/8.91/5.2/5.2; MV 06.197 130/11.2/7.8/7.2/5 | Cao. Hạt đã bóc vỏ. Cân cả vỏ thì phần ăn được ~50%. Atwater 126 (0%). |
| Bí ngòi (zucchini) (`bi-ngoi`) | 17/1.2/3.2/0.2/1 | 1 trái 200 g = 34 kcal, P 2.4 | SR 169291 17/1.21/3.11/0.32/1; MV 06.085 17/1.3/3.2/0.1/1 | Cao.  Atwater 17 (-2%). |
| Bầu (`bau`) | 16/0.6/3.6/0/0.8 | 1 chén canh 150 g = 24 kcal, P 0.9 | SR 169232 14/0.62/3.39/0.02/0.5; VDD 4001 18/0.6/3.88/0.02/1 | Cao.  Atwater 15 (5%). |
| Mướp (`muop`) | 19/1.1/3.9/0.2/1.1 | 1 chén canh 150 g = 29 kcal, P 1.6 | SR 168414 20/1.2/4.35/0.2/1.1; VDD 4054 18/0.9/3.36/0.14/0.5 | Cao.  Atwater 20 (-3%). |
| Khổ qua / mướp đắng (`kho-qua`) | 18/1/3.9/0.2/2 | 1 trái 150 g = 27 kcal, P 1.5 | SR 168393 17/1/3.7/0.17/2.8; VDD 4055 20/0.9/4.1/0/1.1 | Cao. Món khổ qua nhồi thịt / xào trứng đã có ở nhóm món. Atwater 17 (3%). |
| Su su (`su-su`) | 19/0.8/4.6/0.1/1.8 | 1 trái 200 g = 38 kcal, P 1.6 | SR 170402 19/0.82/4.51/0.13/1.7; MV 06.182 19/0.8/4.8/0.1/2 | Cao.  Atwater 19 (1%). |
| Củ cải trắng (`cu-cai-trang`) | 18/0.8/4.1/0.1/1.6 | 1 phần 100 g = 18 kcal, P 0.8 | SR 168451 18/0.6/4.1/0.1/1.6; MV 06.054 16/0.7/3.5/0.1/1; VDD 4021 27/1.5/5.11/0.09/1.5 | Cao. Trung vị 18. Atwater 17 (4%). |
| Củ dền (`cu-den`) | 42/1.6/9.2/0.2/3 | 1 củ 120 g = 50 kcal, P 1.9 | SR 169145 43/1.61/9.56/0.17/2.8; FD 2685576 41/1.69/8.79/0.3/3.12 | Cao.  Atwater 39 (7%). |
| Măng tây (`mang-tay`) | 22/2.2/3.8/0.1/2.1 | 1 bó 150 g = 33 kcal, P 3.3 | SR 168389 20/2.2/3.88/0.12/2.1; MV 06.012 22/2.2/4/0.1/2; VDD 4052 24/2.2/3.36/0.14/2.3 | Cao.  Atwater 21 (6%). |
| Cần tây (`can-tay`) | 14/0.6/3.1/0.2/1.6 | 1 cây 40 g = 6 kcal, P 0.2 | SR 169988 14/0.69/2.97/0.17/1.6; FD 2346405 14.8/0.49/3.32/0.16 | Cao. VDD 4018 (54 kcal) là cần tây ta lá nhỏ, khác loại nên không tính. Atwater 13 (4%). |
| Măng tre tươi (luộc) (`mang-tre`) | 13/1.5/2.3/0.2/1.5 | 1 phần 100 g = 13 kcal, P 1.5 | SR 169211 (luộc) 12/1.53/1.92/0.22/1; MV 06.119 (đóng hộp) 14/1.5/2.7/0.2/2; VDD 4053 (sống) 31 | Trung bình. Măng sống VDD 31 / SR 27; sau luộc mất nước và chất tan còn ~12-14. Atwater 14 (-8%). |
| Củ sen (luộc/hầm) (`cu-sen`) | 66/1.6/16/0.1/3.1 | 1 phần 100 g = 66 kcal, P 1.6 | SR 168430 (luộc) 66/1.58/16.02/0.07/3.1; MV 06.185 (sống) 65/2.6/16/0.1/5; SR 169250 (sống) 74 | Trung bình. 1 nguồn bản chín, MV sống khớp. Atwater 65 (1%). |
| Rau lang (ngọn khoai lang) (`rau-lang`) | 35/2.6/6.4/0.4/3.4 | 1 đĩa 150 g = 53 kcal, P 3.9 | SR 169303 42/2.49/8.82/0.51/5.3; VDD 4076 28/2.6/3.99/0.21/1.4 | Thấp. Hai nguồn lệch 40%: lấy trung bình. Atwater 33 (6%). |
| Rau ngót (`rau-ngot`) | 45/5.3/5.9/0/2.5 | 1 chén canh 80 g = 36 kcal, P 4.2 | VDD 4086 45/5.3/5.9/0/2.5 | Thấp. 1 nguồn (Bảng VN, Viện Dinh dưỡng). Không có trong USDA/MV. Atwater 40 (12%). |

#### Trái cây (phần ăn được)

| Món (id) | kcal/P/C/F/xơ (100g) | Khẩu phần mặc định | Nguồn | Độ tin cậy, ghi chú |
|---|---|---|---|---|
| Dứa / thơm (`dua-thom`) | 47/0.5/12/0.1/1.2 | 1 miếng 80 g = 38 kcal, P 0.4 | SR 169124 50/0.54/13.12/0.12/1.4; FD 2346398 54/0.46/14.09/0.21/0.93; MV 06.517 44/0.1/11.1/0.1/1; VDD 5015 40/0.5/9.23/0.07/0.4 | Cao. 4 nguồn 40-54, lấy gần trung vị. Atwater 49 (-3%). |
| Lê (`le`) | 49/0.5/12.5/0.2/3 | 1 quả 180 g = 88 kcal, P 0.9 | SR 169118 57/0.36/15.23/0.14/3.1; MV 06.760 44/0.4/11.8/0.1/3; VDD 5023 48/0.7/10.8/0.2/0.6 | Cao. Trung vị 48. Lê Hàn (Asian pear SR 168177) 42. Atwater 48 (2%). |
| Kiwi (`kiwi`) | 57/1/13.4/0.6/2.7 | 1 quả 75 g = 43 kcal, P 0.8 | SR 168153 61/1.14/14.66/0.52/3; FD 2710831 58.5/1.01/13.82/0.64/2.13; MV 06.539 51/0.9/11.6/0.7/3 | Cao.  Atwater 58 (-1%). |
| Dâu tây (`dau-tay`) | 32/0.7/7.7/0.3/2 | 1 chén 150 g = 48 kcal, P 1.1 | SR 167762 32/0.67/7.68/0.3/2; FD 327699 31/0.64/7.63/0.22/1.8 | Cao. VDD 5009 ghi 59 kcal (gấp đôi, nghi khác giống/độ ẩm) nên không tính. Atwater 32 (-1%). |
| Việt quất (`viet-quat`) | 56/0.7/14/0.5/2.4 | 1 hộp 125 g = 70 kcal, P 0.9 | SR 171711 57/0.74/14.49/0.33/2.4; MV 06.502 51/1/12.5/0.9/5; MV 06.667 61/0.3/15.5/0.3/3 | Cao.  Atwater 58 (-4%). |
| Cherry (anh đào) (`cherry`) | 58/1/14.2/0.2/1.6 | 1 chén 140 g = 81 kcal, P 1.4 | SR 171719 63/1.06/16.01/0.2/2.1; MV 06.507 52/0.9/12.3/0.1/1 | Cao. Đã bỏ hạt. Atwater 59 (-2%). |
| Đào (`dao`) | 40/0.9/9.6/0.3/1.5 | 1 quả 150 g = 60 kcal, P 1.4 | SR 169928 39/0.91/9.54/0.25/1.5; FD 325430 42/0.91/10.1/0.27/1.5; MV 06.532 43/0.9/10.3/0.3/2; VDD 5016 37/0.9/7.8/0.2/1.5 | Cao.  Atwater 42 (-4%). |
| Mận (mận Bắc / mận Hà Nội) (`man`) | 47/0.6/11.8/0.2/1.5 | 1 quả 50 g = 24 kcal, P 0.3 | SR 169949 46/0.7/11.42/0.28/1.4; FD 2710837 52.7/0.58/13.46/0.28/1.35; MV 06.544 44/0.5/11.3/0.1/2 | Cao. VDD 5027 "mận tím" 23 kcal thấp bất thường, không tính. Atwater 48 (-3%). |
| Roi / mận miền Nam (`roi`) | 25/0.5/6/0.2/2.9 | 1 quả 60 g = 15 kcal, P 0.3 | SR 168171 (rose-apple) 25/0.6/5.7/0.3/-; VDD 5018 (gioi) 27/0.4/6.4/0/2.9 | Trung bình. Xơ chỉ có ở VDD. Atwater 22 (12%). |
| Chôm chôm (`chom-chom`) | 76/1.3/17.5/0.2/1.2 | 5 quả 90 g = 68 kcal, P 1.2 | VDD 5004 77/1.5/17.7/0/1.3; MV 06.631 75/1/17.3/0.4/1 | Cao. Phần ăn được (bỏ vỏ, hạt) ~18 g/quả. Atwater 75 (2%). |
| Măng cụt (`mang-cut`) | 65/0.6/14.4/0.6/1.5 | 1 quả 30 g = 20 kcal, P 0.2 | VDD 5061 65/0.6/14.4/0.6/1.5; SR 169090 (đóng hộp nước đường, chỉ đối chiếu) 73 | Thấp. 1 nguồn tươi. Phần ăn được ~30 g/quả. Atwater 62 (4%). |
| Vú sữa (`vu-sua`) | 51/1/11.7/0/2.3 | 1 quả 150 g = 77 kcal, P 1.5 | VDD 5054 51/1/11.7/0/2.3 | Thấp. 1 nguồn (Bảng VN). Phần ăn được (bỏ vỏ, hạt) ~150 g/quả vừa. Atwater 46 (9%). |
| Cóc (`coc`) | 62/1.8/13.7/0/0.9 | 1 quả 80 g = 50 kcal, P 1.4 | VDD 5043 62/1.8/13.7/0/0.9 | Thấp. 1 nguồn. Chưa gồm muối ớt / muối tôm chấm kèm. Atwater 60 (3%). |
| Bưởi (`buoi`) | 35/0.5/8.5/0.1/1 | 1 chén múi 150 g = 53 kcal, P 0.8 | SR 167754 38/0.76/9.62/0.04/1; MV 06.771 33/0.6/7.8/0.2/1; VDD 5001 33/0.2/8/0/0.7 | Cao.  Atwater 35 (0%). |
| Quýt (`quyt`) | 47/0.8/11.5/0.3/1.5 | 1 quả 80 g = 38 kcal, P 0.6 | SR 169105 53/0.81/13.34/0.31/1.8; FD 2710832 55.6/1.04/13.42/0.46/1.33; MV 06.526 40/0.9/9.1/0.2/1; VDD 5047 40/0.8/9.2/0/0.6 | Trung bình. 4 nguồn 40-56, lấy trung bình. Atwater 49 (-4%). |
| Hồng xiêm / sapôchê (`hong-xiem`) | 70/0.5/16.2/0.9/3.9 | 1 quả 100 g = 70 kcal, P 0.5 | SR 167759 83/0.44/19.96/1.1/5.3; VDD 5022 58/0.5/12.5/0.7/2.5 | Thấp. Hai nguồn lệch 30%: lấy trung bình. Atwater 67 (4%). |
| Na / mãng cầu ta (`na`) | 82/1.8/19.4/0.3/2.6 | 1 quả 120 g = 98 kcal, P 2.2 | SR 168175 94/2.06/23.64/0.29/4.4; VDD 5034 69/1.6/15.1/0.2/0.8 | Thấp. Hai nguồn lệch 27%: lấy trung bình. Phần ăn được ~120 g/quả vừa. Atwater 82 (-0%). |
| Mãng cầu xiêm (`mang-cau-xiem`) | 62/1.4/14.7/0.2/2.6 | 1 chén 150 g = 93 kcal, P 2.1 | SR 167761 66/1/16.84/0.3/3.3; VDD 5025 58/1.8/12.6/0/1.9 | Cao.  Atwater 61 (2%). |
| Dưa lưới / dưa vàng (`dua-luoi`) | 35/0.8/8.4/0.2/0.9 | 1 miếng 150 g = 53 kcal, P 1.2 | SR 169092 34/0.84/8.16/0.19/0.9; MV 06.600 38/0.8/8.8/0.2/0.9 | Cao. VDD 5060 chép số USDA. Atwater 37 (-5%). |
| Mít (`mit`) | 81/1.5/19.6/0.4/1.5 | 5 múi 125 g = 101 kcal, P 1.9 | SR 174687 95/1.72/23.25/0.64/1.5; MV 06.629 97/1.7/22.3/0.6/2; VDD 5030 (mít mật) 67/1.5/15.2; VDD 5028 (mít dai) 54 | Thấp. Nguồn Tây 95-97, Bảng VN 54-67: lấy gần trung vị. Atwater 85 (-5%). |
| Sầu riêng (`sau-rieng`) | 143/2/27.7/3.5/2.6 | 1 múi 50 g = 72 kcal, P 1.0 | SR 168192 147/1.47/27.09/5.33/3.8; VDD 5048 138/2.5/28.3/1.6/1.4 | Cao. kcal lệch 6%, béo lệch nhiều (1.6-5.3) theo giống. Atwater 145 (-1%). |
| Nhãn (`nhan`) | 56/1.1/13.6/0.1/1.1 | 10 quả 60 g = 34 kcal, P 0.7 | SR 169089 60/1.31/15.14/0.1/1.1; VDD 5035 52/0.9/12/0/1 | Cao. Phần ăn được ~6 g/quả. Atwater 58 (-3%). |
| Vải (`vai`) | 66/0.8/16.5/0.4/1.3 | 10 quả 100 g = 66 kcal, P 0.8 | SR 169086 66/0.83/16.53/0.44/1.3; MV 06.604 71/0.8/16.2/0.4/1; VDD 5052 49/0.7/10.75/0.35/1.1 | Cao. Trung vị 66. Atwater 70 (-6%). |
| Lựu (`luu`) | 81/1.1/18.8/0.7/3.2 | ½ quả 100 g = 81 kcal, P 1.1 | SR 169134 83/1.67/18.7/1.17/4; VDD 5024 79/0.6/18.85/0.15/2.5 | Cao.  Atwater 80 (2%). |
| Khế (`khe`) | 36/1/8.5/0.3/2.9 | 1 quả 120 g = 43 kcal, P 1.2 | SR 171715 31/1.04/6.73/0.33/2.8; MV 06.768 42/1/10.3/0.3/3 | Cao.  Atwater 35 (3%). |
| Hồng (giòn / ngâm) (`hong`) | 55/0.7/14.1/0.2/3.6 | 1 quả 150 g = 83 kcal, P 1.1 | SR 169941 70/0.58/18.59/0.19/3.6; MV 06.767 65/0.7/18/0.3/6; VDD 5021 (hồng ngâm) 48/0.9/11.1; VDD 5020 (hồng đỏ) 38/0.7/8.6 | Thấp. 4 nguồn 38-70: lấy trung bình. Atwater 54 (2%). |
| Cơm dừa già (cùi dừa) (`dua-cui`) | 370/4.1/12.8/34.7/6.6 | 1 miếng 30 g = 111 kcal, P 1.2 | SR 170169 354/3.33/15.23/33.49/9; VDD 3001 385/4.8/10.4/36/4.2 | Cao. Cơm dừa non thấp hơn nhiều (VDD 3002: 54 kcal). Atwater 367 (1%). |
| Chà là khô (`cha-la`) | 286/2.2/75.3/0.2/7.6 | 1 quả 8 g = 23 kcal, P 0.2 | SR 171726 282/2.45/75.03/0.39/8; SR 168191 (medjool) 277/1.81/74.97/0.15/6.7; MV 06.527 298/2.4/76/0.2/8 | Cao. Quả loại nhỏ ~8 g (bỏ hạt); medjool ~24 g/quả. Atwater 297 (-4%). |
| Nho khô (`nho-kho`) | 308/3.3/79.6/0.2/4.5 | 1 nắm 30 g = 92 kcal, P 1.0 | SR 168165 299/3.3/79.32/0.25/4.5; SR 168164 301; MV 06.549 324/3.3/80.3/0/5 | Cao.  Atwater 324 (-5%). |
| Xoài sấy dẻo (có đường) (`xoai-say`) | 324/1.6/81.7/0.6/4.2 | 1 nắm 30 g = 97 kcal, P 0.5 | SR 169091 319/2.45/78.58/1.18/2.4; MV 06.227 329/0.7/84.8/0/6 | Cao. Loại không đường (MV 06.226) ~268 kcal. Atwater 330 (-2%). |

#### Tinh bột (sống/khô, trừ khi ghi chín)

| Món (id) | kcal/P/C/F/xơ (100g) | Khẩu phần mặc định | Nguồn | Độ tin cậy, ghi chú |
|---|---|---|---|---|
| Gạo trắng (sống) (`gao-trang-song`) | 350/7.6/77.7/0.8/1 | 1 phần (≈2 chén cơm) 100 g = 350 kcal, P 7.6 | SR 168877 365/7.13/79.95/0.66/1.3; VDD 1004 346/7.9/76.3/1/0.4; MV 05.212 343/7.8/76.9/0.7/1 | Cao. 100 g gạo nấu ra ~270-300 g cơm. Atwater 346 (1%). |
| Gạo lứt (sống) (`gao-lut-song`) | 363/8.1/76.4/3/3.7 | 1 phần 100 g = 363 kcal, P 8.1 | SR 169703 367/7.54/76.25/3.2/3.6; VDD 1005 359/7.5/76.18/2.68/3.4; MV 05.021 364/9.4/76.8/3/4 | Cao.  Atwater 358 (1%). |
| Gạo nếp (sống) (`gao-nep-song`) | 359/7.7/78.4/1/1.7 | 1 phần 100 g = 359 kcal, P 7.7 | SR 168883 370/6.81/81.68/0.55/2.8; VDD 1001 348/8.6/75.1/1.5/0.6 | Cao.  Atwater 350 (3%). |
| Hủ tiếu / bún / phở khô (sợi khô) (`hu-tieu-soi-kho`) | 362/6/82.2/0.6/1.8 | 1 phần 80 g = 290 kcal, P 4.8 | SR 169742 364/5.95/80.18/0.56/1.6; MV 05.331 361/6/84.2/0.6/2 | Cao. Cân sợi khô trước khi nấu. Sợi tươi xem Bún tươi / Bánh phở tươi. Atwater 355 (2%). |
| Miến (sợi khô) (`mien-kho`) | 345/0.3/85.3/0.1/0.8 | 1 vắt 50 g = 173 kcal, P 0.1 | SR 174258 351/0.16/86.09/0.06/0.5; MV 05.379 345/0.2/86.1/0.1/0.5; VDD 2015 338/0.6/83.7/0.1/1.5 | Cao. Gần như không có đạm. Atwater 342 (1%). |
| Mì sợi khô (mì vắt, không trứng) (`mi-soi-kho`) | 349/11.1/72/2.1/1.7 | 1 vắt 70 g = 244 kcal, P 7.8 | VDD 1022 350/11/74.5/0.9/0.3; MV 05.222 347/11.2/69.4/3.3/3 | Cao.  Atwater 348 (0%). |
| Mì Ý / nui (khô, chưa nấu) (`mi-y-kho`) | 359/12.1/72/2.4/3.1 | 1 phần 80 g = 287 kcal, P 9.7 | SR 169736 371/13.04/74.67/1.51/3.2; MV 05.222 347/11.2/69.4/3.3/3 | Trung bình. MV là mì lúa mì không trứng (gần nhất với pasta khô). Atwater 352 (2%). |
| Bột mì (`bot-mi`) | 351/11.1/74.2/1.2/2.7 | 1 muỗng canh 8 g = 28 kcal, P 0.9 | SR 168894 364/10.33/76.31/0.98/2.7; VDD 1018 347/11/73.2/1.1/0.3; MV 05.010 343/12.1/73.1/1.4/5 | Cao.  Atwater 347 (1%). |
| Bột gạo (`bot-gao`) | 365/6.3/82.9/0.8/1.6 | 1 muỗng canh 9 g = 33 kcal, P 0.6 | SR 169714 366/5.95/80.13/1.42/2.4; VDD 1017 360/6.6/82.6/0.4/0.4; MV 05.223 369/6.2/85.9/0.5/2 | Cao.  Atwater 361 (1%). |
| Bột năng / trân châu khô (tapioca) (`bot-nang`) | 351/0.4/86.9/0/0.9 | 1 muỗng canh 10 g = 35 kcal, P 0.0 | VDD 13046 343/0.7/85.1/0/0.8; SR 169717 (trân châu khô) 358/0.19/88.69/0.02/0.9 | Cao.  Atwater 347 (1%). |
| Khoai môn / khoai sọ (luộc) (`khoai-mon`) | 132/1.2/31.4/0.1/3.2 | 1 củ nhỏ 100 g = 132 kcal, P 1.2 | SR 168486 (luộc) 142/0.52/34.6/0.11/5.1; VDD 2013002 (khoai sọ luộc) 121/1.84/28.27/0.1/1.22 | Trung bình. Lệch 16%: lấy trung bình. Atwater 125 (5%). |
| Khoai lang nướng (`khoai-lang-nuong`) | 111/2.2/27.3/0.1/4 | 1 củ vừa 150 g = 167 kcal, P 3.3 | MV 06.229 111/2.2/27.3/0.1/4; SR 168483 90/2.01/20.71/0.15/3.3; VDD 2008014 170/1.1/40.82/0.27/1.78 | Trung bình. Ba nguồn 90-170, lấy trung vị. Khoai lang VN (khoai mật, khoai Nhật) đặc hơn khoai Mỹ. Atwater 111 (0%). |
| Bắp nếp luộc (hạt) (`bap-nep-luoc`) | 172/3.9/34.1/2.2/1.2 | 1 trái (phần hạt) 150 g = 258 kcal, P 5.8 | VDD 1023 172/3.9/34.1/2.2/1.2 | Thấp. 1 nguồn. Bắp nếp nhiều tinh bột hơn bắp Mỹ (Bắp luộc 96 kcal). Atwater 169 (2%). |
| Hạt diêm mạch / quinoa (đã nấu) (`quinoa-chin`) | 130/5/23.6/2.3/3.9 | 1 chén 150 g = 195 kcal, P 7.5 | SR 168917 120/4.4/21.3/1.92/2.8; MV 06.616 139/5.6/25.9/2.7/5 | Cao.  Atwater 127 (2%). |
| Bánh tortilla (vỏ wrap bột mì) (`banh-tortilla`) | 283/8.4/48/6.4/2.8 | 1 cái (20 cm) 45 g = 127 kcal, P 3.8 | SR 175037 306/8.2/49.38/7.99/3.5; MV 05.381 260/8.5/46.8/4.8/2 | Trung bình.  Atwater 278 (2%). |
| Bánh gạo phồng không tẩm (rice cake) (`banh-gao`) | 364/8.1/77.2/2.9/4.6 | 1 miếng 9 g = 33 kcal, P 0.7 | SR 170250 387/8.2/81.5/2.8/4.2; MV 05.194 340/8/72.9/3/5 | Trung bình. Loại bánh gạo tẩm dầu/đường (One One…) cao hơn, chưa có. Atwater 358 (2%). |

#### Đậu đỗ & hạt

| Món (id) | kcal/P/C/F/xơ (100g) | Khẩu phần mặc định | Nguồn | Độ tin cậy, ghi chú |
|---|---|---|---|---|
| Đậu đen (hạt khô) (`dau-den-kho`) | 341/22.9/59.8/1.6/15.5 | 1 nắm 30 g = 102 kcal, P 6.9 | SR 173734 341/21.6/62.36/1.42/15.5; VDD 3004 341/24.2/57.3/1.7/4 | Cao. Xơ theo USDA (xơ tổng); VDD ghi xơ thô thấp hơn. Atwater 314 (8%). |
| Đậu đỏ (hạt khô) (`dau-do-kho`) | 320/19.9/63/0.5/12.8 | 1 nắm 30 g = 96 kcal, P 6.0 | SR 173727 329/19.87/62.9/0.53/12.7; MV 06.178 310/19.9/63.2/0.5/13 | Cao.  Atwater 311 (3%). |
| Đậu xanh (hạt khô) (`dau-xanh-kho`) | 346/23.6/60.2/1.8/13 | 1 nắm 30 g = 104 kcal, P 7.1 | SR 174256 347/23.86/62.62/1.15/16.3; VDD 3010 346/23.4/57.8/2.4/4.7; MV 06.089 295/23.9/52.4/1.1/10 | Cao. Trung vị 346; xơ trung bình USDA + MV. Atwater 325 (6%). |
| Đậu nành (hạt khô) (`dau-nanh-kho`) | 432/35.2/29.6/19.2/9.3 | 1 nắm 30 g = 130 kcal, P 10.6 | SR 174270 446/36.49/30.16/19.94/9.3; VDD 3007 418/34/29.1/18.4/4.5 | Cao.  Atwater 413 (4%). |
| Đậu lăng (luộc) (`dau-lang-luoc`) | 108/8.4/19.9/0.6/8.5 | 1 chén 150 g = 162 kcal, P 12.6 | SR 172421 116/9.02/20.13/0.38/7.9; MV 06.105 99/7.8/19.7/0.8/9 | Cao.  Atwater 102 (6%). |
| Đậu gà (luộc) (`dau-ga-luoc`) | 135/8.1/22.6/2.4/7.8 | 1 chén 150 g = 203 kcal, P 12.2 | SR 173757 164/8.86/27.42/2.59/7.6; MV 06.213 105/7.4/17.8/2.2/8 | Thấp. Hai nguồn lệch 36% (độ ngậm nước): lấy trung bình. Đậu gà hộp (MV) ~94. Atwater 129 (5%). |
| Đậu phộng luộc (nhân) (`dau-phong-luoc`) | 318/13.5/21.3/22/8.8 | 1 nắm (nhân) 50 g = 159 kcal, P 6.8 | SR 174260 318/13.5/21.26/22.01/8.8 | Trung bình. 1 nguồn; cân phần nhân đã bóc vỏ (vỏ ~ 40% khối lượng). Atwater 320 (-1%). |
| Hạt óc chó (`oc-cho`) | 671/14.6/11.5/67.2/6.3 | 1 nắm 30 g = 201 kcal, P 4.4 | SR 170187 654/15.23/13.71/65.21/6.7; FD 2346394 678.7/14.56/10.91/69.74/5.21; MV 06.560 680/14.1/9.8/66.5/7 | Cao. VDD 3043011 chép số USDA. Atwater 697 (-4%). |
| Hạt mắc ca (rang) (`macca`) | 718/7.9/13.8/75.8/8.6 | 1 nắm 30 g = 215 kcal, P 2.4 | SR 170179 718/7.79/13.38/76.08/8; MV 06.617 753/7.9/14.6/75.8/9; FD 2515378 668.5/7.79/24.09/64.93/7.56 | Cao. Trung vị 718. VDD 3044011 chép số USDA. Atwater 752 (-5%). |
| Hạt dẻ cười (rang) (`de-cuoi`) | 580/21.3/22.7/48/9.7 | 1 nắm (nhân) 30 g = 174 kcal, P 6.4 | SR 170185 572/21.05/28.28/45.82/10.3; MV 06.668 589/21.6/17.1/50.3/9; FD 2515379 560.7/20.51/27.69/45.02/6.97 | Cao. Cân nhân (vỏ ~ 50% khối lượng). Atwater 589 (-1%). |
| Hạt dẻ rang (`hat-de`) | 215/3.2/47.5/2.2/6.6 | 1 nắm (nhân) 50 g = 108 kcal, P 1.6 | SR 170190 245/3.17/52.96/2.2/5.1; MV 06.039 184/3.2/42/2.2/8; SR 170573 (hạt dẻ TQ rang) 239 | Trung bình. Lệch 28%: lấy trung bình SR + MV. Cân phần nhân. Atwater 209 (3%). |
| Hạt chia (`hat-chia`) | 484/19/42.5/32.5/37.7 | 1 muỗng canh 12 g = 58 kcal, P 2.3 | SR 170554 486/16.54/42.12/30.74/34.4; MV 05.380 482/21.4/42.8/34.2/41 | Cao.  Atwater 463 (4%). |
| Hạt lanh (`hat-lanh`) | 524/18.3/28.7/42.2/27.2 | 1 muỗng canh 10 g = 52 kcal, P 1.8 | SR 169414 534/18.29/28.88/42.16/27.3; MV 05.012 514/18.3/28.6/42.2/27 | Cao.  Atwater 513 (2%). |
| Mè / vừng (`me-vung`) | 583/19.1/19.7/50/11.8 | 1 muỗng canh 9 g = 52 kcal, P 1.7 | SR 170150 573/17.73/23.45/49.67/11.8; VDD 3020 582/20.1/21.1/46.4/3.5; MV 05.030 595/19.6/14.4/53.8/13 | Cao. Trung vị 582. Atwater 582 (0%). |
| Hạt bí (nhân, rang) (`hat-bi`) | 580/33/12.9/47.5/7.8 | 1 nắm (nhân) 30 g = 174 kcal, P 9.9 | SR 170557 574/29.84/14.71/49.05/6.5; MV 05.170 585/36.3/11/45.9/9; VDD 3028 528/35.1/25.3/31.8/2.3 | Cao. Cân phần nhân. Ăn kiểu cắn hạt cả vỏ thì phần ăn được ~ 70-75%. Atwater 596 (-3%). |
| Hạt hướng dương (nhân, rang) (`huong-duong`) | 602/21.8/18.8/52.1/10.6 | 1 nắm (nhân) 30 g = 181 kcal, P 6.5 | SR 170563 582/19.33/24.07/49.8/11.1; MV 05.126 621/24.2/13.6/54.4/10 | Cao. Cân phần nhân (vỏ ~ 45% khối lượng). Atwater 610 (-1%). |
| Hạt sen khô (`hat-sen-kho`) | 337/17.7/62.3/2.2/2.2 | 1 nắm 30 g = 101 kcal, P 5.3 | SR 170149 332/15.41/64.47/1.97/-; VDD 4041 342/20/60.2/2.4/2.2 | Cao. Hạt sen tươi luộc (VDD 3039002) ~172 kcal. Atwater 335 (0%). |

#### Sữa & chế phẩm

| Món (id) | kcal/P/C/F/xơ (100g) | Khẩu phần mặc định | Nguồn | Độ tin cậy, ghi chú |
|---|---|---|---|---|
| Sữa tươi ít béo (1–2%) (`sua-tuoi-it-beo`) | 46/3.3/4.9/1.5/0 | 1 hộp 180ml 185 g = 85 kcal, P 6.1 | SR 171267 (2%) 50/3.3/4.8/1.98; SR 170872 (1%) 42/3.37/4.99/0.97; FD 322228 (1%) 43/3.38/5.19/0.95 | Cao. Khẩu phần theo gram (sữa ~1.03 g/ml). Atwater 46 (-1%). |
| Sữa chua Hy Lạp nguyên kem (không đường) (`sua-chua-hy-lap-nguyen-kem`) | 96/8.9/4.4/4.7/0 | 1 hộp 100 g = 96 kcal, P 8.9 | SR 171304 97/9/3.98/5; FD 2259794 94.5/8.78/4.75/4.39 | Cao.  Atwater 96 (1%). |
| Sữa chua Hy Lạp ít béo 2% (không đường) (`sua-chua-hy-lap-it-beo`) | 71/9.6/3.7/2/0 | 1 hộp 100 g = 71 kcal, P 9.6 | SR 170903 73/9.95/3.94/1.92; MV 01.334 69/9.2/3.4/2.1 | Cao.  Atwater 71 (-0%). |
| Phô mai cottage (ít béo 2%) (`pho-mai-cottage`) | 82/10.7/4.5/2.3/0 | ½ chén 110 g = 90 kcal, P 11.8 | SR 172182 81/10.45/4.76/2.27; FD 328841 84/11/4.31/2.3; (loại nguyên kem: SR 172179 98, MV 01.028 97) | Cao.  Atwater 82 (1%). |
| Phô mai Con Bò Cười (miếng tam giác) (`pho-mai-con-bo-cuoi`) | 242/10.7/6/19.5/0 | 1 miếng 15 g = 36 kcal, P 1.6 | Nhãn Colruyt (BE) 228/11.5/6/17.5; Carrefour UAE 260/9.5/6/22; Supermarket.mt 239/11/6/19; FPT Shop trích Viện DD 259 kcal | Trung bình. Trung bình 3 nhãn; công thức khác nhau theo thị trường. Atwater 242 (-0%). |
| Phô mai parmesan (`parmesan`) | 403/33.4/1.6/28.6/0 | 1 muỗng canh bào 5 g = 20 kcal, P 1.7 | SR 170848 392/35.75/3.22/25; MV 01.200 414/31.1/0/32.2 | Cao.  Atwater 397 (1%). |
| Phô mai cheddar (`cheddar`) | 400/23.7/2/33.1/0 | 1 lát 20 g = 80 kcal, P 4.7 | SR 173414 403/22.87/3.37/33.31; FD 328637 408/23.3/2.44/34; MV 01.027 389/25/0.3/32 | Cao.  Atwater 401 (-0%). |
| Sữa đặc có đường (`sua-dac`) | 328/7.9/54.4/8.7/0 | 1 muỗng canh 20 g = 66 kcal, P 1.6 | SR 171275 321/7.91/54.4/8.7; VDD 10047 328/7.91/54.4/8.7; MV 10.147 328/7.9/54.5/8.7 | Cao. Nếu là sữa đặc "kem đặc" có dầu thực vật, số liệu gần tương đương. Atwater 328 (0%). |
| Kem tươi / whipping cream (`kem-whipping`) | 346/2.4/2.9/36.5/0 | 1 muỗng canh 15 g = 52 kcal, P 0.4 | SR 170859 340/2.84/2.84/36.08; MV 01.015 353/2/2.9/37 | Cao.  Atwater 350 (-1%). |
| Bơ lạt / bơ động vật (`bo-lat`) | 743/0.8/0.3/82.4/0 | 1 muỗng cà phê 5 g = 37 kcal, P 0.0 | SR 173430 717/0.85/0.06/81.11; MV 08.237 753/1/0.5/83; VDD 6001 756/0.5/0.5/83.5 | Cao.  Atwater 746 (-0%). |
| Sữa bột nguyên kem (`sua-bot-nguyen-kem`) | 495/26.7/38.2/26.4/0 | 1 muỗng gạt 10 g = 50 kcal, P 2.7 | SR 170876 496/26.32/38.42/26.71; VDD 10006 494/27/38/26 | Cao. Sữa bột công thức trẻ em/người lớn có đường thêm thì khác. Atwater 497 (-0%). |
| Sữa yến mạch (oat milk) (`sua-yen-mach`) | 52/1/7.8/1.9/0 | 1 hộp 180ml 180 g = 94 kcal, P 1.8 | FD 2257046 48.3/0.8/5.1/2.75/0; MV 13.125 56/1.1/10.5/1/0 | Trung bình. Lệch theo hãng (ngọt tự nhiên từ enzyme). Atwater 52 (-1%). |

#### Dầu mỡ, gia vị, nước chấm

| Món (id) | kcal/P/C/F/xơ (100g) | Khẩu phần mặc định | Nguồn | Độ tin cậy, ghi chú |
|---|---|---|---|---|
| Dầu ô liu (`dau-olive`) | 892/0/0/99.6/0 | 1 muỗng canh 14 g = 125 kcal, P 0.0 | SR 171413 884/0/0/100; MV 08.019 892/0.2/0/99; VDD 6014 900/0/0/100 | Cao.  Atwater 896 (-0%). |
| Dầu mè (`dau-me`) | 894/0/0/99.9/0 | 1 muỗng cà phê 5 g = 45 kcal, P 0.0 | SR 171016 884; MV 08.105 898/0.2/0/99.7; VDD 6012 900 | Cao.  Atwater 899 (-1%). |
| Dầu dừa (`dau-dua`) | 893/0/0/99.4/0 | 1 muỗng canh 14 g = 125 kcal, P 0.0 | SR 171412 892/0/0/99.06; MV 08.249 894/0/0/99.3; VDD 6009 900/0/0/100 | Cao.  Atwater 895 (-0%). |
| Mỡ heo (mỡ nước) (`mo-heo`) | 899/0/0/99.8/0 | 1 muỗng canh 13 g = 117 kcal, P 0.0 | SR 171401 902/0/0/100; VDD 6004 896/0/0/99.6 | Cao.  Atwater 898 (0%). |
| Bơ thực vật (margarine) (`bo-thuc-vat`) | 729/0.4/0.4/81.1/0 | 1 muỗng cà phê 5 g = 36 kcal, P 0.0 | SR 171040 717/0.16/0.7/80.71; VDD 6005 729/0.5/0.1/80.7; MV 08.262 742/0.5/0.5/82 | Cao.  Atwater 733 (-1%). |
| Nước mắm (nguyên chất) (`nuoc-mam`) | 32/6.1/1.8/0/0 | 1 muỗng canh 18 g = 6 kcal, P 1.1 | SR 174531 35/5.06/3.64/0.01; VDD 13015 (loại I) 28/7.1/0/0; VDD 13014 (đặc biệt) 60/15 | Trung bình. Mắm càng nhiều độ đạm càng cao kcal (đến ~60). Atwater 32 (1%). |
| Nước tương / xì dầu (`nuoc-tuong`) | 54/7.2/6.2/0.3/0.8 | 1 muỗng canh 16 g = 9 kcal, P 1.2 | SR 174277 53/8.14/4.93/0.57/0.8; VDD 13022 55/6.3/7.46/0.04/0.8 | Cao. Nước tương ngọt có thêm đường (MV 10.126 ~84) cao hơn. Atwater 55 (-1%). |
| Tương ớt (`tuong-ot`) | 71/1.4/14.5/0.8/1.8 | 1 muỗng canh 15 g = 11 kcal, P 0.2 | SR 171186 93/1.93/19.16/0.93/2.2; SR 171188 (tương ớt Sriracha Huy Fong) 79/1.86/15.87/0.9/2.2; VDD 13021 41/0.5/8.5/0.5/0.9 | Thấp. Ba nguồn 41-93: lấy trung bình. Tùy hãng nhiều đường/ít đường. Atwater 67 (5%). |
| Tương đen (hoisin) (`tuong-den`) | 225/2.5/47.8/2.4/2.8 | 1 muỗng canh 18 g = 41 kcal, P 0.5 | SR 172886 220/3.31/44.08/3.39/2.8; nhãn Lee Kum Kee (McGrocer UK 228/1.8/53/0.7; Pak n Save NZ ~238/1.9/51.2/2.3) | Cao. Chén tương chấm phở/bò bía thường pha thêm tương ớt. Atwater 217 (3%). |
| Dầu hào (`dau-hao`) | 62/2.1/12.8/0.3/0.2 | 1 muỗng canh 18 g = 11 kcal, P 0.4 | SR 174529 51/1.35/10.92/0.25/0.3; VDD 13027 73/2.9/14.7/0.3/0 | Trung bình. Lệch 30%: lấy trung bình. Atwater 62 (0%). |
| Sốt mayonnaise (`mayonnaise`) | 690/0.5/0.3/76.3/0 | 1 muỗng canh 14 g = 97 kcal, P 0.1 | SR 171009 680/0.96/0.57/74.85; VDD 13023 701/0/0.1/77.8 | Cao. Mayo ít béo (light) ~ 300-330 kcal. Atwater 690 (0%). |
| Tương cà (ketchup) (`ketchup`) | 109/1/27.3/0.3/1.5 | 1 muỗng canh 17 g = 19 kcal, P 0.2 | SR 168556 101/1.04/27.4/0.1/0.3; FD 747693 117/1.11/26.8/0.55; MV 06.079 110/1/27.6/0.4/4 | Cao.  Atwater 113 (-4%). |
| Sốt mè rang (salad) (`sot-me-rang`) | 440/2.9/13.1/42.1/1 | 1 muỗng canh 15 g = 66 kcal, P 0.4 | SR 171006 443/3.1/8.6/45.2/1; nhãn Kewpie NZ ~445/3/14.8/41.2; nhãn Kewpie (Knuspr DE) 433/2.6/16/40 | Cao. Calo ẩn của salad: 2 muỗng canh ≈ 130 kcal. Atwater 441 (-0%). |
| Nước cốt dừa (đóng hộp) (`nuoc-cot-dua`) | 203/2/3.2/21.3/2 | 1 muỗng canh 15 g = 30 kcal, P 0.3 | SR 170173 197/2.02/2.81/21.33/-; MV 06.701 209/2/3.5/21.3/2 | Cao. Loại "light" (MV 06.780) ~72 kcal. Atwater 209 (-3%). |
| Mắm tôm (nguyên chất) (`mam-tom`) | 73/14.8/0/1.5/0 | 1 muỗng canh 18 g = 13 kcal, P 2.7 | VDD 13011 (mắm tôm đặc) 73/14.8/0/1.5 | Thấp. 1 nguồn. Chén mắm tôm pha bún đậu còn thêm đường, chanh, dầu nóng. Atwater 73 (0%). |
| Đường cát trắng (`duong-cat`) | 392/0/99.7/0/0 | 1 muỗng cà phê 4 g = 16 kcal, P 0.0 | SR 169655 387/0/99.98/0; FD 334247 385/0/99.6/0.32; MV 09.002 400/0/100/0; VDD 12014 397/0/99.3/0 | Cao.  Atwater 399 (-2%). |

### Bỏ khỏi đợt này vì agent khác đã thêm cùng lúc (trùng nghĩa)
- Nước mắm pha → đã có `nuoc-mam-pha` (vn-rice.ts, 88 kcal/100 g). Tôi tự tính công thức 1 mắm : 1 đường : 1 chanh : 3 nước ra ~75 kcal/100 g (Food Network ~78/100 ml) → số 88 của bảng kia hợp lý cho kiểu cơm tấm ngọt.
- Sữa hạnh nhân không đường → đã có `sua-hanh-nhan-kd` (west-drinks.ts, 15/0.5/0.6/1.1) — khớp nguồn tôi tra (SR 15, FD 14.6, MV 13).
- Corn flakes → đã có `ngu-coc-corn-flakes` (west-drinks.ts). Nguồn tôi tra: SR 174648 384, MV 05.033 381, VDD 1015 386.
- `hu-tieu-kho` là món hủ tiếu khô (vn-noodle.ts) → sợi khô của tôi đổi id thành `hu-tieu-soi-kho`.

### Chưa đủ dữ liệu / bỏ qua
- Nấm rơm: VDD 4129 61 kcal, F 3.2 (bất thường) vs SR đóng hộp 32 → lệch gấp đôi, chưa thêm (món `nam` cũ vẫn dùng được).
- Nấm đông cô khô: VDD P 36 g vs SR P 9.6 g → chưa thêm. Mộc nhĩ khô: SR 284 kcal nhưng Atwater chỉ 195 (xơ 70%) → chưa thêm.
- Củ đậu (jicama): chỉ SR, kcal 38 vs Atwater 29; VDD không có → chưa thêm.
- Khoai mì luộc: chỉ có bản sống (SR 160, MV 159, VDD 158); không có số luộc → chưa thêm.
- Chanh dây: chỉ SR (97 kcal, xơ 10.4, Atwater 88) → chưa thêm.
- Rong biển / lá nori: MV 255 kcal nhưng P 7.9, xơ 0 (nghi sai); VDD "Rong biển" 700 kcal (là snack tẩm dầu) → chưa thêm.
- Miến luộc: chỉ MV (210 kcal, tỉ lệ nở bất thường) → chưa thêm; dùng `mien-kho` cân khô.
- Yến mạch nấu nước: SR 71 vs MV 39 (tùy lượng nước) → không thêm, cân yến mạch khô (`yen-mach`).
- Táo ta: SR jujube 79 vs VDD táo ta 40 (khác loài) → chưa thêm. Rau má: chỉ 1 nguồn, thường uống dạng nước ép → để lần sau.
- Bánh hỏi, sợi bánh canh, sa tế, hạt nêm, bột chiên xù: không có ≥ 2 nguồn đáng tin.

### Món cũ nghi sai (CHỈ GHI NHẬN, không sửa — bảng gốc `foods.vn.ts` khóa trong đợt này)
| Món (id) | Số hiện tại (100 g) | Bằng chứng | Đề xuất |
|---|---|---|---|
| `bo` Bơ (trái) | 160/2/8.5/14.7/6.7 (= Hass USDA) | VDD 5041 bơ vỏ tím 76/1.8/3.2/6.2; VDD 5042 bơ vỏ xanh 103/1.9/2.8/9.4; SR 171707 bơ Florida 120/2.23/7.82/10.06 | Bơ VN (bơ sáp, 034) ít béo hơn Hass 25-50%. Nên thêm món "Bơ sáp VN" ~100-120 kcal hoặc ghi rõ "bơ Hass". |
| `khoai-lang` Khoai lang luộc | 86/1.6/20/0.1/3 (= SR **sống**) | SR 168484 luộc 76/1.37/17.72; MV 06.101 80; VDD 2008002 luộc 122/0.78/29.22 | Số Tây 76-86 nhưng khoai lang VN đặc hơn (122). Lệch > 15% với VDD → cân nhắc trung bình (~100) hoặc tách "khoai lang VN". |
| `thanh-long` | 60/1.2/13/0.4/3 | VDD 5044 47/1.3/10.5/0/1.8 | Cao hơn bảng VN 28%. Cần thêm 1 nguồn trước khi sửa. |
| `dua-hau` | 30/0.6/7.6/0.2/0.4 | VDD 5011 18/1.2/2.8/0.2/0.5 | Lệch 40% nhưng chỉ 12 kcal/100 g; ít ảnh hưởng. |
| `gia-do` | 30/3/5.9/0.2/1.8 (SR) | VDD 4036 giá đậu xanh 52/5.5/7.17/0.13/2 | VDD cao hơn 70%; cần nguồn thứ 3. |
| `hat-dieu` | 553/18/30/44/3.3 (= SR **sống**) | SR 169421 rang khô 574; VDD 3015 608/18.4/29.3/46.3 | Hạt điều bán ở VN thường đã rang → +4-10%. |
| `nam` Nấm tươi | alias 'nam dong co', 'nam rom' | Đã có món riêng `nam-dong-co` | Nên bỏ alias 'nam dong co' khỏi `nam` để tìm kiếm không lẫn. |

### Nhóm còn thiếu cho lần sau
- Rau thơm (ngò, húng, tía tô…) — ăn ít, ưu tiên thấp; rau má, rau muống luộc/xào đã có món.
- Các loại đậu luộc (đen, đỏ, xanh, nành) — hiện chỉ có SR, cần nguồn chín thứ 2.
- Bơ sáp VN, khoai lang VN, bắp nếp (đang 1 nguồn), đậu phộng luộc (1 nguồn).
- Gia vị đóng gói VN có nhãn: hạt nêm, nước tương Maggi/Chinsu, tương ớt Chinsu (cần nhãn sản phẩm), mắm nêm, mắm ruốc.
- Sữa chua uống / sữa chua ít đường các hãng VN (cần nhãn Vinamilk/TH).

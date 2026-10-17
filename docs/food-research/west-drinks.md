# Nhóm món Tây / chuỗi cửa hàng / đồ uống: nguồn số liệu

File code: `src/data/foods/west-drinks.ts` (`WEST_DRINK_FOODS`). Số trong bảng là **tổng 1 phần** (kcal/P/C/F/xơ), riêng món dùng `food()` ghi **trên 100 g**.

## 2026-10-17: đợt 1 (52 món)

### Cách lấy nguồn
- USDA FoodData Central: bộ CSV chính thức. SR Legacy 2018-04, Foundation 2026-04 và **FNDDS 2024-10-31** (`https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_survey_food_csv_2024-10-31.zip`; FNDDS dùng `nutrient_number` 208/203/204/205/291/221, không dùng `nutrient_id`). Trang từng bản ghi: `https://fdc.nal.usda.gov/fdc-app.html#/food-details/<fdcId>/nutrients`. Khẩu phần (gram/miếng) lấy từ `food_portion.csv` của FNDDS.
- Matvaretabellen (MV, Na Uy): `https://www.matvaretabellen.no/api/en/foods.json`.
- MEXT (MX, Bảng thành phần thực phẩm Nhật, bản 8, 2020): file xlsx `20201225-mxt_kagsei-mext_01110_012.xlsx` (mext.go.jp). Cột kcal, PROT-, FAT-, CHOCDF- (carb tổng), FIB-.
- Bảng TPTP Việt Nam (VN): bản số hoá đã có trong thư mục tạm của đợt trước (rượu, nước ép dưa hấu, sữa đặc, corn flakes).
- Trang chính thức của hãng: McDonald's Singapore (mcdonalds.com.sg/food-menu/…). McDonald's VN (mcdonalds.vn) và KFC VN **không công bố** dinh dưỡng. mcdonalds.com (US) và starbucks.com chặn tải tự động.
- Atwater: kiểm cả 52 món bằng script, không món nào lệch quá 10% (rượu bia tính thêm cồn 7 kcal/g).

### Bảng món mới

| id | Món · khẩu phần | kcal/P/C/F/xơ | Nguồn 1 | Nguồn 2 | Lệch / quyết định | Tin cậy |
|---|---|---|---|---|---|---|
| `mcchicken` | McChicken, 1 cái 145 g | 391/15/42/18/2 | McDonald's SG chính thức (mcdonalds.com.sg/food-menu/mcchicken): 391/15/42/18/2 | McDonald's US (con số công bố quen thuộc ~400 kcal; trang bị chặn, chưa mở được) | ~2%. Dùng số SG (công thức châu Á). Gram ước theo bản US ~143 g | Cao |
| `mcnuggets-6` | McNuggets 6 miếng 96 g, chưa sốt | 273/14/17/16/1 | McDonald's SG (chicken-mcnuggets-6pc): 273/14/17/16/1 | FatSecret SG khớp 273; bản US 250 kcal | 9%. Dùng số SG. Sốt BBQ/chua ngọt 1 gói khoảng 45–50 kcal, phải log riêng | Cao |
| `filet-o-fish` | Filet-O-Fish 136 g | 360/15.5/38.5/16/2 | McDonald's SG: 332/15/38/13/2 | USDA SR 170319 (McD US) 282/100 g × 136 g = 384 | Lệch 15% (bản US nhiều sốt tartar hơn). Lấy trung bình | Trung bình |
| `zinger-burger` | Zinger KFC 195 g | 460/26.5/40/21/2 | FatSecret AU (theo bảng KFC AU) 185 g: 448/26.2/34.4/22.5 | FatSecret NZ 211 g: 484/27.6/46.8/19.5 | Tính trên 100 g lệch 5%. Lấy trung bình, quy về 195 g. KFC VN không công bố số | Trung bình |
| `pizza-pepperoni-lat` | 1 lát 105 g (đế vừa) | 291/12.1/33.5/12.1/2.3 | FNDDS 2708640 (pizza nhà hàng, đế vừa) 282/11.7/32/11.9/2.3 | SR 172044 Domino's 14" hand-tossed 273/11.3/31.9/11.2/2.1 | 3%. Trung bình × 105 g | Cao |
| `mi-y-carbonara` | 1 đĩa 320 g | 670/27/70/33/3 | MV 10.226 Pasta carbonara 181/100 g | FNDDS 2708861 (mì sốt kem có thịt, nhà hàng) 213/100 g. Tự tính theo công thức quán VN (90 g mì khô, 30 g bacon, 50 ml kem, 1 trứng, 10 g parmesan) ra 237/100 g | Các nguồn lệch tới 30%. Chọn trung bình 3 cách (210/100 g) | Trung bình |
| `lasagna` | 1 miếng 250 g | 475/27.5/30/27.3/3.5 | SR 169850 lasagna thịt kiểu nhà hàng 185/10.8/11.4/10.7 | SR 169030 Carrabba's 191, SR 169851 Olive Garden 184, FNDDS 2708753 nấu nhà 206 | ≤11%. Lấy khoảng 190/100 g | Cao |
| `salad-caesar-ga` | 1 phần 300 g (2 muỗng sốt, crouton) | 420/27/19/26/3.5 | Tự tính: FNDDS 2706818 salad Caesar gà (chưa sốt) 286 g + FNDDS 2710199 sốt Caesar 30 g + bánh mì nướng 15 g, ra 405 kcal | MV 06.200 Caesar salad 176/100 g (nhiều sốt hơn) | MV × 300 g = 528, lệch 25%. Chọn theo công thức có 2 muỗng sốt. Ăn nhiều sốt thì cộng thêm khoảng 80 kcal/muỗng | Trung bình |
| `salad-uc-ga` | 1 phần 320 g | 385/39.5/14/18.5/2.8 | Tự tính: ức gà nướng 120 g (USDA 165/31/0/3.6), 150 g rau, 30 g bắp, 1 muỗng dầu oliu + giấm, 3 g đường | So với FNDDS 2706818 (mật độ đạm tương đương) | Ước lượng theo công thức | Trung bình |
| `sandwich-ca-ngu` | 1 cái 180 g | 392/20/31/21.5/1.6 | FNDDS 2707034 (180 g/cái) 218/9.9/18.3/11.8 | SR 170299 sub cá ngừ 218/12.3/16/12 | kcal 0%. Lấy trung bình macro | Cao |
| `club-sandwich` | 1 phần 250 g | 568/41.5/48/23.3/2.5 | FNDDS 2706997 club sandwich nhà hàng 234/16/18.4/10.6 | SR 170752 club gà nướng bacon 220/17.2/19.9/8.1 | 6%. Trung bình × 250 g. Chưa gồm khoai chiên ăn kèm | Cao |
| `hotdog` | 1 cái 102 g | 290/10.3/25.4/16.1/0.9 | FNDDS 2707056 (102 g/cái) 296/100 g | Tự tính: bánh 45 g + xúc xích 45 g + sốt 12 g, ra 277 kcal | 8%. Trung bình | Cao |
| `pancake` | 2 cái vừa 100 g, 30 g siro, 5 g bơ | 364/7/59.7/11.4/1.9 | FNDDS 2708294 282/100 g, SR 167926 239, MX 15083 253: trung bình 258 | Siro SR 169578 (234/100 g), bơ | Các nguồn lệch tới 18%. Lấy trung bình cộng 3 nguồn | Trung bình |
| `waffle` | 1 cái vừa 75 g | 225/5.6/31.5/8.6/1.5 | FNDDS 2708312 / SR 167517 309/100 g | SR waffle tự làm ~291, MX 15084 241 | Lấy khoảng 300/100 g | Trung bình |
| `tiramisu` | 1 miếng 100 g | 340/5.6/30/22.5/0.6 | FNDDS 2705702 353/5.7/29.4/23.9 | Tự tính (30% ladyfinger, 35% mascarpone MV 436, trứng, đường), ra ~330 | 7% | Cao |
| `cheesecake` | 1 miếng 100 g | 340/6.4/27.9/23.4/0.4 | FNDDS 2707861 399 | SR 172711 321, MX 15134 (nướng) 299 | Lệch 25%. Lấy trung bình 3 nguồn. Miếng ở quán to hơn thì chỉnh gram | Trung bình |
| `donut` | 1 cái 60 g phủ đường | 244/3.9/28.5/13.3/1.2 | SR 172758 donut men glazed 421 | FNDDS 2708072 421, MX 15077 379 | 10%. Trung bình 407/100 g | Cao |
| `muffin` | 1 cái 110 g | 418/5.2/55.6/19.8/1.7 | SR 172765 muffin việt quất 375 | MV 05.322 385, FNDDS 2707832 (socola) 402 | 3%. Trung bình SR + MV | Cao |
| `ngu-coc-corn-flakes` | /100 g (1 bát 30 g, khô) | 377/7.4/83.9/1.4/3.6 | FNDDS 2708453 365 | MV 05.033 Kellogg's 381, VN 1015 Bỏng ngô 386 | 5%. Trung bình. Sữa tính riêng | Cao |
| `sushi-nigiri-ca-hoi` | 1 miếng 35 g | 44/2.9/5.3/1.2/0.1 | FNDDS 2708969 (35 g/miếng) 107/100 g | MV 04.334 143/100 g (cá hồi nuôi béo hơn) | 29%. Trung bình 125/100 g | Trung bình |
| `california-roll` | 8 miếng 200 g | 206/7.1/38/2.7/1.5 | FNDDS 2708961 94/100 g (30 g/miếng) | MV 04.368 112/100 g | 17%. Trung bình. Cuộn có nhiều mayo thì cao hơn | Trung bình |
| `maki-ca-hoi` | 6 miếng 150 g | 173/9/24.5/4.2/0.8 | FNDDS 2708963 103/100 g | MV 04.337 128/100 g | 22%. Trung bình | Trung bình |
| `kimbap` | 1 cuộn 230 g | 360/11/55/10.5/2.5 | Nghiên cứu ĐH Kongju (2022) về kimbap cửa hàng tiện lợi: trung bình 368 kcal/236 g, P 8.5 g (OSEN/MT.co.kr đưa tin) | Tự tính (150 g cơm trộn dầu mè, trứng, xúc xích, chả cá, rau, rong biển), ra ~355 kcal | 3%. P lấy giữa (kimbap quán nhiều nhân hơn) | Trung bình |
| `tokbokki` | 1 phần 250 g | 370/9/72/5.5/2 | FNDDS 2708957 131/100 g (= 328) | Tự tính (150 g bánh gạo, sốt gochujang, đường, 30 g chả cá), ra ~163/100 g | 22%. Trung bình 147/100 g | Trung bình |
| `bibimbap` | 1 tô 440 g | 600/24.5/77/22/4 | Tự tính: 200 g cơm, 50 g bò bulgogi, 120 g rau namul trộn dầu mè, 1 trứng ốp, 20 g gochujang, 5 g dầu mè | FNDDS 2708950 76/100 g (bản Mỹ nhiều rau, ít cơm) = 335 | Lệch lớn. Chọn theo công thức kiểu quán Hàn ở VN. Thố đá (dolsot) nhiều dầu hơn | Thấp–trung bình |
| `ga-ran-han-sot` | /100 g (1 phần 220 g, 1 miếng 45 g) | 262/16.3/13.9/15.5/0.3 | Tự tính: 85% gà rán có da và bột (SR 170346 KFC đùi 269/18.9/8.5/17.7) + 15% sốt yangnyeom (~220 kcal/100 g) | FatSecret KR 갓양념치킨 (KFC Hàn) 261/100 g | 0.4% (kcal) | Trung bình |
| `ramen` | 1 tô 550 g (gồm nước) | 700/39/77/25/5 | FNDDS 2709158 ramen tô có thịt + trứng 127/7.1/14/4.6 | Ramen tonkotsu ở các tiệm Nhật thường công bố 600–900 kcal/tô | Trong khoảng tham chiếu. Uống hết nước dùng béo thì cao hơn | Trung bình |
| `udon-bo` | 1 tô 650 g (gồm nước) | 400/15.5/64/10/3.3 | Tự tính: MX 01039 udon luộc 95/2.6/21.6/0.4/1.3 × 250 g, 350 ml nước dashi-shoyu, 50 g bò om ngọt | (Chưa có nguồn món hoàn chỉnh thứ 2) | Ước lượng theo công thức | Trung bình |
| `gyoza` | 5 cái 125 g | 250/9.8/22.7/14/1.9 | MX 18002 ぎょうざ 209/6.9/22.3/11.3/1.5 | FNDDS 2708705 sủi cảo/potsticker chiên 192/8.8/14/11.1 | 9%. Trung bình | Cao |
| `ha-cao` | 1 cái 25 g | 45/2/5.5/1.7/0.2 | FatSecret (generic har gow) 216/100 g, 54 kcal/cái | FNDDS 2708708 sủi cảo hấp 113/100 g. Tự tính (vỏ bột mì tinh, nhân tôm, chút mỡ heo) ra ~210/100 g | Lệch lớn. Chọn khoảng 180/100 g | Thấp–trung bình |
| `xiu-mai-dimsum` | 1 viên 25 g | 48/2.3/4.9/2.3/0.4 | MX 18012 しゅうまい 191/9.1/19.5/9.2/1.7 | (Chỉ có 1 nguồn bảng chính thức) | 1 nguồn | Trung bình |
| `nuoc-ngot-khong-duong` | lon 320 ml | 1/0/0.3/0/0 | Nhãn Coca Zero / Pepsi không calo: 0 kcal | FNDDS 2710542 cola diet 2/100 g | Không đáng kể | Cao |
| `red-bull` | lon 250 ml | 110/0.5/27/0/0 | Red Bull chính thức (redbull.com, trang thành phần): 27 g đường/lon 250 ml | FNDDS 2710752 Red Bull 43/100 g = 108 | 2%. Lưu ý: Red Bull VN (lon vàng, công thức Thái) có thể khác, chưa thấy nhãn | Trung bình |
| `tra-xanh-dong-chai` | chai 455 ml | 91/0/22.8/0/0 | Long Châu dẫn nhãn Không Độ: ~20 kcal/100 ml | SR 174128 trà xanh đóng chai có đường 27/100 ml | 26%. Chọn số dẫn từ nhãn VN | Trung bình |
| `milo-hop` | hộp 180 ml | 110/2.8/17/3.5/0 | Long Châu dẫn nhà sản xuất: hộp 180 ml có 17 g C, 2.8 g P, 3.5 g F (tính ra ~111 kcal) | FNDDS sữa socola ít béo ~63–70/100 ml = 115–126 | Dưới 12%. Xơ chưa có nguồn nên để 0 | Trung bình |
| `yakult` | chai 65 ml | 50/0.8/12.4/0/0 | Yakult VN (Luật Minh Khuê dẫn lời công ty): 70–90 kcal/100 ml, P 1.2, C 19 | FatSecret 50 kcal/65 ml | Khớp | Trung bình |
| `vang-do` | ly 150 ml | 120/0.1/3/0/0 | SR 173190 85/100 g (cồn 10.6 g) | VN 14013 69 (9.5% cồn), MV 13.017 74 (12% vol) | Vang ~13% vol thường gặp: chọn khoảng 80/100 ml | Cao |
| `vang-trang` | ly 150 ml | 112/0.1/2/0/0 | SR 174837 82 | VN 14014 66, MV 13.032 69 | Trung bình ~75/100 ml | Cao |
| `soju` | chai 360 ml (~16%) | 325/0/1/0/0 | Tự tính: 360 ml × 16% × 0.789 = 45.4 g cồn × 7, ra 318 kcal, thêm chút đường | Geniet (KR, người dùng nhập) 400 kcal/chai, khả năng là soju 20% đời cũ | Lệch 23%. Chọn số tính theo độ cồn hiện hành. Soju trái cây (13%, có đường) khoảng 380 kcal/chai, chưa thêm | Trung bình |
| `ruou-manh` | ly 40 ml (40%) | 88/0/0/0/0 | SR 174815 rượu chưng cất 80 proof 231/100 g | VN 14012 rượu trắng 39%: 273, VN 14016 whisky 246; MX 16016 whisky 234 | ≤15%. Quy ~220/100 ml | Cao |
| `nuoc-ep-tao` | hộp 250 ml | 118/0.3/28.3/0.5/0.5 | FNDDS 2709320 48/100 g | SR 167771 46, MX 07149 43 | 10% | Cao |
| `nuoc-ep-dua-hau` | ly 300 ml, không đường | 96/1.8/22.7/0.5/1.2 | FNDDS 2709333 30 | VN 14047 34 | 12%. Trung bình. Quán thêm đường thì cộng ~40 kcal/10 g | Cao |
| `kombucha` | chai 330 ml | 50/0.3/12.5/0/0 | FNDDS 2710509 16/100 g | Nhãn GT's kombucha (Mỹ) ~13/100 ml, nhớ từ nhãn, chưa mở lại được | Hãng VN dao động theo lượng đường | Trung bình |
| `sua-hanh-nhan-kd` | /100 ml (hộp 180 ml) | 15/0.5/0.6/1.1/0.1 | FNDDS 2705409 15/0.55/0.34/1.22 | SR 174832 15/0.4/1.31/0.96, FD 1750338 14.6 | 0% | Cao |
| `latte` | /100 ml (Tall/M 350 ml = 150 kcal) | 43/2.8/4.4/1.6/0 | FNDDS 2710386 Coffee, Latte 43/2.81/4.35/1.61 | Starbucks Grande latte sữa 2%: 190 kcal, 13 g P, 7 g F (Livestrong dẫn bảng Starbucks). FNDDS × 470 ml = 202 | 6% | Cao |
| `cappuccino` | /100 ml | 27/1.7/2.8/1/0 | FNDDS 2710472 27/1.71/2.75/0.99 | Starbucks cappuccino ~ Grande 140 kcal (công bố của hãng, nhớ lại, chưa mở được) | ~5% | Trung bình |
| `ca-phe-muoi` | ly 250 ml | 210/4/18.5/13.5/0 | Tự tính: 25 g sữa đặc (VN 10047 328/7.9/54.4/8.7), 30 g kem whipping (USDA heavy cream 340/2.8/2.7/36), 20 ml sữa tươi, 3 g đường, cà phê phin | Long Châu: lượng sữa đặc 20–25 ml/ly; không có số kcal cả ly | Ước lượng theo công thức | Trung bình |
| `cacao-sua-da` | ly 300 ml | 190/7.6/27/7.3/3.5 | Tự tính: 10 g bột cacao (USDA không đường), 30 g sữa đặc, 100 ml sữa tươi | FNDDS 2705473 cacao sữa nguyên kem 91/100 g, ly 250 g = 228 | Trong khoảng | Trung bình |
| `matcha-latte` | ly M 350 ml | 210/7.5/31/6.8/1 | Tự tính: 3 g matcha (MX 16035), 200 ml sữa tươi, 20 g đường/siro | Starbucks Tall matcha latte sữa 2% ~190 kcal (nhớ lại, chưa mở được) | ~10% | Trung bình |
| `sinh-to-xoai` | ly 335 g | 240/4.8/48.5/4.4/2.4 | Tự tính: xoài 150 g (USDA 60/100 g), 25 g sữa đặc, 50 ml sữa tươi, 10 g đường, đá | FNDDS 2705514 sinh tố trái cây có sữa 66/100 g = 221 | 8% | Trung bình |
| `nuoc-chanh` | ly 350 ml | 105/0.1/27/0.1/0.1 | Tự tính: 30 ml nước cốt chanh, 25 g đường | FNDDS 2710570 lemonade 46/100 g = 161 (Mỹ ngọt hơn) | Chọn theo công thức quán VN | Trung bình |
| `tran-chau-den` | 1 phần topping 60 g | 85/0/21/0/0.1 | MX 02057 trân châu luộc 61/100 g (15.4 g C) | Cộng 12 g siro đường đen ngâm (ước lượng) | VN 2026002 "trân châu sắn luộc" 344 là số của trân châu khô, không dùng | Trung bình |

### Món đã cân nhắc nhưng bỏ qua (chưa đủ dữ liệu)
- **Jollibee** (gà giòn Chickenjoy, mì Ý Jolly): FatSecret có 340 và 610 kcal cho "spaghetti", lệch quá xa, hãng chưa công bố. Chickenjoy dùng tạm món `ga-ran`.
- **KFC VN** (gà giòn cay, gà không xương, cơm gà, khoai nghiền) và **Lotteria**: hãng không công bố dinh dưỡng.
- **Highlands** (phin sữa đá size M/L, Freeze trà xanh, bánh mì que), **Phúc Long**, **The Coffee House**, **Gong Cha / Tocotoco** (trà sữa theo % đường): không tìm được số chính thức. Dùng tạm `cf-sua-da`, `tra-sua`, `tra-dao` và `latte`.
- **Starbucks Frappuccino**: nguồn phụ mâu thuẫn (370–510 kcal/Grande), trang hãng chặn tải.
- **Sting** (nguồn VN ghi 240 kcal/330 ml, Wikipedia ghi 28 kcal/100 ml) và **Number 1**: không có nhãn VN đáng tin.
- **Bia không cồn, bia hơi, soju trái cây, rượu nếp**: chưa làm.

### Món cũ nghi sai (không sửa, chỉ báo)
- `nuoc-mia` (300 ml: 180 kcal, 45 g C, tức 60/100 ml): Bảng VN 14040 ghi 79.6 kcal, 20.2 g C/100 g, ra 239 kcal/300 ml (lệch 25%). Cần nguồn thứ 2 trước khi sửa.
- `khoai-tay-chien` (110 g, 320 kcal = 291/100 g): SR 170721 McDonald's 323/100 g, ra 355 kcal (lệch 10%). Nên kiểm lại.
- `ga-ran` (246/100 g): SR KFC (ức/đùi giòn, có da và bột) 268–274/100 g, thấp hơn khoảng 9%.
- `cf-sua-da` alias `bac xiu` trùng với món `bac-xiu`: nên bỏ alias này.

# Nhóm món Việt: bún / phở / mì / hủ tiếu / cháo / xôi / bánh / ăn vặt

File code: `src/data/foods/vn-noodle.ts` (mảng `VN_NOODLE_FOODS`).

## 2026-10-17 — đợt 1: thêm 60 món

### Cách tính

- Món Việt không có bộ số liệu đo sẵn → **tính từ công thức**: gram nguyên liệu thực tế cho 1 người lớn × per100 của nguyên liệu, cộng dầu, mỡ hành, đường, nước chấm, mỡ trong nước dùng. Sau đó so với nguồn tham khảo (bài web dinh dưỡng VN: Long Châu, Pharmacity, Vinmec, Điện Máy Xanh, FPT Shop; FatSecret). Các bài web này chỉ là ước lượng thứ cấp, không có bảng gốc → độ tin cậy cao nhất là "trung bình", trừ món ghép trực tiếp từ nguyên liệu đã có trong bảng.
- Thịt/cá trong công thức dùng giá trị **đã chín** của bảng hiện có (`ga-luoc`, `bo-nam-chin`, `bo-gau-chin`, `heo-thang-chin`, `heo-nac-dam-chin`, `mong-gio-chin`, `cha-lua`, `cha-ca-chien`, `tom-chin`, `muc-luoc-chin`, `oc-luoc-chin`, `cua-hap-chin`, `luon-chin`, `lap-xuong-chin`, `trung-cut`…). Riêng thịt tái/thịt xào tính theo gram **sống** của `bo-nac-song` (người bán cân sống).
- Atwater (4P + 4(C−xơ) + 2xơ + 9F): toàn bộ 60 món lệch < 6% (kiểm bằng script).
- Script tính đặt ở thư mục tạm (không đưa vào repo).

### Per100 nguyên liệu dùng thêm (ngoài bảng hiện có)

| Nguyên liệu | kcal/P/C/F/xơ per100 | Nguồn |
|---|---|---|
| Mì trứng khô | 384/14.2/71.3/4.4/3.3 | USDA SR (egg noodles, dry) |
| Miến khô | 342/0.4/84/0.1/1.0 | Trung bình USDA cellophane noodles 351 và miến dong theo bảng VN 332 (trích thứ cấp) |
| Bánh đa đỏ khô | 364/6/80.2/0.6/1.6 | USDA rice noodles, dry (thay thế gần nhất) |
| Sợi bánh canh (đã luộc) | 146/1.0/35/0.2/0.5 | kcal theo Long Châu "100g bánh canh ≈ 145 kcal"; macro ước lượng theo bột gạo + bột năng |
| Bột gạo / bột nếp / bột năng | 366/6/80.1/1.4/2.4 · 370/6.8/81.7/0.6/2.8 · 358/0.2/88.7/0/0.9 | USDA SR |
| Gạo tẻ / gạo nếp (khô) | 344/7.9/75.9/1/0.6 · 344/8.6/74.5/1.5/1.5 | Bảng VN (trích thứ cấp: Long Châu/hellobacsi), xơ theo USDA |
| Vịt luộc/quay có da (ăn được) | 337/19/0/28.4/0 | USDA SR 172411 (duck, meat+skin, roasted) |
| Thịt heo xay sống | 263/16.9/0/21.2/0 | USDA SR (pork, ground, raw) |
| Tiết heo luộc | 44/10.7/0.4/0.1/0 | Bảng VN (trích thứ cấp, Long Châu ghi 35–40 kcal) |
| Bò viên | 190/15/8/11/0 | **Ước lượng**: FPT Shop (P 20–25, C 10–15, F 10–15) và fitatu "bò viên gân" 125 kcal → chọn mức giữa |
| Riêu cua đồng | 120/12/2/7/0 | **Ước lượng** (cua đồng xay + trứng) |
| Tôm khô | 347/75.6/2.5/3.8/0 | Bảng VN (trích thứ cấp) |
| Khô bò | 410/33.2/11/25.6/1.8 | USDA beef jerky |
| Vỏ hoành thánh | 291/9.8/57.9/1.5/1.8 | USDA wonton wrappers |
| Đậu xanh / đậu đen / đậu đỏ khô | 347/23.9/62.6/1.2/16.3 · 341/21.6/62.4/1.4/15.5 · 329/19.9/62.9/0.5/12.7 | USDA SR |
| Nước cốt dừa | 230/2.3/5.5/23.8/2.2 | USDA SR 12117 |
| Sữa đặc | 321/7.9/54.4/8.7/0 | USDA SR 01095 |
| Dừa nạo / mè | 354/3.3/15.2/33.5/9 · 573/17.7/23.4/49.7/11.8 | USDA SR |
| Mít | 95/1.7/23.3/0.6/1.5 | USDA SR |
| Củ sắn (jicama) | 38/0.7/8.8/0.1/4.9 | USDA SR |
| Măng luộc | 12/1.5/1.5/0.2/1.0 | USDA bamboo shoots, boiled |
| Mộc nhĩ khô | 284/9.3/73/0.7/70 | USDA cloud ear, dried |
| Mayonnaise / bơ thực vật | 680/1/0.6/75/0 · 717/0.2/0.7/80.7/0 | USDA |
| Hành phi | 552/5/45/40/4 | Ước lượng (hành + dầu chiên) |
| Mỡ hành | 815/0.2/1.5/90/0.3 | 90% dầu + hành lá |
| Nước mắm pha | 68/1.5/15.5/0/0 | Tự tính: nước mắm + ~15% đường + chanh + nước |
| Nước dùng (per100) | phở bò 20/1.2/1/1.2 · xương heo 22/1.2/1.2/1.4 · gà 13/1/0.5/0.8 · cá 16/1.2/1/0.8 · vịt 25/1.2/1/1.8 · bún mắm 30/2/2.5/1.3 · bánh canh sệt 30/1.2/4.5/0.9 · bò kho 70/1/5/5.3 | **Ước lượng** theo váng mỡ thực tế ở quán (3–6 g mỡ/tô) |
| Nem nướng (chín) | 290/19/10/19/0 | Tự tính: nạc 70 + mỡ 15 + đường 5 + bột năng 3 (sống 254 kcal/100g), hao ~15% khi nướng, mất ít mỡ |

### Món đã thêm (1 phần cho 1 người lớn)

Độ tin cậy: **Cao** = cộng trực tiếp nguyên liệu đã có nguồn; **TB** = công thức + ≥1 nguồn tham khảo khớp ±15%; **Thấp** = chỉ công thức hoặc nguồn lệch.

| id · tên | Phần (g) | kcal/P/C/F/xơ | Công thức chính | Nguồn tham khảo · lệch | Tin cậy |
|---|---|---|---|---|---|
| `pho-bo-dac-biet` Phở bò đặc biệt | 665 | 589/40.8/72/15.2/0.9 | bánh phở 200, tái 40 (sống), nạm 30, gầu 25, bò viên 30, nước 330 | Long Châu: phở tái 431, chín 456 (tô thường) → tô đặc biệt to hơn ~30% | TB |
| `pho-xao` Phở xào bò | 410 | 584/26.3/78.9/18.7/2.4 | bánh phở 220, bò 80 sống, rau 80, dầu 14, dầu hào 12 | — | Thấp |
| `pho-cuon` Phở cuốn | 55/cuốn | 81/4.4/10.2/2.5/0.2 | lá phở 28, bò xào 12, rau, nước chấm 6 | — | Thấp |
| `pho-ga-tron` Phở gà trộn | 370 | 583/29/80.8/16.2/1.9 | bánh phở 220, gà xé 70 (½ ức, ½ có da), nước sốt 40, đậu phộng 8, mỡ hành 5 | — | Thấp |
| `bun-mam` Bún mắm | 690 | 545/41.8/62.3/14.2/2.6 | bún 200, ba chỉ 30, tôm 40, mực 30, cá lóc 40, cà tím 40, nước 280 | Long Châu/Pharmacity 480 · +14% (tô của mình nhiều hải sản) | TB |
| `bun-ca` Bún cá | 650 | 420/22.7/59/10.6/1.8 | bún 200, cá chiên 60, chả cá 30, cà chua, nước 300 | Pharmacity 450 · −7% | TB |
| `bun-mang-vit` Bún măng vịt | 700 | 604/24.9/58.5/29.9/2.1 | bún 200, vịt có da 85 (phần ăn được), măng 80, nước vịt 300, nước mắm gừng 15 | Long Châu 450–550 (tô đặc biệt 600–650) · +10% so với mức trên | TB (mỡ vịt quyết định) |
| `bun-moc` Bún mọc | 610 | 414/22.8/56.6/11.1/1.3 | bún 200, mọc + chả lụa 80, nấm 20, nước xương 300 | — | Thấp |
| `bun-cha-ca` Bún chả cá | 650 | 412/15.6/62.8/11.2/1.9 | bún 200, chả cá 80, cà chua, thơm, nước cá 300 | gần bún cá 450 (Pharmacity) · −8% | TB |
| `bun-oc` Bún ốc | 670 | 430/25.6/61.4/9.9/3.2 | bún 200, ốc 60, đậu chiên 30, cà chua 50, nước 300 | — (bún riêu ốc 531 là món khác) | Thấp |
| `bun-thang` Bún thang | 535 | 330/24.2/40.8/7.7/0.9 | bún 150, ức gà 35, chả lụa 20, trứng tráng 15, tôm khô 3, nước gà 300 | — | Thấp |
| `hu-tieu-kho` Hủ tiếu khô (kèm chén nước lèo) | 550 | 547/33.1/72.7/14/1.3 | hủ tiếu 200, nạc 40, tôm 30, gan 15, trứng cút, sốt 17, mỡ tỏi 8, nước lèo 200 | Pharmacity Nam Vang 400 / 650 (không rõ loại) · nằm trong khoảng | TB |
| `hu-tieu-go` Hủ tiếu gõ | 435 | 366/18.9/50.5/10.3/1.2 | hủ tiếu 140, nạc 30, gan 10, giá 30, mỡ hành 5, nước 220 | — | Thấp |
| `hu-tieu-bo-kho` Hủ tiếu bò kho | 540 | 626/36.4/72.9/21.1/3.1 | hủ tiếu 180, nạm 50, gầu 40, cà rốt 40, nước bò kho 220 | — | Thấp |
| `mi-hoanh-thanh` Mì hoành thánh | 550 | 520/29.8/59.5/17.6/3.1 | mì trứng 150, 5 hoành thánh (vỏ 30, nhân heo+tôm 45), nạc 30, cải 40, nước 250 | Long Châu "tô hoành thánh 300–400" (không mì) → mình có thêm 150 g mì (~207 kcal) nên khớp | TB |
| `mi-vit-tiem` Mì vịt tiềm | 605 | 710/33/53.7/39.7/3.2 | mì trứng 180, đùi vịt 110 (ăn được, có da), cải 60, nước 250 | — | Thấp |
| `mi-goi-trung` Mì gói nấu trứng | 455 | 421/13.5/46.6/19.6/2 | 1 gói 75 g (`mi-goi`) + 1 trứng 50 g + rau 30 | cộng trực tiếp 2 món có sẵn | Cao |
| `banh-canh-cua` Bánh canh cua | 645 | 578/28.4/85.5/13.7/1 | sợi 200, cua 30, chả 30, tôm 30, huyết 30, trứng cút 2, nước sệt 300 | Long Châu: sợi 145/100g; "bánh canh ghẹ 379" không rõ khẩu phần | Thấp |
| `banh-canh-gio-heo` Bánh canh giò heo | 605 | 597/27.1/75.3/20.4/1.1 | sợi 200, giò heo 80 (ăn được), chả lụa 20, nước 300 | — | Thấp |
| `banh-canh-cha-ca` Bánh canh chả cá | 590 | 467/13.7/77.4/11.3/1.1 | sợi 200, chả cá 80, nước cá 300 | — | Thấp |
| `mien-luon` Miến lươn | 580 | 427/16.6/49.1/18.3/1.4 | miến khô 50, lươn 50 + dầu chiên 8, giá 30, nước 300 | — | Thấp |
| `banh-da-cua` Bánh đa cua | 635 | 458/17.5/63.2/14.1/1.8 | bánh đa khô 70, riêu 50, chả cá 30, rau 50, mỡ hành 5, nước 300 | Pharmacity/Long Châu 227–350 (cơ bản), 500–620 (đủ topping) · nằm giữa | TB |
| `bun-bo-xao` Bún bò xào (Nam Bộ) | 445 | 543/28.4/62.9/20.7/3.4 | bún 180, bò 90 sống, dầu 8, hành phi 5, đậu phộng 12, rau, đồ chua, nước mắm 50 | — | Thấp |
| `bun-thit-nuong-cha-gio` | 455 | 724/32/71.5/35/3.1 | bún 180, thịt nướng 80, 1 chả giò 45, rau, đậu phộng 8, mỡ hành 8, nước mắm 50 | = bản tính lại bún thịt nướng (603) + 1 chả giò | TB |
| `banh-hoi-thit-nuong` | 375 | 532/26.3/54.1/23.7/2.2 | bánh hỏi 150, mỡ hành 8, thịt nướng 80, rau, nước mắm 50 | — | Thấp |
| `bun-xao` Bún xào | 430 | 493/19.2/70/15.4/3.1 | bún 250, bò 60 sống, rau 100, dầu 12 | — | Thấp |
| `mi-xao-gion` Mì xào giòn hải sản | 375 | 609/31.2/62.9/26.1/4.5 | mì khô 70 + dầu thấm 18, tôm 40, mực 40, rau 120, sốt sệt 85 | — | Thấp |
| `nui-xao-bo` Nui xào bò | 355 | 577/28.6/75.6/17.4/4.7 | nui luộc 220, bò 70 sống, dầu 12, hành tây/cà 40, tương cà 15 | — | Thấp |
| `cao-lau` Cao lầu | 355 | 501/21.2/72.3/14.7/1.9 | sợi 180, xá xíu 50, rau 70, bánh đa giòn 6, nước xíu 40 | — | Thấp |
| `chao-vit` Cháo vịt | 460 | 418/18.7/32.8/23.1/0.3 | gạo 40, vịt có da 80, nước mắm gừng 15 | — | Thấp |
| `yen-mach-sua` Yến mạch nấu sữa tươi không đường | 240 | 278/13/36/9.4/4.2 | yến mạch 40 + sữa tươi KĐ 200 | cộng trực tiếp `yen-mach` + `sua-tuoi-kd` | Cao |
| `xoi-xeo` Xôi xéo | 235 | 458/10.2/79.1/10.9/4.1 | xôi 180, đậu xanh khô 15, hành phi 6, mỡ hành 8 | — | Thấp |
| `xoi-dau-xanh` Xôi đậu xanh | 215 | 423/10.4/77.8/8.2/5.5 | xôi 160, đậu xanh khô 15, dừa nạo 15, đường 6, mè 4 | — | Thấp |
| `xoi-lap-xuong` Xôi lạp xưởng | 215 | 473/12.2/68.6/16.1/1.6 | xôi 180, lạp xưởng 30, hành phi 3, mỡ hành 4 | — | TB (nguyên liệu có sẵn) |
| `xoi-bap` Xôi bắp | 235 | 430/10.8/74.3/11.2/6.2 | xôi 120, bắp 60, đậu xanh khô 15, dừa 10, muối mè đường 8, mỡ hành 5 | — | Thấp |
| `banh-uot` Bánh ướt chả lụa | 350 | 386/14.6/58.5/10.4/2 | bánh ướt 200, chả lụa 50, hành phi, mỡ hành, giá, nước mắm 40 | gần `banh-cuon` 300 g = 400 | TB |
| `banh-beo` Bánh bèo (~10 chén) | 245 | 313/11.2/51.8/6.4/1 | bánh 200, tôm chấy 10, mỡ hành 6, nước mắm 30 | Long Châu 30–50 kcal/chén nhỏ → 300–500/10 chén · khớp | TB |
| `banh-bot-loc` Bánh bột lọc (10 cái) | 255 | 450/11.4/66.5/15.2/0.6 | bột năng 70, tôm 30, ba chỉ 30, mỡ hành 6, nước mắm 30 | Long Châu 420–480/đĩa 10 cái · khớp | TB |
| `banh-khot` Bánh khọt (8 cái + rau) | 325 | 514/14.8/57.9/25.3/2.8 | bột gạo 60, nước cốt dừa 25, tôm 45, dầu thấm 18, rau 65, nước mắm 40 | — | Thấp |
| `banh-can` Bánh căn (6 cái + nước chấm) | 300 | 465/15.3/66.2/14.6/1.7 | bột gạo 70, trứng cút 30, mực 30, dầu 4, mỡ hành 6, nước chấm 60 | — | Thấp |
| `banh-bot-chien` Bột chiên trứng | 285 | 485/10/66.2/20.3/1.2 | bột hấp 180, 1 trứng, dầu 15, nước tương 20, đu đủ chua 20 | — | Thấp |
| `banh-gio` Bánh giò | 160 | 216/7.8/21.2/10.9/1.9 | bột gạo 20, bột năng 4, dầu 3, heo xay 30, mộc nhĩ 2, trứng cút 10, nước | Long Châu "400–445/100g" là số bột khô → loại | Thấp |
| `nem-nuong` Nem nướng cuốn (4 xiên) | 365 | 670/26.3/75.5/29.3/2.9 | nem 100, bánh tráng 47 (gồm ram chiên + dầu 6), rau 100, bún 50, nước chấm nem 60 | — | Thấp |
| `banh-trang-cuon-thit-heo` | 320 | 521/21.6/52.8/24.1/2.2 | bánh tráng 40, ba chỉ luộc 80, rau 100, bún 60, mắm nêm 40 | — | Thấp |
| `bo-bia` Bò bía (1 cuốn) | 70 | 143/5.8/13.5/7.5/2 | bánh tráng 8, lạp xưởng 8, trứng 7, củ sắn 25, tôm khô 2, tương 8, đậu phộng 3 | — | Thấp |
| `banh-trang-tron` (1 bịch) | 165 | 457/17/55.6/19.4/2.4 | bánh tráng 45, xoài 30, trứng cút 3, khô bò 12, tôm khô 5, đậu phộng 10, hành phi 4, sa tế/dầu 6, sốt 20 | Vinmec ~600/200 g (3.0 kcal/g) vs mình 2.77 kcal/g · −8%; FPT 400–600/200–250 g | TB |
| `banh-trang-nuong` (trứng gà, xúc xích) | 105 | 289/11.4/17.5/19.1/0.3 | bánh tráng 20, trứng 50, mỡ hành 6, xúc xích 15, tôm khô 3, mayo 8 | Điện Máy Xanh 300–360 · −4% so với mức dưới | TB |
| `bap-xao` (1 ly) | 145 | 220/8/28.9/10.2/2.9 | bắp 120, bơ 10, tôm khô 5, đường 3 | — | Thấp |
| `banh-cam` Bánh cam / bánh rán | 55 | 201/3.4/31/7.1/1.9 | bột nếp 25, nhân đậu xanh-đường 13, mè 2, dầu thấm 6 | — | Thấp |
| `banh-mi-que` Bánh mì que pate | 40 | 102/3.5/13/4.1/0.6 | bánh mì 25, pate gan 10 (USDA liver pâté 319/14.2/1.5/28), bơ 1, tương ớt 3 | — | TB |
| `che-dau-xanh` (1 ly) | 300 | 306/8.9/55.9/6.4/6.3 | đậu xanh khô 35, đường 30, nước cốt dừa 25, bột năng 3 | — | Thấp |
| `che-dau-den` (1 ly) | 300 | 289/8/54.9/5.3/5.9 | đậu đen khô 35, đường 32, nước cốt dừa 20 | Long Châu/mytour "419/100g" = đậu khô → loại | Thấp |
| `che-thai` (1 ly) | 340 | 313/5.5/53.5/10.3/2 | trái cây 80, thạch 50, sữa đặc 25, nước cốt dừa 25, sữa tươi 50, đường 10, đá 100 | — | Thấp |
| `che-ba-mau` (1 ly) | 330 | 297/7.3/53/7.4/5.3 | đậu đỏ 15 + đậu xanh 15 (khô), thạch 50, đường 25, nước cốt dừa 30, đá | — | Thấp |
| `che-troi-nuoc` (3 viên) | 230 | 362/7.3/72.5/5/4.3 | bột nếp 45, đậu xanh 15, nước đường gừng (đường 25), nước cốt dừa 15, mè 2 | — | Thấp |
| `tau-hu-nuoc-duong` (1 chén) | 300 | 208/13/24.6/7.3/0.9 | tàu hũ non 220 + nước đường gừng 80 (đường 22) | — | TB (nguyên liệu có sẵn) |
| `sua-chua-nep-cam` (1 ly) | 185 | 240/6.1/44.8/4.2/1.1 | sữa chua có đường 100, nếp cẩm nấu 70, đường 6, sữa đặc 10 | Long Châu ~100 kcal/hũ (sữa chua không đường + ít nếp) → bản quán ngọt hơn nhiều | Thấp |
| `banh-chung` Bánh chưng (per100) | 125/miếng | 181/4.3/31.6/4.2/1.5 | — | Bảng VN qua Long Châu + hellobacsi/FPT (181/4.3/31.6/4.2); xơ 0.6 theo bài → tự nâng 1.5 vì có đậu xanh + nếp (USDA) | TB |
| `banh-tet` Bánh tét (per100) | 100/khoanh | 215/7.5/35/5.3/2 | mẻ 1.3 kg: nếp khô 500, đậu xanh 150, ba chỉ 150, nước cốt dừa 50 → 222/100g; làm tròn xuống theo độ ẩm | Các bài web "400–440/100g" nghi tính theo nguyên liệu khô → loại; bánh chưng (đo) 181 | Thấp |
| `nem-chua` Nem chua (per100) | 25/cái | 151/21.8/3.6/5.5/0 | — | Long Châu 137 kcal, F 3.7 · FatSecret (Tang Frères) 165/22/2.9/7.2 · hai nguồn lệch 19% → lấy trung bình | TB |

URL nguồn tham khảo:
- Long Châu: phở bò `nhathuoclongchau.com.vn/bai-viet/mot-to-pho-bo-bao-nhieu-calo-cach-an-pho-khong-so-beo-70380.html`; bún mắm `.../mot-to-bun-mam-bao-nhieu-calo.html`; bún măng vịt `.../bun-mang-vit-bao-nhieu-calo-va-cach-an-khong-lo-tang-can.html`; bánh canh `.../banh-canh-bao-nhieu-calo-an-nhieu-co-beo-khong-70511.html`; bánh đa cua `.../banh-da-cua-bao-nhieu-calo-an-banh-da-cua-co-beo-khong.html`; bánh bột lọc `.../banh-bot-loc-bao-nhieu-calo-co-phu-hop-cho-nguoi-giam-can-khong-69239.html`; bánh bèo `.../mot-phan-banh-beo-bao-nhieu-calo.html`; bánh giò `.../ban-da-biet-banh-gio-bao-nhieu-calo-68681.html`; bánh chưng `.../giai-dap-thac-mac-banh-chung-bao-nhieu-calo-66585.html`; nem chua `.../an-nem-chua-co-beo-khong-co-tot-khong-66563.html`; hoành thánh `.../1-to-hoanh-thanh-bao-nhieu-calo-an-nhieu-co-tang-can-khong.html`; sữa chua nếp cẩm `.../1-hu-sua-chua-nep-cam-bao-nhieu-calo-66758.html`; tiết luộc `.../tiet-luoc-bao-nhieu-calo-cach-kiem-soat-luong-calo-khi-an-tiet-luoc.html`
- Pharmacity: bún (bảng nhiều loại bún) `pharmacity.vn/bun-bao-nhieu-calo.htm`; hủ tiếu `pharmacity.vn/hu-tieu-mon-an-ngon-hap-dan-co-bao-nhieu-calo.htm`; bánh đa cua `pharmacity.vn/banh-da-cua-dac-san-hai-phong-thom-ngon-va-bao-nhieu-calo.htm`
- Vinmec bánh tráng trộn `vinmec.com/vie/bai-viet/banh-trang-tron-chua-bao-nhieu-calo-vi`; FPT Shop bánh tráng trộn `fptshop.com.vn/tin-tuc/dien-may/banh-trang-tron-bao-nhieu-calo-189706`; Điện Máy Xanh bánh tráng `dienmayxanh.com/vao-bep/banh-trang-la-gi-bao-nhieu-calo-an-banh-trang-co-map-va-noi-09400`
- FPT Shop bò viên `fptshop.com.vn/tin-tuc/dien-may/bo-vien-bao-nhieu-calo-169636`; fitatu bò viên gân `fitatu.com/catalog/en/bo-vien-gan-beef-meatballs-with-tendon--147984801`
- FatSecret nem chua Tang Frères `fatsecret.fr/calories-nutrition/tang-fr%C3%A8res/nem-chua/100g`
- USDA FoodData Central (SR Legacy) cho nguyên liệu: `fdc.nal.usda.gov`

### Món bỏ / trùng

- `chao-trang`, `chao-suon`, `sup-cua`: đã có trong `vn-rice.ts` (agent nhóm cơm thêm cùng lúc) → bỏ bản của nhóm này để không trùng id. Đối chiếu: cháo sườn của vn-rice 400 g = 253 kcal (mình tính 430 g = 264), súp cua 250 g = 116 (mình 315 g = 167) — cùng mức kcal/g.
- Không thêm bản riêng "phở bò tái / chín / tái nạm": `pho-bo` đã có alias `pho tai`, `pho chin`, `pho nam`; chỉ thêm tô đặc biệt.
- Bì cuốn, quẩy, mì Quảng gà, bánh canh ghẹ: chưa đủ số liệu nguyên liệu (bì heo luộc, quẩy) → để lần sau.

### Món cũ nghi sai (chỉ ghi nhận, chưa sửa — bảng gốc `foods.vn.ts`)

- `hu-tieu` 500 g = 450/25/60/12: tính lại cùng công thức (hủ tiếu 200, nạc 40, tôm 30, gan 15, trứng cút, nước lèo 350) ra ~527/34/70/12 → nghi **thấp ~15%** kcal, thấp protein và carbs.
- `pho-bo` 500 g = 450/30/55/12: 200 g bánh phở đã cho 64 g carbs → C 55 thấp; tính lại ~480/31/68/9 (lệch kcal 6%, chưa tới ngưỡng sửa nhưng carbs lệch ~20%).
- `bun-thit-nuong` 400 g = 550: tính lại 412 g ~603 (+9%).
- `bun-rieu` 500 g = 420: Long Châu 465, mytour 530 (MyFitnessPal P 34.6/F 19) → nghi thấp 10–25%.
- `xoi-man` có alias `xoi xeo` nhưng xôi xéo là món khác (đã thêm `xoi-xeo` riêng; tên trùng khớp nên AI/tìm kiếm vẫn ra đúng). Nên bỏ alias `xoi xeo` khỏi `xoi-man`.
- `vit-co-da` 400/25.4/0/32.8 cao hơn USDA SR 172411 (337/19/0/28.4) → nên kiểm lại ở nhóm thịt.

### Lần sau

- Bì cuốn / cơm bì, quẩy (dầu cháo quẩy), mì Quảng gà / tôm thịt riêng, bún riêu cua ốc, bún bò Huế đặc biệt, bánh canh ghẹ, cháo ếch / cháo hàu, bánh đúc, bánh bao trứng cút, chè chuối / chè bưởi.
- Tìm nguồn đo thật (bảng VN gốc) cho bò viên, riêu cua, sợi bánh canh, bánh tét.

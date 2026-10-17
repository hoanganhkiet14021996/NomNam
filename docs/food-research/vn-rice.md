# Nhóm món Việt: cơm quán, món mặn, canh, xào (`src/data/foods/vn-rice.ts`)

## 2026-10-17: Đợt 1, thêm 60 món

### Phương pháp
- Món quán, món nhà không có số liệu chuẩn nên **tính từ công thức**: gram nguyên liệu SỐNG cho 1 người × per100 của nguyên liệu, rồi tự ước lượng khối lượng sau nấu (mất nước). Kcal/P/C/F/xơ là TỔNG của cả phần.
- Nguồn nguyên liệu: USDA FoodData Central SR Legacy (tải CSV `FoodData_Central_sr_legacy_food_csv_2018-04.zip`) và FNDDS 2024-10 (`FoodData_Central_survey_food_csv_2024-10-31.zip`). Một số nguyên liệu lấy số từ bảng gốc `foods.vn.ts`. URL một bản ghi: `https://fdc.nal.usda.gov/fdc-app.html#/food-details/<fdcId>/nutrients`.
- Nguồn thứ 2 để đối chiếu: món tương đương trong FNDDS (món hỗn hợp kiểu Mỹ/Hoa) hoặc thông tin dinh dưỡng của công thức trên web. Món VN gần như không có nguồn chuẩn cho cả phần, nên độ tin cậy cao nhất đạt được là "trung bình".
- Atwater: mọi món lệch trong ±7% (kiểm bằng script).
- Giả định chung: 1 đĩa cơm = 200 g cơm trắng (cơm chiên 220 g); dầu thấm khi xào 6–10 g/phần, khi chiên 12–15 g; món kho có 6–10 g đường và 10–12 g nước mắm; canh 1 tô 300 g (nước dùng xương loãng, SR 174536 6 kcal/100g; riêng canh sườn dùng nước hầm SR 172884).

### Nguyên liệu dùng (per100: kcal/P/C/F/xơ)
| Nguyên liệu | Số liệu | Nguồn |
|---|---|---|
| Cơm trắng | 130/2.7/28.2/0.3/0.4 | SR 168878 |
| Dầu ăn | 884/0/0/100/0 | bảng gốc |
| Đường | 387/0/100/0/0 | SR 169655 |
| Nước mắm | 35/5.1/3.6/0/0 | SR 174531 |
| Xì dầu | 53/8.1/4.9/0.6/0.8 | SR 174277 |
| Dầu hào | 51/1.4/10.9/0.3/0.3 | SR 174529 |
| Bò thăn sống | 160/21.4/0/7.6/0 | trung bình SR 169551 (nạc + mỡ, 189) và SR 174055 (nạc, 131) |
| Bò kho (bắp + nạm) sống | 184/20.6/0/10.7/0 | trung bình SR 169441 (bắp) và SR 168670 (lõi vai) |
| Thịt heo bằm sống | 205/18.7/0/13.9/0 | trung bình SR 167902 (heo xay) và `heo-nac-song` |
| Ba chỉ sống | 356/16/0/32.6/0 | bảng gốc `ba-chi` |
| Sườn non sống (phần ăn được) | 277/15.5/0/23.4/0 | SR 167853 |
| Đùi gà có da sống / cánh gà sống | 221/16.5/0.3/16.6 · 191/17.5/0/12.9 | SR 172385 · SR 172390 |
| Ức gà sống | 120/22.5/0/2.6 | SR 171077 |
| Tôm / mực / rô phi sống | 85/20.1/0/0.5 · 92/15.6/3.1/1.4 · 96/20.1/0/1.7 | SR 175179 · 174223 · 175176 |
| Cá nục sống | 111/20.2/0/3.3 | Bảng VN (trích thứ cấp, chưa xác minh bảng gốc) |
| Trứng gà | 143/12.6/0.7/9.5 | SR 171287 |
| Lòng heo luộc | 233/12.5/0/20.3 | SR 167856 |
| Heo quay (đã chín) | 440/22/0/39 | ước tính giữa ba chỉ quay Hàn Quốc 493/21.9/41.1 (J Anim Sci Technol 2015, bảng 2) và `ba-chi-nuong` 385 |
| Xá xíu (đã chín) | 250/21/8/14.8 | FatSecret "Char Siu" 235/22/1.5/15, cộng thêm lớp đường/mật ong |
| Vịt quay, đùi gà nướng, nạc dăm nướng, lạp xưởng | xem bảng gốc | `vit-co-da`, `dui-ga`, `heo-nac-dam-chin`, `lap-xuong-chin` |
| Rau: rau ngót | 35/5.3/3.4/0/2.5 | Bảng VN (thứ cấp) |
| Rau khác | | SR: mồng tơi 170474, bí đao 170069, bầu 169232, cải xanh 169256, khổ qua 168393, giá 169138, súp lơ 169986, su su 170402, cà tím 169228, mướp 168414, bắp 169998, khoai mỡ 170071, dưa cải chua 169279, nấm 169251, hẹ 169994, hành tây 170000 |
| Nước cốt dừa / nước dừa | 197/2/2.8/21.3 · 18/0.2/4.2/0 | SR 170173 · SR 174831 |
| Lá lốt | 19/3.2/2.3/0.4/2.7 | dùng tạm số lá bí SR 169272/168447 (USDA không có lá lốt; chỉ 15 g mỗi phần) |

### Món đã thêm (cả phần)
Độ tin cậy: **TB** = tính từ công thức, khớp nguồn đối chiếu trong ±15%; **TB-** = tính từ công thức, nguồn đối chiếu yếu hoặc lệch; **Thấp** = có nguyên liệu chính phải ước lượng.

| id · Tên | Phần (g) | kcal/P/C/F/xơ | Công thức chính (sống) | Đối chiếu | Tin cậy |
|---|---|---|---|---|---|
| com-bo-luc-lac · Cơm bò lúc lắc | 450 | 670/39.7/71/24.3/3 | cơm 200, bò 150, dầu 12, dầu hào 10, xì dầu 5, đường 4, hành tây + ớt chuông + cà chua 110, xà lách 20 | Phần bò của các công thức trên web: 376–654 kcal (Posh Journal, Tasty, Rasa Malaysia; Wikipedia "Shaking beef"); phần bò của mình 407 | TB |
| com-rang-dua-bo · Cơm rang dưa bò | 370 | 583/24.4/70.4/21.9/3.5 | cơm 220, bò 80, dưa cải 80, dầu 15 | FNDDS 2708955 cơm chiên bò 178/100g, ra 659 kcal (ít dầu hơn, nhiều cơm hơn) | TB |
| com-chien-hai-san · Cơm chiên hải sản | 380 | 597/30.9/67.9/21.4/1.8 | cơm 220, tôm 50, mực 50, trứng 50, cà rốt 25, dầu 15 | FNDDS 2708956 cơm chiên tôm 166/100g, ra 631 kcal (-5%) | TB |
| com-heo-quay · Cơm heo quay | 370 | 732/27.9/64.2/39.7/1.4 | cơm 200, heo quay 100, dưa leo, đồ chua, nước mắm pha 20 | Không có nguồn cho cả đĩa | Thấp (số heo quay lấy giữa 2 nguồn lệch 25%) |
| com-xa-xiu · Cơm xá xíu | 395 | 585/30/74.1/17.9/1.1 | cơm 200, xá xíu 100, ½ trứng, sốt (dầu hào, đường, bột bắp) | FatSecret char siu | TB- |
| com-ga-nuong · Cơm gà nướng | 400 | 659/34.8/68/26.6/1.3 | cơm 200, đùi gà nướng chín 130, mỡ hành 8, nước mắm pha 25 | Gần `com-ga` 750 (gà chiên xối mỡ) | TB |
| com-thit-nuong · Cơm thịt nướng | 380 | 628/32.2/71.5/22.9/1.7 | cơm 200, nạc dăm nướng chín 100, đường ướp 4, mỡ hành 8, nước mắm pha 30, đồ chua 30 | Gần `com-tam-suon` 650 | TB |
| com-chay · Cơm chay | 420 | 547/20.5/71.9/21.1/5.7 | cơm 200, đậu hũ chiên 60, rau xào 100, nấm 50, dầu 8, xì dầu 10 | | TB- |
| com-chien-ca-man · Cơm chiên cá mặn | 340 | 562/25.8/65.3/21/1.6 | cơm 220, cá mặn 20 (SR 174190), trứng 50, dầu 15, giá 20 | FNDDS 2708951 cơm chiên 174/100g | TB |
| com-chien-lap-xuong · Cơm chiên lạp xưởng | 340 | 614/20.6/65/29.3/1.2 | cơm 220, lạp xưởng chín 40, trứng 50, dầu 10 | FNDDS 2708954 cơm chiên thịt heo 179/100g, ra 609 kcal | TB |
| com-vit-quay · Cơm vịt quay | 390 | 741/34.2/66/36.8/1.1 | cơm 200, vịt quay có da chín 110, sốt 17 | `vit-co-da` | TB- |
| com-ga-ro-ti · Cơm gà rô ti | 390 | 727/35.2/69.5/33/1.4 | cơm 200 + gà rô ti (dòng dưới) + dưa leo, cà chua | | TB- |
| com-ca-ri-ga · Cơm cà ri gà | 500 | 688/24.7/81.7/28.9/4 | cơm 200 + ¾ tô cà ri gà (300 g) | như cà ri gà | TB- |
| bo-luc-lac · Bò lúc lắc (không cơm) | 250 | 407/34/14/23.7/2 | bò 150, dầu 12, sốt, rau 110 | Công thức web 376–654/phần (thăn ít mỡ thì ở mức thấp) | TB |
| bo-xao-hanh-tay · Bò xào hành tây | 180 | 279/22.6/11.3/15.7/1.4 | bò 100, hành tây 80, dầu 8, dầu hào 8 | FNDDS 2706747 Pepper steak 145/11.9/4.3/9.1 mỗi 100g; của mình 155/12.6/6.3/8.7 (+7%) | TB |
| bo-kho · Bò kho (1 tô, không bánh mì) | 430 | 424/29.9/28.4/20.8/1.9 | bò 120, cà rốt 60, nước dừa 100, nước hầm 150, dầu 6, đường 5, bột năng 5 | Công thức web 219–356 kcal/phần (không ghi gram) | TB- |
| thit-kho-tieu · Thịt kho tiêu | 110 | 358/22.6/9.3/25.5/0.2 | ba chỉ 60, nạc vai 60, nước mắm 12, đường 8 | | TB- |
| suon-ram · Sườn non ram mặn | 125 | 495/22.8/12.9/38.8/0.3 | sườn non (phần ăn được) 140, dầu 6, đường 10, nước mắm 12 | SR 167854 sườn heo om 397/100g; của mình 396/100g | TB |
| ga-xao-sa-ot · Gà xào sả ớt | 150 | 455/26/13.1/33/0.3 | đùi gà có da 150, sả 15, dầu 8, nước mắm 10, đường 6 | Công thức web 255 (đùi bỏ da) đến 770 (cánh) | TB- |
| canh-ga-chien-nuoc-mam · Cánh gà chiên nước mắm | 150 | 493/29/19.4/32.7/0.2 | cánh gà (phần ăn được) 160, bột bắp 8, dầu thấm 12, nước mắm 12, đường 10 | FNDDS 2706065 cánh gà chiên tẩm bột 289/100g, ra 434 kcal, cộng sốt khoảng 45 kcal = 479 | TB |
| ba-chi-chien-nuoc-mam · Ba chỉ chiên nước mắm | 90 | 432/20/9.7/35.1/0.1 | ba chỉ 120; mỡ chảy ra khoảng 4 g, để lại chảo | Ba chỉ quay Hàn Quốc 493/100g; của mình 480/100g | TB- |
| ga-ro-ti · Gà rô ti (1 đùi góc tư) | 140 | 459/29.4/11.3/32.3/0.2 | đùi gà có da 170 (phần ăn được), nước dừa 60, dầu thấm khoảng 4, đường 6, xì dầu 8 | FNDDS 2706029 đùi gà nướng có da 231/100g (chưa gồm sốt) | TB- |
| ca-ri-ga · Cà ri gà (1 tô) | 400 | 570/25.7/33.7/37.7/4.3 | đùi gà có da 130, khoai lang 100, cà rốt 40, nước cốt dừa 50, dầu 5 | FNDDS 2706437 cà ri gà 107/100g (430 kcal/400g, ít nước cốt dừa hơn); công thức web 365–772/tô | TB- (lệch 25% so với FNDDS vì nước cốt dừa và da gà) |
| ca-sot-ca-chua · Cá sốt cà chua | 210 | 306/31.3/9/16.7/1.1 | rô phi 150, dầu 14 (chiên + sốt), cà chua 80, đường 4 | | TB- |
| ca-hap-xi-dau · Cá hấp xì dầu | 170 | 215/31.6/5.4/7.7/0.5 | rô phi 150, xì dầu 15, dầu phi hành 5 | FNDDS 2706323 rô phi hấp 121/100g; cá + sốt khớp | TB |
| ca-nuc-kho-ca · Cá nục kho cà | 180 | 250/31.4/9.2/10.1/0.8 | cá nục 150, cà chua 50, dầu 5, đường 6, nước mắm 10 | | TB- |
| tom-rang-muoi · Tôm rang muối | 135 | 282/30.6/11.3/12.8/0.3 | tôm 150, bột bắp 10, dầu thấm 12 | FNDDS 2706364 tôm chiên 218/100g (bột dày hơn, nên P thấp hơn); của mình 209/100g | TB |
| tom-chien-bot · Tôm chiên bột | 140 | 295/26.9/16/13.7/0.5 | tôm 120, bột mì 15, bột năng 5, trứng 10, dầu thấm 12 | FNDDS 2706364 218/100g; của mình 211/100g | TB |
| tep-rang · Tép rang | 100 | 260/25.4/5.8/15.3/0.1 | tép 100, ba chỉ 30, dầu 5, đường 5, nước mắm 8 | | TB- |
| muc-chien-gion · Mực chiên giòn | 140 | 330/22/19.1/17.8/0.5 | mực 120, bột mì 20, trứng 10, dầu thấm 15 | FNDDS 2706334 mực chiên 234/100g; SR 171982 175/100g; của mình 236/100g | TB |
| dau-hu-nhoi-thit · Đậu hũ nhồi thịt sốt cà | 240 | 359/26.6/6.9/25.2/1.4 | đậu hũ 150, thịt bằm 50, dầu 10, cà chua 60 | | TB- |
| trung-chien-thit · Trứng chiên thịt bằm | 140 | 281/20.3/1.2/21.1/0.1 | 2 trứng, thịt bằm 40, dầu 6 | FNDDS 2707195 pork egg foo yung 149/100g (có giá, ít dầu); của mình 200/100g; `trung-chien` gốc 191/100g | TB- |
| ca-tim-xao · Cà tím xào thịt bằm | 200 | 258/10/16.3/18/6.2 | cà tím 200, thịt bằm 40, dầu 12 (cà tím hút dầu) | | TB- |
| long-xao-dua · Lòng xào dưa | 220 | 334/14.1/6.6/28.5/3.3 | lòng luộc 100, dưa cải 100, dầu 8, cà chua 30 | | TB- |
| bo-la-lot · Bò lá lốt (6 cuốn) | 130 | 310/25.5/6/20.2/0.5 | bò 100, mỡ ba chỉ 20, lá lốt 15, sả 8, dầu 6 | Delightful Plate: 349 kcal cho 113 g thịt sống mỗi phần (-11%) | TB |
| goi-ga-bap-cai · Gỏi gà bắp cải | 280 | 368/29.1/17.3/20.7/4.3 | gà luộc chín có da 100, bắp cải 100, hành tây, cà rốt, nước mắm pha 25, đậu phộng 10, dầu 3 | | TB- |
| thit-dong · Thịt đông (per 100g) | 100 | 160/14.1/2.2/10.1/0.8 | 60% móng giò luộc (SR 168290) + 37% nước hầm đông (SR 172884) + mộc nhĩ, cà rốt | SR 171630 Headcheese 157/13.8/0/10.9 (-2%) | TB (đạm chủ yếu là collagen) |
| canh-bi-dao-tom · Canh bí đao nấu tôm | 300 | 67/6.6/5.1/2.7/1.5 | bí đao 150, tôm 25, dầu 2, nước mắm 4 | | TB- |
| canh-rau-ngot-thit-bam | 300 | 140/13/3.6/7.9/2 | rau ngót 80, thịt bằm 40 | | TB- |
| canh-cai-thit-bam | 300 | 121/11.6/5.8/6.3/3.2 | cải xanh 100, thịt bằm 40 | | TB- |
| canh-mong-toi-tom | 300 | 70/8/4.2/2.8/1.8 | mồng tơi 100, tôm 25 | | TB- |
| canh-trung-ca-chua | 300 | 134/8.3/4.6/9.2/1.1 | 1 trứng, cà chua 80, dầu 4 | SR 174807 canh trứng kiểu Hoa 27/100g (loãng hơn); của mình 45/100g | TB- |
| canh-bau-tom | 300 | 69/6.8/5.7/2.4/0.8 | bầu 150, tôm 25 | | TB- |
| canh-bi-do-thit-bam | 300 | 123/9.7/8.5/6/0.6 | bí đỏ 120, thịt bằm 40 | | TB- |
| canh-suon-ham-cu | 350 | 298/15.6/21.6/16.3/2.7 | sườn non 60, khoai tây 60, cà rốt 50, nước hầm 176 | | TB- |
| canh-khoai-mo-tom | 300 | 170/7.8/29/2.7/4.2 | khoai mỡ 100 (SR 170071), tôm 25 | | TB- |
| sup-ga · Súp gà bắp (1 chén) | 250 | 122/10.7/13.5/3/0.7 | ức gà 30, bắp 30, trứng 15, bột năng 8 | SR 174808 súp chua cay 39/100g, ra 98 | TB- |
| dau-que-xao-thit · Đậu que xào bò | 190 | 204/13.7/12/12.1/4.1 | đậu que 150, bò 50, dầu 8, dầu hào 5 | FNDDS 2706751 bò xào rau 102/100g; của mình 107/100g | TB |
| gia-xao · Giá hẹ xào | 180 | 141/7.1/13.2/8.6/4.4 | giá 200, hẹ 30, dầu 8 | SR 169138 giá xào 50/100g (không dầu thêm) | TB- |
| bong-cai-xao · Bông cải xào tỏi | 180 | 137/4.3/13.5/8.6/4.5 | bông cải xanh 100, súp lơ 50, cà rốt 30, dầu 8 | FNDDS 2710036 rau xào có dầu 71/100g; của mình 76 | TB |
| su-su-xao | 190 | 105/1.9/10.1/7.2/3.5 | su su 200, dầu 7 | | TB- |
| rau-cu-xao · Rau củ xào thập cẩm | 210 | 142/4.3/15/8.6/4.8 | 5 loại rau củ 210, dầu 8, dầu hào 6 | FNDDS 2710036 71/100g; của mình 67 | TB |
| cai-thia-xao-nam | 220 | 106/4.8/7.6/7.6/2.5 | cải thìa 180, nấm 60, dầu 7 | | TB- |
| muop-xao | 190 | 97/2.7/9.6/6.4/2.2 | mướp 200, dầu 6 | | TB- |
| kho-qua-xao-trung | 190 | 169/8/6/13.1/4.2 | khổ qua 150, 1 trứng, dầu 8 | | TB- |
| bap-cai-xao · Bắp cải xào cà chua | 210 | 121/3.2/13.5/7.3/5.4 | bắp cải 200, cà chua 30, dầu 7 | | TB- |
| rau-cu-luoc · Rau củ luộc thập cẩm | 200 | 62/3.2/13.6/0.5/4.8 | bông cải 60, cà rốt 50, su su 60, đậu que 30 (không dầu) | Tính từ USDA nguyên liệu | TB |
| nuoc-mam-pha (per 100g) | 100 | 88/0.9/21.9/0/0.1 | nước mắm 15%, đường 20%, chanh 8%, tỏi ớt 2%, nước 55% | FatSecret Roll'd "Nuoc Mam" 154/100g (ngọt hơn); pha ở nhà khoảng 12% đường thì còn khoảng 57 | TB- (dao động 57–154 tùy độ ngọt) |
| mo-hanh (per 100g) | 100 | 543/0.7/2.9/60.1/1 | 60% dầu + 40% hành lá | tự tính | TB |
| do-chua (per 100g, đã ráo) | 100 | 49/0.8/11.9/0.2/2.2 | ½ cà rốt + ½ củ cải (SR 168451) + 5% đường thấm | tự tính | TB- |

### Bỏ qua / chưa đủ dữ liệu
- **Thịt chưng mắm ruốc sả**: không có số liệu mắm ruốc đáng tin (Long Châu ghi 98 kcal/100g, không có P/F; PhilFCT chỉ có bagoong xào 401 kcal), nên bỏ.
- **Cơm tấm bì chả**: không có số liệu cho "bì" (da heo + thịt luộc + thính); bảng gốc đã có `com-tam-sbc`.
- **Cơm niêu**: lượng cơm cháy và dầu dao động quá rộng.
- **Cháo trắng, cháo sườn, súp cua**: lúc đầu gỡ khỏi file này vì tưởng `vn-noodle.ts` giữ. Agent vn-noodle cũng đã gỡ bản của họ, nên **đã thêm lại vào `vn-rice.ts`** (xem bảng dưới).

### Bổ sung 2026-10-17: thêm lại 3 món
| id · Tên | Phần (g) | kcal/P/C/F/xơ | Công thức chính (sống) | Đối chiếu | Tin cậy |
|---|---|---|---|---|---|
| chao-suon · Cháo sườn (không quẩy) | 400 | 253/10.5/28.2/10.3/0.6 | gạo 34 g (bột gạo/gạo, SR short-grain raw), sườn non 40 (SR 167853), chà bông 5, hành 5, nước | Bản tự tính của agent vn-noodle: 264/16/32/7.7 cho 430 g (lệch 4% kcal) | TB- |
| chao-trang · Cháo trắng (per 100g) | 100 | 36/0.7/7.9/0.1/0.1 | gạo 10% (quán, nấu đặc) | Quy đổi từ cơm trắng 30% + nước = 39; bản của vn-noodle 120 kcal/350 g = 34/100g | TB |
| sup-cua · Súp cua (1 chén) | 250 | 116/8.5/11.3/4.2/0.6 | thịt cua chín 25 (SR 174205), trứng 15, bột năng 8, nấm 20, bắp 15, nước dùng 165, dầu mè 2 | SR 174808 súp chua cay 39/100g, ra 98; bản của vn-noodle 167 cho 315 g = 53/100g (của mình 46/100g) | TB- |
- Món đã có trong bảng gốc nên không thêm: cơm sườn trứng (`com-tam-suon-trung`), cơm gà xối mỡ (`com-ga`), cơm gà luộc (`com-ga-hoi-an`), cơm chiên dương châu (`com-chien`), cơm cá kho, thịt rang cháy cạnh (`thit-rang`), thịt luộc (`ba-chi-luoc`), gà kho gừng, cá kho tộ, tôm rim, mực xào, cá chiên, đậu hũ sốt cà, chả trứng, canh khổ qua nhồi thịt, canh chua cá, rau luộc, đậu que xào tỏi, rau muống xào.

### Nghi vấn về món cũ (chỉ ghi lại, chưa sửa)
- `thit-kho-trung` (200 g, 450 kcal, F 34): 120 g ba chỉ sống theo số `ba-chi` gốc (356/100g) đã ra khoảng 427 kcal, chưa tính trứng, đường, nước kho. Nếu phần ăn có 1–1.5 trứng thì số có thể thấp hơn thực tế khoảng 15–25%. Nên audit lại.
- `ba-chi` gốc (sống 356/16/0/32.6) nằm giữa Bảng VN (khoảng 260) và USDA SR 167812 (518). Mọi món dùng ba chỉ phụ thuộc vào giả định này.
- `com-ga` (cơm gà xối mỡ 400 g, 750/35/80/32) và `cha-trung` thiếu alias: "com ga chien", "trung hap van", "trung hap thit".
- `thit-kho-trung` thiếu alias "thit kho tau", "thit kho hot vit".
- `canh-chua` (300 g, 120 kcal): hợp lý.

### Lần sau làm tiếp
- Xôi mặn các loại, cơm cháy, cơm trộn Hàn (nếu vn-noodle chưa có).
- Hải sản nhà làm: nghêu xào sả, ốc xào me, cua rang me, cá kho tiêu (basa).
- Món chay: đậu hũ kho nấm, chả chay, canh nấm chay.
- Món nhậu bình dân: gà nướng muối ớt, bò nhúng giấm, lẩu thái (1 phần).
- Tìm bản gốc Bảng thành phần thực phẩm VN để xác minh rau ngót, cá nục, ba chỉ.

# Món bổ sung từ danh sách chờ (AI chụp ảnh gặp mà bảng chưa có)

Sinh tự động bởi `scripts/foods-bulk.mjs` (ngày 2026-10-24). Số liệu trên 100g: kcal/P/C/F/xơ. ≥ 3 nguồn → trung vị, 2 nguồn → trung bình, 1 nguồn → độ tin cậy "thấp". Atwater đã kiểm bằng script (lệch ≤ 10%). Carb của Bảng VN và USDA đã gồm xơ.

| Món (id) | Số ghi | Nguồn | Lệch kcal | Độ tin cậy |
|---|---|---|---|---|
| Nước ép lựu (`nuoc-ep-luu`) | 54/0.2/13.1/0.3/0.1 | USDA SR 167787: Pomegranate juice, bottled (54/0.2/13.1/0.3) | 0% | thấp (1 nguồn) |
| Sợi mì lạnh (`soi-mi-lanh`) | 115/4.1/25/0.3/1.2 | USDA SR 168907: Noodles, japanese, soba, cooked (99/5.1/21.4/0.1)<br>Tự tính / ước tính : Mì lạnh Hàn (kiều mạch + bột khoai) luộc, ước tính theo thành phần (130/3.2/28.5/0.4) | 27% | thấp (nguồn lệch 27%) |
| Nước dùng mì lạnh (`nuoc-dung-mi-lanh`) | 21/1/3.9/0.2/0 | Tự tính / ước tính : Nước dùng bò ướp lạnh + giấm + đường, ước tính (20/1/3.8/0.2)<br>Tự tính / ước tính : Ước tính của AI khi chụp ảnh (số trong yêu cầu chờ) (23/1/4/0.3) | 12% | thấp (chỉ ước tính) |
| Trứng gà hấp Hàn Quốc (`trung-ga-hap-han`) | 100/8.1/1/6.9/0.1 | Tự tính / ước tính : Trứng luộc USDA (155 kcal/100g) × 60% + 40% nước, kiểu gyeran-jjim (93/7.6/0.7/6.4)<br>Tự tính / ước tính : Ước tính của AI khi chụp ảnh (số trong yêu cầu chờ) (107/8.7/1.3/7.3) | 14% | thấp (chỉ ước tính) |
| Pizza Prosciutto (`pizza-prosciutto`) | 263/10.9/28.3/11.4/1.8 | USDA SR 170317: Pizza, cheese topping, regular crust, frozen, cooked (268/10.4/29/12.3)<br>Tự tính / ước tính : Ước tính của AI khi chụp ảnh (số trong yêu cầu chờ) (257/11.4/27.6/10.5) | 4% | cao |
| Pizza Steak (`pizza-steak`) | 267/11.8/27.9/11.8/1.8 | USDA SR 170317: Pizza, cheese topping, regular crust, frozen, cooked (268/10.4/29/12.3)<br>Tự tính / ước tính : Ước tính của AI khi chụp ảnh (số trong yêu cầu chờ) (267/13.3/26.7/11.4) | 0% | cao |
| Mì Ý nghêu sốt pesto (`mi-y-ngheu-pesto`) | 168/7/21.7/5.6/1.2 | Tự tính / ước tính : Tính công thức 250g: 200g mì Ý chín 316 kcal + 30g thịt nghêu + 15g pe (187/8.2/25.7/5.4)<br>Tự tính / ước tính : Ước tính của AI khi chụp ảnh (số trong yêu cầu chờ) (149/5.7/17.7/5.7) | 23% | thấp (chỉ ước tính) |
| Trà mãng cầu Phúc Long (`tra-mang-cau-phuc-long`) | 37/0.1/8.9/0/0.2 | Tự tính / ước tính : Ước tính của AI khi chụp ảnh (số trong yêu cầu chờ) (37/0.1/8.9/0) | 0% | thấp (chỉ ước tính) |
| Patty tôm chiên (`patty-tom-chien`) | 234/17.6/12/12.4/0.5 | USDA SR 171970: Crustaceans, shrimp, mixed species, cooked, breaded and fried (242/21.4/11.5/12.3)<br>Tự tính / ước tính : Ước tính của AI khi chụp ảnh (số trong yêu cầu chờ) (225/13.8/12.5/12.5) | 7% | cao |
| Hành ngò (`hanh-ngo`) | 23/2.1/3.7/0.3/2.7 | USDA SR 169997: Coriander (cilantro) leaves, raw (23/2.1/3.7/0.5)<br>USDA SR 170005: Onions, spring or scallions (includes tops and bulb), raw (32/1.8/7.3/0.2)<br>Bảng VN 4081: Rau mùi, tươi (22/2.6/2.2/0.3) | 43% | thấp (nguồn lệch 43%) |


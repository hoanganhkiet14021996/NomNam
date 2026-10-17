# Thịt, gia cầm, cá, hải sản, trứng (nhập hàng loạt từ USDA, Matvaretabellen, Bảng VN)

Sinh tự động bởi `scripts/foods-bulk.mjs` (ngày 2026-10-17). Số liệu trên 100g: kcal/P/C/F/xơ. ≥ 3 nguồn → trung vị, 2 nguồn → trung bình, 1 nguồn → độ tin cậy "thấp". Atwater đã kiểm bằng script (lệch ≤ 10%). Carb của Bảng VN và USDA đã gồm xơ.

| Món (id) | Số ghi | Nguồn | Lệch kcal | Độ tin cậy |
|---|---|---|---|---|
| Thịt heo nạc đùi / mông (sống) (`heo-nac-dui-song`) | 131/23.2/0/3.8/0 | USDA SR 167816: Pork, fresh, leg (ham), rump half, separable lean only, raw (Includes  (120/21.8/0/2.9)<br>Bảng VN 7084: Thịt lợn, nạc mông, tươi (141/24.7/0/4.7) | 16% | trung bình |
| Thịt heo thăn (sống) (`heo-thang-song`) | 118/23/0/2.9/0 | USDA SR 168249: Pork, fresh, loin, tenderloin, separable lean only, raw (109/21/0/2.2)<br>Matvaretabellen 03.209: Pork, tenderloin, raw (124/23/0.2/3.5)<br>Bảng VN 7085: Thịt lợn, nạc thăn, tươi (118/23/0/2.9) | 13% | trung bình |
| Thịt heo thăn lẫn mỡ (nướng, đã chín) (`heo-thang-mo-chin`) | 248/27.1/0/14.7/0 | USDA SR 167821: Pork, fresh, loin, whole, separable lean and fat, cooked, roasted (248/27.1/0/14.7) | 0% | thấp (1 nguồn) |
| Thịt heo nửa nạc nửa mỡ (sống) (`heo-nua-nac-nua-mo-song`) | 248/16.8/0/19.7/0 | USDA SR 167843: Pork, fresh, shoulder, whole, separable lean and fat, raw (236/17.2/0/18)<br>Bảng VN 7018: Thịt lợn, nửa nạc, nửa mỡ, tươi (260/16.5/0/21.5) | 10% | cao |
| Thịt heo xay (84% nạc, sống) (`heo-xay-song`) | 218/18/0.4/16/0 | USDA SR 168372: Pork, ground, 84% lean / 16% fat, raw (218/18/0.4/16) | 0% | thấp (1 nguồn) |
| Thịt heo xay (84% nạc, xào/áp chảo, đã chín) (`heo-xay-chin`) | 289/26.7/0.6/20/0 | USDA SR 169192: Pork, ground, 84% lean / 16% fat, cooked, crumbles (289/26.7/0.6/20) | 0% | thấp (1 nguồn) |
| Sườn non heo (sống, cả xương) (`suon-non-song`) | 206/18.5/0/14.6/0 | USDA SR 168299: Pork, fresh, backribs, separable lean and fat, raw (224/19.1/0/16.3)<br>Bảng VN 7053: Sườn lợn, tươi (187/17.9/0/12.8) | 18% | trung bình |
| Sườn non heo (nướng, đã chín, bỏ xương) (`suon-non-chin`) | 292/23/0/21.5/0 | USDA SR 168300: Pork, fresh, backribs, separable lean and fat, cooked, roasted (292/23/0/21.5) | 0% | thấp (1 nguồn) |
| Giò bò (chín) (`cha-lua-gio-bo`) | 335/18.2/0/29/0 | Bảng VN 7068: Giò bò, chín (335/18.2/0/29) | 0% | thấp (1 nguồn) |
| Chả quế heo (`cha-que`) | 416/16.2/0/39/0 | Bảng VN 7065: Chả quế lợn (416/16.2/0/39) | 0% | thấp (1 nguồn) |
| Thịt xá xíu (`xa-xiu-thit`) | 189/26.4/0/9.2/0 | Bảng VN 7142: Thịt xá xíu (189/26.4/0/9.2) | 0% | thấp (1 nguồn) |
| Bò xay 80/20 (sống) (`bo-xay-80-song`) | 251/17.4/0/19.7/0 | USDA SR 174036: Beef, ground, 80% lean meat / 20% fat, raw (254/17.2/0/20)<br>USDA Foundation 2514744: Beef, ground, 80% lean meat / 20% fat, raw (248/17.5/0/19.4) | 2% | cao |
| Bò xay 80/20 (áp chảo, đã chín) (`bo-xay-80-chin`) | 259/25.5/0/16.7/0 | USDA SR 171798: Beef, ground, 80% lean meat / 20% fat, patty, cooked, pan-broiled (246/24/0/15.9)<br>USDA SR 171799: Beef, ground, 80% lean meat / 20% fat, crumbles, cooked, pan-browned (272/27/0/17.4) | 10% | trung bình |
| Bò xay 85/15 (sống) (`bo-xay-85-song`) | 215/18.6/0/15/0 | USDA SR 171796: Beef, ground, 85% lean meat / 15% fat, raw (Includes foods for USDA's  (215/18.6/0/15) | 0% | thấp (1 nguồn) |
| Bò xay 85/15 (áp chảo, đã chín) (`bo-xay-85-chin`) | 232/24.6/0/14/0 | USDA SR 174033: Beef, ground, 85% lean meat / 15% fat, patty, cooked, pan-broiled (232/24.6/0/14) | 0% | thấp (1 nguồn) |
| Bò xay 90/10 (sống) (`bo-xay-90-song`) | 176/20/0/10/0 | USDA SR 174030: Beef, ground, 90% lean meat / 10% fat, raw (176/20/0/10) | 0% | thấp (1 nguồn) |
| Bò xay 95/5 (sống) (`bo-xay-95-song`) | 137/21.4/0/5/0 | USDA SR 171790: Beef, ground, 95% lean meat / 5% fat, raw (137/21.4/0/5) | 0% | thấp (1 nguồn) |
| Bò xay 95/5 (áp chảo, đã chín) (`bo-xay-95-chin`) | 164/25.8/0/5.9/0 | USDA SR 171792: Beef, ground, 95% lean meat / 5% fat, patty, cooked, pan-broiled (164/25.8/0/5.9) | 0% | thấp (1 nguồn) |
| Thịt bò loại I – bắp/đùi nạc (sống) (`bo-loai-1-song`) | 121/23.6/0/3.3/0 | USDA SR 171758: Beef, round, top round steak, boneless, separable lean only, trimmed t (124/23.6/0/3.3)<br>USDA SR 171757: Beef, round, top round steak, boneless, separable lean only, trimmed t (121/23.6/0/2.9)<br>Bảng VN 7003: Thịt bò, loại I, tươi (118/21/0/3.8) | 5% | cao |
| Thăn ngoại bò (sirloin, nạc, sống) (`bo-thang-ngoai-song`) | 131/22.1/0/4.1/0 | USDA SR 171804: Beef, top sirloin, steak, separable lean only, trimmed to 1/8" fat, se (127/22.3/0/3.5)<br>USDA SR 174763: Beef, top sirloin, steak, separable lean only, trimmed to 1/8" fat, ch (135/21.9/0/4.6) | 6% | cao |
| Thăn nội bò (phi lê, lẫn mỡ viền, sống) (`bo-thang-noi-song`) | 247/19.7/0/18/0 | USDA SR 169542: Beef, tenderloin, steak, separable lean and fat, trimmed to 1/8" fat,  (247/19.6/0/18.2)<br>USDA SR 169545: Beef, tenderloin, steak, separable lean and fat, trimmed to 1/8" fat,  (246/19.8/0/17.9) | 0% | cao |
| Bò ribeye (lẫn mỡ, sống) (`bo-ribeye-song`) | 274/17.5/0/22.1/0 | USDA SR 168612: Beef, rib, eye, small end (ribs 10-12), separable lean and fat, trimme (274/17.5/0/22.1) | 0% | thấp (1 nguồn) |
| Bò ribeye (nướng, lẫn mỡ, đã chín) (`bo-ribeye-chin`) | 234/26/0/14/0 | USDA SR 169436: Beef, rib, eye, small end (ribs 10-12), separable lean and fat, trimme (265/26.6/0/16.8)<br>Matvaretabellen 03.268: Beef, rib-eye steak, roasted without fat (202/25.4/0/11.2) | 27% | thấp (nguồn lệch 27%) |
| Bò T-bone (nướng, lẫn mỡ, đã chín, bỏ xương) (`bo-tbone-chin`) | 253/24.1/0/16.6/0 | USDA SR 169464: Beef, short loin, t-bone steak, separable lean and fat, trimmed to 0"  (247/24.2/0/15.9)<br>USDA SR 169465: Beef, short loin, t-bone steak, separable lean and fat, trimmed to 0"  (258/24.1/0/17.3) | 4% | cao |
| Bò đùi nạc (nướng/áp chảo, đã chín) (`bo-dui-nac-chin`) | 162/30.1/0/3.8/0 | USDA SR 168649: Beef, round, top round steak, boneless, separable lean only, trimmed t (162/30.1/0/3.8) | 0% | thấp (1 nguồn) |
| Bò skirt / ba chỉ bò Mỹ (lẫn mỡ, sống) (`bo-ba-chi-my-song`) | 187/20.4/0/11.7/0 | USDA SR 172158: Beef, plate steak, boneless, inside skirt, separable lean and fat, tri (187/20.4/0/11.7) | 0% | thấp (1 nguồn) |
| Nạm bò (nạc, sống) (`bo-nam-song`) | 135/21.4/0/5.4/0 | USDA SR 168656: Beef, brisket, flat half, boneless separable lean only, trimmed to 0"  (132/21.5/0/5.1)<br>USDA SR 168657: Beef, brisket, flat half, boneless, separable lean only, trimmed to 0" (137/21.3/0/5.8) | 4% | cao |
| Bắp bò (sống) (`bo-bap-song`) | 125/21.8/0/3.9/0 | USDA SR 169441: Beef, shank crosscuts, separable lean only, trimmed to 1/4" fat, choic (128/21.8/0/3.9)<br>Bảng VN 7094: Thịt bò, bắp, sống (122/21.8/0/3.9) | 5% | cao |
| Gầu bò (sống) (`bo-ngau-song`) | 253/18.4/0.6/19.1/0 | USDA SR 168664: Beef, brisket, whole, separable lean and fat, trimmed to 1/8" fat, all (253/18.4/0.6/19.1) | 0% | thấp (1 nguồn) |
| Xúc xích bò (`xuc-xich-bo`) | 178/10.2/13.5/8.8/0 | Bảng VN 7143: Xúc xích bò (178/10.2/13.5/8.8) | 0% | thấp (1 nguồn) |
| Thịt gà ta (sống, cả da) (`ga-ta-song`) | 207/19.5/0/14.1/0 | USDA SR 171447: Chicken, broilers or fryers, meat and skin, raw (215/18.6/0/15.1)<br>Bảng VN 7013: Thịt gà ta, tươi (199/20.3/0/13.1) | 8% | cao |
| Đùi gà công nghiệp (sống, bỏ da) (`ga-cong-nghiep-dui-song`) | 121/19.4/0/4.1/0 | USDA SR 173627: Chicken, broilers or fryers, dark meat, thigh, meat only, raw (121/19.7/0/4.1)<br>USDA SR 173614: Chicken, broilers or fryers, dark meat, drumstick, meat only, raw (116/19.4/0/3.7)<br>Bảng VN 7088: Thịt gà công nghiệp, đùi, tươi (137/18/0.9/6.8) | 17% | trung bình |
| Cánh gà (sống, cả da) (`ga-canh-song`) | 190/18.3/0/12.6/0 | USDA SR 172390: Chicken, broilers or fryers, wing, meat and skin, raw (191/17.5/0/12.9)<br>Bảng VN 7087: Thịt gà công nghiệp, cánh, tươi (188/19.1/0/12.4) | 2% | cao |
| Cánh gà (luộc, đã chín, cả da, bỏ xương) (`ga-canh-luoc`) | 258/25.2/0/17.1/0 | USDA SR 173630: Chicken, broilers or fryers, wing, meat and skin, cooked, roasted (254/23.8/0/16.9)<br>Bảng VN 7087002: Thịt gà công nghiệp, cánh, luộc (261/26.5/0/17.3) | 3% | cao |
| Đùi gà (luộc, đã chín, cả da, bỏ xương) (`ga-dui-luoc`) | 191/24.2/0.6/9.8/0 | USDA SR 173612: Chicken, broilers or fryers, drumstick, meat and skin, cooked, roasted (191/23.4/0/10.2)<br>Bảng VN 7088002: Thịt gà công nghiệp, đùi, luộc (190/25/1.2/9.4) | 1% | cao |
| Đùi gà ta (luộc, đã chín) (`ga-ta-dui-luoc`) | 261/26.5/0/17.3/0 | Bảng VN 7105002: Thịt gà, ta, đùi, luộc (261/26.5/0/17.3) | 0% | thấp (1 nguồn) |
| Lườn gà ta (luộc, đã chín) (`ga-ta-luom-luoc`) | 186/31.8/0/6.5/0 | Bảng VN 7106002: Thịt gà, ta, lườn, đùi, luộc (186/31.8/0/6.5) | 0% | thấp (1 nguồn) |
| Gà xay (sống) (`ga-xay-song`) | 143/17.4/0/8.1/0 | USDA SR 171116: Chicken, ground, raw (143/17.4/0/8.1) | 0% | thấp (1 nguồn) |
| Gà xay (xào/áp chảo, đã chín) (`ga-xay-chin`) | 189/23.3/0/10.9/0 | USDA SR 171117: Chicken, ground, crumbles, cooked, pan-browned (189/23.3/0/10.9) | 0% | thấp (1 nguồn) |
| Thịt vịt (sống) (`vit-song`) | 267/17.8/0/21.8/0 | Bảng VN 7028: Thịt vịt, tươi (267/17.8/0/21.8) | 0% | thấp (1 nguồn) |
| Thịt vịt (luộc, đã chín) (`vit-luoc`) | 371/24.7/0/30.3/0 | Bảng VN 7028002: Thịt vịt, luộc (371/24.7/0/30.3) | 0% | thấp (1 nguồn) |
| Lườn vịt (luộc, đã chín) (`vit-luon-luoc`) | 163/27.6/0/5.9/0 | Bảng VN 7113002: Thịt vịt, lườn, luộc (163/27.6/0/5.9) | 0% | thấp (1 nguồn) |
| Thịt ngan (luộc, đã chín) (`ngan-luoc`) | 400/23.7/0/34/0 | Bảng VN 7090002: Thịt ngan, luộc (400/23.7/0/34) | 0% | thấp (1 nguồn) |
| Tim gà (luộc, đã chín) (`tim-ga-luoc`) | 173/24.5/0.1/7.8/0 | USDA SR 171059: Chicken, heart, all classes, cooked, simmered (185/26.4/0.1/7.9)<br>Bảng VN 7056002: Tim gà, luộc (160/22.5/0/7.8) | 14% | trung bình |
| Thịt thỏ (sống) (`thit-tho`) | 147/20.8/0/6.8/0 | USDA SR 172521: Game meat, rabbit, domesticated, composite of cuts, raw (136/20.1/0/5.6)<br>Bảng VN 7021: Thịt thỏ nhà, tươi (158/21.5/0/8) | 15% | trung bình |
| Ếch (thịt đùi, sống) (`ech-dui`) | 90/20/0/1.1/0 | Bảng VN 7080: Ếch (thịt đùi), tươi (90/20/0/1.1) | 0% | thấp (1 nguồn) |
| Cá chép (sống) (`ca-chep-song`) | 112/16.9/0/4.6/0 | USDA SR 171952: Fish, carp, raw (127/17.8/0/5.6)<br>Bảng VN 8003: Cá chép, tươi (96/16/0/3.6) | 28% | thấp (nguồn lệch 28%) |
| Cá lóc / cá quả (sống) (`ca-loc-song`) | 97/18.2/0/2.7/0 | Bảng VN 8022: Cá quả, tươi (97/18.2/0/2.7) | 0% | thấp (1 nguồn) |
| Cá rô đồng (sống) (`ca-ro-dong-song`) | 126/19.1/0/5.5/0 | Bảng VN 8023: Cá rô đồng, tươi (126/19.1/0/5.5) | 0% | thấp (1 nguồn) |
| Cá rô phi / điêu hồng (sống) (`ca-ro-phi-song`) | 100/19.7/0/2.3/0 | USDA SR 175176: Fish, tilapia, raw (96/20.1/0/1.7)<br>Bảng VN 8024: Cá rô phi, tươi (100/19.7/0/2.3)<br>Bảng VN 8062: Cá điêu hồng (111/17.1/3.1/3.3) | 15% | trung bình |
| Cá rô phi (chiên giòn, đã chín) (`ca-ro-phi-chien`) | 131/25.9/0/3/0 | Bảng VN 8024008: Cá rô phi, chiên giòn (131/25.9/0/3) | 0% | thấp (1 nguồn) |
| Cá trê (sống) (`ca-tre-song`) | 173/16.5/0/11.9/0 | Bảng VN 8030: Cá trê, tươi (173/16.5/0/11.9) | 0% | thấp (1 nguồn) |
| Cá nục (sống) (`ca-nuc-song`) | 111/20.2/0/3.3/0 | Bảng VN 8020: Cá nục, tươi (111/20.2/0/3.3) | 0% | thấp (1 nguồn) |
| Cá nục (luộc, đã chín) (`ca-nuc-luoc`) | 133/24.3/0/4/0 | Bảng VN 8020002: Cá nục, luộc (133/24.3/0/4) | 0% | thấp (1 nguồn) |
| Cá nục (nướng, đã chín) (`ca-nuc-nuong`) | 138/25.3/0/4.1/0 | Bảng VN 8020014: Cá nục, nướng (138/25.3/0/4.1) | 0% | thấp (1 nguồn) |
| Cá ngừ (sống) (`ca-ngu-song`) | 105/24/0/0.5/0 | USDA SR 175159: Fish, tuna, fresh, yellowfin, raw (109/24.4/0/0.5)<br>Matvaretabellen 04.043: Tuna, raw (105/24/0/1)<br>Bảng VN 8019: Cá ngừ, tươi (87/21/0/0.3) | 21% | trung bình |
| Cá chim (sống) (`ca-chim-song`) | 154/18.1/1.8/7.9/0 | USDA SR 173682: Fish, pompano, florida, raw (164/18.5/0/9.5)<br>Bảng VN 8060: Cá chim (143/17.7/3.6/6.4) | 14% | trung bình |
| Cá phèn (sống) (`ca-phen-song`) | 104/15.9/0/4.5/0 | Bảng VN 8021: Cá phèn, tươi (104/15.9/0/4.5) | 0% | thấp (1 nguồn) |
| Cá trích (sống) (`ca-trich-song`) | 166/17.7/0/10.6/0 | USDA SR 175116: Fish, herring, Atlantic, raw (158/18/0/9)<br>Matvaretabellen 04.382: Herring, raw (179/17.4/0/12.1)<br>Bảng VN 8031: Cá trích, tươi (166/17.7/0/10.6) | 13% | trung bình |
| Cá đối (sống) (`ca-doi-song`) | 113/19.4/0/3.5/0 | USDA SR 175123: Fish, mullet, striped, raw (117/19.4/0/3.8)<br>Bảng VN 8009: Cá đối, tươi (108/19.5/0/3.3) | 8% | cao |
| Cá bống (sống) (`ca-bong-song`) | 70/15.8/0/0.8/0 | Bảng VN 8001: Cá bống, tươi (70/15.8/0/0.8) | 0% | thấp (1 nguồn) |
| Cá lác (luộc, đã chín) (`ca-lac-luoc`) | 86/20.1/0/0.6/0 | Bảng VN 8013002: Cá lác, luộc (86/20.1/0/0.6) | 0% | thấp (1 nguồn) |
| Cá lác (chiên giòn, đã chín) (`ca-lac-chien`) | 94/22/0/0.7/0 | Bảng VN 8013008: Cá lác, chiên giòn (94/22/0/0.7) | 0% | thấp (1 nguồn) |
| Cá trạch / cá chạch (sống) (`ca-trach-song`) | 110/20.4/0/3.2/0 | Bảng VN 8028: Cá trạch, tươi (110/20.4/0/3.2) | 0% | thấp (1 nguồn) |
| Cá diếc (sống) (`ca-diec-song`) | 87/17.7/0/1.8/0 | Bảng VN 8006: Cá diếc, tươi (87/17.7/0/1.8) | 0% | thấp (1 nguồn) |
| Cá mè (sống) (`ca-me-song`) | 144/15.4/0/9.1/0 | Bảng VN 8014: Cá mè, tươi (144/15.4/0/9.1) | 0% | thấp (1 nguồn) |
| Cá trắm cỏ (sống) (`ca-tram-co-song`) | 109/17.4/0/4.1/0 | USDA SR 171952: Fish, carp, raw (127/17.8/0/5.6)<br>Bảng VN 8029: Cá trắm cỏ, tươi (91/17/0/2.6) | 33% | thấp (nguồn lệch 33%) |
| Cá khô (chim, thu, nụ, đé – sống) (`ca-kho-song`) | 208/43.3/0/3.9/0 | Bảng VN 8012: Cá khô (chim, thu, nụ, đé), sống (208/43.3/0/3.9) | 0% | thấp (1 nguồn) |
| Chả cá basa (rán) (`ca-basa-chien-cha`) | 186/11.1/6.1/13/0 | Bảng VN 8064008: Chả cá basa, rán (186/11.1/6.1/13) | 0% | thấp (1 nguồn) |
| Tôm biển (nướng, đã chín) (`tom-bien-nuong`) | 124/26.7/1.4/1.4/0 | Bảng VN 8051014: Tôm biển, nướng (124/26.7/1.4/1.4) | 0% | thấp (1 nguồn) |
| Tôm khô (biển) (`tom-kho`) | 347/75.6/2.5/3.8/0 | Bảng VN 8053: Tôm biển, khô (347/75.6/2.5/3.8) | 0% | thấp (1 nguồn) |
| Tép khô (`tep-kho`) | 269/59.8/0.7/3/0 | Bảng VN 8050: Tép khô, sống (269/59.8/0.7/3) | 0% | thấp (1 nguồn) |
| Mực khô (sống) (`muc-kho`) | 291/60.1/2.5/4.5/0 | Bảng VN 8039: Mực khô, sống (291/60.1/2.5/4.5) | 0% | thấp (1 nguồn) |
| Cua biển (sống, lấy thịt) (`cua-bien-song`) | 103/17.5/7/0.6/0 | USDA SR 174204: Crustaceans, crab, blue, raw (87/18.1/0/1.1)<br>Bảng VN 8033: Cua bể, tươi (103/17.5/7/0.6)<br>Bảng VN 8069: Thịt cua (103/17.5/7/0.6) | 16% | trung bình |
| Cua đồng (sống) (`cua-dong-song`) | 87/12.3/2/3.3/0 | Bảng VN 8034: Cua đồng, tươi (87/12.3/2/3.3) | 0% | thấp (1 nguồn) |
| Trứng vịt (sống, cả quả) (`trung-vit-song`) | 179/12.9/2.2/12.9/0 | USDA SR 172189: Egg, duck, whole, fresh, raw (185/12.8/1.5/13.8)<br>Bảng VN 9004: Trứng vịt (172/13/2.9/12) | 7% | cao |
| Trứng cút (sống, cả quả) (`trung-cut-song`) | 158/12.9/1.7/10.8/0 | USDA SR 172191: Egg, quail, whole, fresh, raw (158/13.1/0.4/11.1)<br>Bảng VN 9007: Trứng chim cút (157/12.8/2.9/10.5) | 1% | cao |
| Trứng gà ta (sống, cả quả) (`trung-ga-ta-song`) | 150/13/1.3/10.3/0 | Bảng VN 9001: Trứng gà ta (150/13/1.3/10.3) | 0% | thấp (1 nguồn) |
| Trứng gà công nghiệp (sống, cả quả) (`trung-ga-cong-nghiep-song`) | 132/12.8/1.9/8.2/0 | Bảng VN 9012: Trứng gà công nghiệp (132/12.8/1.9/8.2) | 0% | thấp (1 nguồn) |
| Lòng đỏ trứng vịt (`long-do-trung-vit`) | 364/13.6/4.8/32.3/0 | Bảng VN 9005: Lòng đỏ trứng vịt (364/13.6/4.8/32.3) | 0% | thấp (1 nguồn) |

## Món đã chủ động bỏ (số liệu nguồn đáng ngờ)

- **Bì / da heo (sống)** (`da-heo-song`): Bảng VN ghi bì lợn 118 kcal, mỡ 2.7 g — không giống bì thực tế (da + mỡ); nghi là bì đã luộc/lọc mỡ.
- **Thịt bò khô** (`bo-kho-tho`): Bảng VN 239 kcal/100g trong khi bò khô tẩm đường ngoài chợ ~400; chưa có nguồn thứ 2 để chốt.
- **Cá hồi phi lê nuôi (sống)** (`ca-hoi-song-vn`): Trùng với món cá hồi (sống) đã có trong bảng gốc (id ca-hoi).
- **Tôm biển (luộc, đã chín)** (`tom-bien-luoc`): Bảng VN luộc 82 kcal thấp hơn cả tôm nướng 124 — nghi lấy theo tôm sống; bảng đã có "Tôm (luộc/hấp, đã chín)".
- **Tôm đồng (luộc, đã chín)** (`tom-dong-luoc`): Như tôm biển luộc.
- **Mực (hấp, đã chín)** (`muc-hap`): Bảng VN hấp/nướng đều 115 kcal, thấp hơn mực chín của USDA (175) — chưa có nguồn thứ 2.
- **Mực (nướng, đã chín)** (`muc-nuong`): Như mực hấp.
- **Sò huyết (luộc, bỏ vỏ)** (`so-huyet-luoc`): Bảng VN ghi 316 kcal / 54 g đạm cho sò huyết luộc — vô lý với thịt sò (nghi tính theo khô).
- **Sò điệp (nướng, bỏ vỏ)** (`so-diep-nuong`): Bảng VN "nướng" 69 kcal bằng mức sò điệp sống (USDA sống 69, hấp 111) — nghi sai trạng thái.
- **Ốc bươu (luộc, bỏ vỏ)** (`oc-buou-luoc`): Bảng VN ghi 336 kcal / 44 g đạm cho ốc luộc — nghi tính theo khô.
- **Ốc nhồi (hấp, bỏ vỏ)** (`oc-nhoi-hap`): Bảng VN ghi 337 kcal / 47.6 g đạm cho ốc hấp — nghi tính theo khô.
- **Hến (sống, bỏ vỏ)** (`hen-song`): Bảng VN ghi 4.5 g đạm / 100g hến — quá thấp, nghi tính cả nước/vỏ.


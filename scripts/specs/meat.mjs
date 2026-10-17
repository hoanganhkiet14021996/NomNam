// Spec nhóm thịt / gia cầm / cá / hải sản / trứng cho scripts/foods-bulk.mjs
// usda/mv: regex (hoặc id chính xác) trên tên tiếng Anh; vn: mã Bảng VN (Viện Dinh dưỡng) hoặc regex tên Việt.
export const meta = { out: 'meat', exportName: 'MEAT_FOODS', title: 'Thịt, gia cầm, cá, hải sản, trứng (nhập hàng loạt từ USDA, Matvaretabellen, Bảng VN)' }

const sv = (...a) => a.map(([l, g]) => [l, g])
const E = (id, name, emoji, o) => ({ id, name, emoji, cat: 'protein', ...o })

export default [
  // ── Heo ──
  E('heo-nac-dui-song', 'Thịt heo nạc đùi / mông (sống)', '🥩', {
    usda: ['^Pork, fresh, leg \\(ham\\), rump half, separable lean only, raw'], vn: ['7084'],
    servings: sv(['200g', 200]), aliases: ['nac dui heo', 'nac mong heo', 'thit heo nac song', 'thit nac'],
  }),
  E('heo-thang-song', 'Thịt heo thăn (sống)', '🥩', {
    usda: ['^Pork, fresh, loin, tenderloin, separable lean only, raw'], mv: ['^Pork, tenderloin, raw'], vn: ['7085'],
    servings: sv(['200g', 200]), aliases: ['thit thang heo', 'than heo song', 'pork tenderloin'],
  }),
  E('heo-thang-mo-chin', 'Thịt heo thăn lẫn mỡ (nướng, đã chín)', '🥩', {
    usda: ['167821'], servings: sv(['100g', 100], ['150g', 150]), aliases: ['than heo co mo', 'pork loin'],
  }),
  E('heo-nua-nac-nua-mo-song', 'Thịt heo nửa nạc nửa mỡ (sống)', '🥓', {
    usda: ['^Pork, fresh, shoulder, whole, separable lean and fat, raw'], vn: ['7018'],
    servings: sv(['100g', 100], ['200g', 200]), aliases: ['thit nua nac nua mo', 'thit heo 3 chi', 'thit heo song'],
  }),
  E('heo-xay-song', 'Thịt heo xay (84% nạc, sống)', '🥩', {
    usda: ['^Pork, ground, 84% lean / 16% fat, raw'],
    servings: sv(['100g', 100], ['200g', 200]), aliases: ['thit heo bam', 'heo bam', 'thit xay', 'ground pork'],
  }),
  E('heo-xay-chin', 'Thịt heo xay (84% nạc, xào/áp chảo, đã chín)', '🥩', {
    usda: ['^Pork, ground, 84% lean / 16% fat, cooked, crumbles'],
    servings: sv(['100g', 100], ['150g', 150]), aliases: ['heo xay chin', 'thit bam xao', 'ground pork cooked'],
  }),
  E('suon-non-song', 'Sườn non heo (sống, cả xương)', '🍖', {
    usda: ['^Pork, fresh, backribs, separable lean and fat, raw'], vn: ['7053'],
    servings: sv(['200g', 200]), aliases: ['suon non', 'suon heo song', 'pork ribs raw'],
  }),
  E('suon-non-chin', 'Sườn non heo (nướng, đã chín, bỏ xương)', '🍖', {
    usda: ['^Pork, fresh, backribs, separable lean and fat, cooked, roasted'],
    servings: sv(['100g', 100], ['150g', 150]), aliases: ['suon non nuong', 'suon om', 'pork ribs'],
  }),
  E('da-heo-song', 'Bì / da heo (sống)', '🥓', {
    skip: 'Bảng VN ghi bì lợn 118 kcal, mỡ 2.7 g — không giống bì thực tế (da + mỡ); nghi là bì đã luộc/lọc mỡ.',
    vn: ['7031'], servings: sv(['50g', 50]), aliases: ['bi heo', 'bi lon', 'da lon', 'pork skin'],
  }),
  E('cha-lua-gio-bo', 'Giò bò (chín)', '🍢', {
    vn: ['7068'], servings: sv(['100g', 100], ['3 lát', 60]), aliases: ['gio bo', 'cha bo', 'gio bo chin'],
  }),
  E('cha-que', 'Chả quế heo', '🍢', {
    vn: ['7065'], servings: sv(['3 lát', 60], ['100g', 100]), aliases: ['cha que', 'cha que heo'],
  }),
  E('xa-xiu-thit', 'Thịt xá xíu', '🍖', {
    vn: ['7142'], servings: sv(['100g', 100], ['5 lát', 80]), aliases: ['xa xiu', 'char siu', 'thit xa xiu'],
  }),
  // ── Bò ──
  E('bo-xay-80-song', 'Bò xay 80/20 (sống)', '🥩', {
    usda: ['^Beef, ground, 80% lean meat / 20% fat, raw', '2514744'],
    servings: sv(['100g', 100], ['200g', 200]), aliases: ['bo bam 80', 'bo xay', 'ground beef 80/20', 'thit bo xay'],
  }),
  E('bo-xay-80-chin', 'Bò xay 80/20 (áp chảo, đã chín)', '🥩', {
    usda: ['^Beef, ground, 80% lean meat / 20% fat, patty, cooked, pan-broiled', '^Beef, ground, 80% lean meat / 20% fat, crumbles, cooked, pan-browned'],
    servings: sv(['100g', 100], ['150g', 150]), aliases: ['bo bam chin', 'bo xay chin', 'hamburger patty'],
  }),
  E('bo-xay-85-song', 'Bò xay 85/15 (sống)', '🥩', {
    usda: ['^Beef, ground, 85% lean meat / 15% fat, raw'], servings: sv(['100g', 100], ['200g', 200]), aliases: ['bo bam 85', 'ground beef 85/15'],
  }),
  E('bo-xay-85-chin', 'Bò xay 85/15 (áp chảo, đã chín)', '🥩', {
    usda: ['^Beef, ground, 85% lean meat / 15% fat, patty, cooked, pan-broiled'], servings: sv(['100g', 100], ['150g', 150]), aliases: ['bo bam 85 chin'],
  }),
  E('bo-xay-90-song', 'Bò xay 90/10 (sống)', '🥩', {
    usda: ['^Beef, ground, 90% lean meat / 10% fat, raw'], servings: sv(['100g', 100], ['200g', 200]), aliases: ['bo bam 90', 'ground beef 90/10'],
  }),
  E('bo-xay-95-song', 'Bò xay 95/5 (sống)', '🥩', {
    usda: ['^Beef, ground, 95% lean meat / 5% fat, raw'], servings: sv(['100g', 100], ['200g', 200]), aliases: ['bo bam 95', 'bo xay nac', 'ground beef 95/5'],
  }),
  E('bo-xay-95-chin', 'Bò xay 95/5 (áp chảo, đã chín)', '🥩', {
    usda: ['^Beef, ground, 95% lean meat / 5% fat, patty, cooked, pan-broiled'], servings: sv(['100g', 100], ['150g', 150]), aliases: ['bo bam 95 chin', 'bo xay nac chin'],
  }),
  E('bo-loai-1-song', 'Thịt bò loại I – bắp/đùi nạc (sống)', '🥩', {
    vn: ['7003'], usda: ['171758', '171757'],
    servings: sv(['100g', 100], ['200g', 200]), aliases: ['bo loai 1', 'bap bo song', 'dui bo song', 'thit bo song'],
  }),
  E('bo-thang-ngoai-song', 'Thăn ngoại bò (sirloin, nạc, sống)', '🥩', {
    usda: ['171804', '^Beef, top sirloin, steak, separable lean only, trimmed to 1/8" fat, choice, raw'],
    servings: sv(['200g', 200]), aliases: ['sirloin song', 'than ngoai bo', 'bo thang ngoai'],
  }),
  E('bo-thang-noi-song', 'Thăn nội bò (phi lê, lẫn mỡ viền, sống)', '🥩', {
    usda: ['169542', '169545'],
    servings: sv(['200g', 200]), aliases: ['philê bo song', 'than noi bo', 'tenderloin', 'filet mignon song'],
  }),
  E('bo-ribeye-song', 'Bò ribeye (lẫn mỡ, sống)', '🥩', {
    usda: ['168612'],
    servings: sv(['200g', 200], ['250g', 250]), aliases: ['ribeye', 'rib eye', 'bo lung', 'bit tet ribeye'],
  }),
  E('bo-ribeye-chin', 'Bò ribeye (nướng, lẫn mỡ, đã chín)', '🥩', {
    usda: ['169436'], mv: ['^Beef, rib-eye steak, roasted without fat'],
    servings: sv(['150g', 150], ['200g', 200]), aliases: ['ribeye nuong', 'ribeye chin', 'steak ribeye'],
  }),
  E('bo-tbone-chin', 'Bò T-bone (nướng, lẫn mỡ, đã chín, bỏ xương)', '🥩', {
    usda: ['169464', '169465'],
    servings: sv(['150g', 150], ['200g', 200]), aliases: ['t-bone', 'tbone', 'steak t bone'],
  }),
  E('bo-dui-nac-chin', 'Bò đùi nạc (nướng/áp chảo, đã chín)', '🥩', {
    usda: ['^Beef, round, top round steak, boneless, separable lean only, trimmed to 0" fat, all grades, cooked, grilled'],
    servings: sv(['100g', 100], ['150g', 150]), aliases: ['bo dui', 'bo nac chin', 'top round', 'bo xao nac'],
  }),
  E('bo-ba-chi-my-song', 'Bò skirt / ba chỉ bò Mỹ (lẫn mỡ, sống)', '🥓', {
    usda: ['172158'],
    servings: sv(['100g', 100], ['200g', 200]), aliases: ['ba chi bo', 'ba chi bo my', 'bo cuon lau', 'beef belly', 'short plate', 'skirt steak'],
  }),
  E('bo-nam-song', 'Nạm bò (nạc, sống)', '🥩', {
    usda: ['168656', '168657'],
    servings: sv(['200g', 200]), aliases: ['nam bo', 'bo nam song', 'brisket song'],
  }),
  E('bo-bap-song', 'Bắp bò (sống)', '🥩', {
    vn: ['7094'], usda: ['169441'],
    servings: sv(['200g', 200]), aliases: ['bap bo', 'bap hoa', 'bo bap song', 'beef shank'],
  }),
  E('bo-ngau-song', 'Gầu bò (sống)', '🥩', {
    usda: ['^Beef, brisket, whole, separable lean and fat, trimmed to 1/8" fat, all grades, raw'], servings: sv(['200g', 200]), aliases: ['gau bo', 'bo gau song', 'brisket point song'],
  }),
  E('bo-kho-tho', 'Thịt bò khô', '🥓', {
    skip: 'Bảng VN 239 kcal/100g trong khi bò khô tẩm đường ngoài chợ ~400; chưa có nguồn thứ 2 để chốt.',
    vn: ['7075'], servings: sv(['1 gói nhỏ', 30], ['100g', 100]), aliases: ['bo kho', 'beef jerky', 'kho bo'],
  }),
  E('xuc-xich-bo', 'Xúc xích bò', '🌭', {
    vn: ['7143'], servings: sv(['1 cây', 50], ['100g', 100]), aliases: ['xuc xich bo', 'beef sausage', 'hot dog bo'],
  }),
  // ── Gà / vịt ──
  E('ga-ta-song', 'Thịt gà ta (sống, cả da)', '🍗', {
    vn: ['7013'], usda: ['^Chicken, broilers or fryers, meat and skin, raw'], servings: sv(['200g', 200]), aliases: ['ga ta', 'ga ta song', 'ga so song'],
  }),
  E('ga-cong-nghiep-dui-song', 'Đùi gà công nghiệp (sống, bỏ da)', '🍗', {
    vn: ['7088'], usda: ['173627', '173614'],
    servings: sv(['1 cái', 120], ['200g', 200]), aliases: ['dui ga song', 'dui ga cong nghiep', 'chicken thigh raw'],
  }),
  E('ga-canh-song', 'Cánh gà (sống, cả da)', '🍗', {
    vn: ['7087'], usda: ['^Chicken, broilers or fryers, wing, meat and skin, raw'], servings: sv(['1 cánh', 60], ['200g', 200]), aliases: ['canh ga song', 'chicken wing raw'],
  }),
  E('ga-canh-luoc', 'Cánh gà (luộc, đã chín, cả da, bỏ xương)', '🍗', {
    vn: ['7087002'], usda: ['^Chicken, broilers or fryers, wing, meat and skin, cooked, roasted'], servings: sv(['1 cánh', 40], ['100g', 100]), aliases: ['canh ga luoc', 'chicken wing cooked'],
  }),
  E('ga-dui-luoc', 'Đùi gà (luộc, đã chín, cả da, bỏ xương)', '🍗', {
    vn: ['7088002'], usda: ['^Chicken, broilers or fryers, drumstick, meat and skin, cooked, roasted'], servings: sv(['1 cái', 80], ['100g', 100]), aliases: ['dui ga luoc'],
  }),
  E('ga-ta-dui-luoc', 'Đùi gà ta (luộc, đã chín)', '🍗', {
    vn: ['7105002'], servings: sv(['1 cái', 100], ['100g', 100]), aliases: ['dui ga ta luoc', 'ga ta luoc dui'],
  }),
  E('ga-ta-luom-luoc', 'Lườn gà ta (luộc, đã chín)', '🍗', {
    vn: ['7106002'], servings: sv(['1 miếng', 120], ['100g', 100]), aliases: ['luon ga ta luoc', 'uc ga ta luoc'],
  }),
  E('ga-xay-song', 'Gà xay (sống)', '🍗', {
    usda: ['^Chicken, ground, raw'], servings: sv(['100g', 100], ['200g', 200]), aliases: ['ga bam', 'thit ga xay', 'ground chicken'],
  }),
  E('ga-xay-chin', 'Gà xay (xào/áp chảo, đã chín)', '🍗', {
    usda: ['^Chicken, ground, crumbles, cooked, pan-browned'], servings: sv(['100g', 100], ['150g', 150]), aliases: ['ga bam chin', 'ground chicken cooked'],
  }),
  E('vit-song', 'Thịt vịt (sống)', '🦆', {
    vn: ['7028'], servings: sv(['200g', 200]), aliases: ['vit song', 'thit vit'],
  }),
  E('vit-luoc', 'Thịt vịt (luộc, đã chín)', '🦆', {
    vn: ['7028002'], servings: sv(['100g', 100], ['150g', 150]), aliases: ['vit luoc', 'thit vit luoc'],
  }),
  E('vit-luon-luoc', 'Lườn vịt (luộc, đã chín)', '🦆', {
    vn: ['7113002'], servings: sv(['1 miếng', 100], ['100g', 100]), aliases: ['luon vit luoc', 'uc vit luoc'],
  }),
  E('ngan-luoc', 'Thịt ngan (luộc, đã chín)', '🦆', {
    vn: ['7090002'], servings: sv(['100g', 100], ['150g', 150]), aliases: ['ngan luoc', 'thit ngan'],
  }),
  E('tim-ga-luoc', 'Tim gà (luộc, đã chín)', '🍗', {
    vn: ['7056002'], usda: ['171059'], servings: sv(['100g', 100]), aliases: ['tim ga', 'tim ga luoc'],
  }),
  // ── Bồ câu / thỏ / ếch ──
  E('thit-tho', 'Thịt thỏ (sống)', '🐇', {
    vn: ['7021'], usda: ['^Game meat, rabbit, domesticated, composite of cuts, raw'], servings: sv(['200g', 200]), aliases: ['tho', 'rabbit'],
  }),
  E('ech-dui', 'Ếch (thịt đùi, sống)', '🐸', {
    vn: ['7080'], servings: sv(['100g', 100], ['200g', 200]), aliases: ['ech', 'thit ech', 'dui ech'],
  }),
  // ── Cá VN (Bảng VN + USDA/MV tương đương) ──
  E('ca-chep-song', 'Cá chép (sống)', '🐟', {
    vn: ['8003'], usda: ['^Fish, carp, raw'], servings: sv(['200g', 200]), aliases: ['ca chep song', 'carp'],
  }),
  E('ca-loc-song', 'Cá lóc / cá quả (sống)', '🐟', {
    vn: ['8022'], servings: sv(['200g', 200]), aliases: ['ca loc song', 'ca qua', 'snakehead'],
  }),
  E('ca-ro-dong-song', 'Cá rô đồng (sống)', '🐟', {
    vn: ['8023'], servings: sv(['100g', 100], ['1 con', 120]), aliases: ['ca ro', 'ca ro dong', 'ca ro song'],
  }),
  E('ca-ro-phi-song', 'Cá rô phi / điêu hồng (sống)', '🐟', {
    vn: ['8024', '8062'], usda: ['^Fish, tilapia, raw'], servings: sv(['200g', 200]), aliases: ['ca ro phi song', 'ca dieu hong song', 'tilapia raw'],
  }),
  E('ca-ro-phi-chien', 'Cá rô phi (chiên giòn, đã chín)', '🐟', {
    vn: ['8024008'], servings: sv(['1 miếng', 100], ['100g', 100]), aliases: ['ca ro phi chien', 'ca dieu hong chien'],
  }),
  E('ca-tre-song', 'Cá trê (sống)', '🐟', {
    vn: ['8030'], servings: sv(['200g', 200]), aliases: ['ca tre', 'ca tre song', 'catfish'],
  }),
  E('ca-nuc-song', 'Cá nục (sống)', '🐟', {
    vn: ['8020'], servings: sv(['100g', 100], ['1 con', 90]), aliases: ['ca nuc song'],
  }),
  E('ca-nuc-luoc', 'Cá nục (luộc, đã chín)', '🐟', {
    vn: ['8020002'], servings: sv(['100g', 100], ['1 con', 80]), aliases: ['ca nuc luoc'],
  }),
  E('ca-nuc-nuong', 'Cá nục (nướng, đã chín)', '🐟', {
    vn: ['8020014'], servings: sv(['100g', 100], ['1 con', 80]), aliases: ['ca nuc nuong'],
  }),
  E('ca-ngu-song', 'Cá ngừ (sống)', '🐟', {
    vn: ['8019'], usda: ['^Fish, tuna, fresh, yellowfin, raw'], mv: ['^Tuna, raw'], servings: sv(['150g', 150], ['200g', 200]), aliases: ['ca ngu song', 'tuna raw', 'sashimi ca ngu'],
  }),
  E('ca-hoi-song-vn', 'Cá hồi phi lê nuôi (sống)', '🍣', {
    skip: 'Trùng với món cá hồi (sống) đã có trong bảng gốc (id ca-hoi).',
    usda: ['^Fish, salmon, Atlantic, farmed, raw'], mv: ['^Salmon, farmed, raw'], servings: sv(['150g', 150], ['200g', 200]), aliases: ['ca hoi song', 'salmon raw', 'sashimi ca hoi'],
  }),
  E('ca-chim-song', 'Cá chim (sống)', '🐟', {
    vn: ['8060'], usda: ['^Fish, pompano, florida, raw'], servings: sv(['200g', 200]), aliases: ['ca chim', 'ca chim trang', 'pomfret'],
  }),
  E('ca-phen-song', 'Cá phèn (sống)', '🐟', {
    vn: ['8021'], servings: sv(['100g', 100]), aliases: ['ca phen', 'goatfish'],
  }),
  E('ca-trich-song', 'Cá trích (sống)', '🐟', {
    vn: ['8031'], usda: ['^Fish, herring, Atlantic, raw'], mv: ['^Herring, raw'], servings: sv(['100g', 100]), aliases: ['ca trich', 'herring'],
  }),
  E('ca-doi-song', 'Cá đối (sống)', '🐟', {
    vn: ['8009'], usda: ['^Fish, mullet, striped, raw'], servings: sv(['100g', 100]), aliases: ['ca doi', 'mullet'],
  }),
  E('ca-bong-song', 'Cá bống (sống)', '🐟', {
    vn: ['8001'], servings: sv(['100g', 100]), aliases: ['ca bong', 'ca bong song'],
  }),
  E('ca-lac-luoc', 'Cá lác (luộc, đã chín)', '🐟', {
    vn: ['8013002'], servings: sv(['100g', 100]), aliases: ['ca lac luoc', 'ca thac lac luoc'],
  }),
  E('ca-lac-chien', 'Cá lác (chiên giòn, đã chín)', '🐟', {
    vn: ['8013008'], servings: sv(['100g', 100]), aliases: ['ca lac chien', 'ca thac lac chien'],
  }),
  E('ca-trach-song', 'Cá trạch / cá chạch (sống)', '🐟', {
    vn: ['8028'], servings: sv(['100g', 100]), aliases: ['ca trach', 'ca chach'],
  }),
  E('ca-diec-song', 'Cá diếc (sống)', '🐟', {
    vn: ['8006'], servings: sv(['100g', 100]), aliases: ['ca diec'],
  }),
  E('ca-me-song', 'Cá mè (sống)', '🐟', {
    vn: ['8014'], servings: sv(['100g', 100]), aliases: ['ca me'],
  }),
  E('ca-tram-co-song', 'Cá trắm cỏ (sống)', '🐟', {
    vn: ['8029'], usda: ['^Fish, carp, raw'], servings: sv(['200g', 200]), aliases: ['ca tram', 'ca tram co', 'grass carp'],
  }),
  E('ca-kho-song', 'Cá khô (chim, thu, nụ, đé – sống)', '🐟', {
    vn: ['8012'], servings: sv(['30g', 30], ['100g', 100]), aliases: ['ca kho', 'kho ca', 'dried fish'],
  }),
  E('ca-basa-chien-cha', 'Chả cá basa (rán)', '🍥', {
    vn: ['8064008'], servings: sv(['1 miếng', 40], ['100g', 100]), aliases: ['cha ca basa chien', 'cha ca basa ran'],
  }),
  // ── Tôm / mực / cua / ốc / sò ──
  E('tom-bien-luoc', 'Tôm biển (luộc, đã chín)', '🦐', {
    skip: 'Bảng VN luộc 82 kcal thấp hơn cả tôm nướng 124 — nghi lấy theo tôm sống; bảng đã có "Tôm (luộc/hấp, đã chín)".',
    vn: ['8051002'], servings: sv(['100g', 100], ['5 con vừa', 75]), aliases: ['tom bien luoc', 'tom luoc vn'],
  }),
  E('tom-bien-nuong', 'Tôm biển (nướng, đã chín)', '🦐', {
    vn: ['8051014'], servings: sv(['100g', 100]), aliases: ['tom bien nuong', 'tom nuong'],
  }),
  E('tom-dong-luoc', 'Tôm đồng (luộc, đã chín)', '🦐', {
    skip: 'Như tôm biển luộc.',
    vn: ['8052002'], servings: sv(['100g', 100]), aliases: ['tom dong luoc', 'tom dong'],
  }),
  E('tom-kho', 'Tôm khô (biển)', '🦐', {
    vn: ['8053'], servings: sv(['1 nắm', 20], ['100g', 100]), aliases: ['tom kho', 'dried shrimp'],
  }),
  E('tep-kho', 'Tép khô', '🦐', {
    vn: ['8050'], servings: sv(['1 nắm', 15]), aliases: ['tep kho', 'tep'],
  }),
  E('muc-hap', 'Mực (hấp, đã chín)', '🦑', {
    skip: 'Bảng VN hấp/nướng đều 115 kcal, thấp hơn mực chín của USDA (175) — chưa có nguồn thứ 2.',
    vn: ['8040003'], servings: sv(['100g', 100], ['1 con vừa', 150]), aliases: ['muc hap', 'muc luoc'],
  }),
  E('muc-nuong', 'Mực (nướng, đã chín)', '🦑', {
    skip: 'Như mực hấp.',
    vn: ['8040014'], servings: sv(['100g', 100], ['1 con vừa', 120]), aliases: ['muc nuong', 'grilled squid'],
  }),
  E('muc-kho', 'Mực khô (sống)', '🦑', {
    vn: ['8039'], servings: sv(['1 con', 40], ['100g', 100]), aliases: ['muc kho', 'dried squid'],
  }),
  E('so-huyet-luoc', 'Sò huyết (luộc, bỏ vỏ)', '🐚', {
    skip: 'Bảng VN ghi 316 kcal / 54 g đạm cho sò huyết luộc — vô lý với thịt sò (nghi tính theo khô).',
    vn: ['8070002'], servings: sv(['100g', 100], ['1 phần', 150]), aliases: ['so huyet', 'so huyet luoc', 'blood cockle'],
  }),
  E('so-diep-nuong', 'Sò điệp (nướng, bỏ vỏ)', '🐚', {
    skip: 'Bảng VN "nướng" 69 kcal bằng mức sò điệp sống (USDA sống 69, hấp 111) — nghi sai trạng thái.',
    vn: ['8080014'], servings: sv(['100g', 100], ['5 con', 100]), aliases: ['so diep', 'so diep nuong', 'scallop'],
  }),
  E('oc-buou-luoc', 'Ốc bươu (luộc, bỏ vỏ)', '🐚', {
    skip: 'Bảng VN ghi 336 kcal / 44 g đạm cho ốc luộc — nghi tính theo khô.',
    vn: ['8041002'], servings: sv(['100g', 100]), aliases: ['oc buou', 'oc buou luoc'],
  }),
  E('oc-nhoi-hap', 'Ốc nhồi (hấp, bỏ vỏ)', '🐚', {
    skip: 'Bảng VN ghi 337 kcal / 47.6 g đạm cho ốc hấp — nghi tính theo khô.',
    vn: ['8043003'], servings: sv(['100g', 100]), aliases: ['oc nhoi', 'oc nhoi hap'],
  }),
  E('hen-song', 'Hến (sống, bỏ vỏ)', '🐚', {
    skip: 'Bảng VN ghi 4.5 g đạm / 100g hến — quá thấp, nghi tính cả nước/vỏ.',
    vn: ['8037'], servings: sv(['100g', 100]), aliases: ['hen', 'com hen'],
  }),
  E('cua-bien-song', 'Cua biển (sống, lấy thịt)', '🦀', {
    vn: ['8033', '8069'], usda: ['^Crustaceans, crab, blue, raw'], servings: sv(['100g', 100]), aliases: ['cua bien', 'cua song', 'crab raw'],
  }),
  E('cua-dong-song', 'Cua đồng (sống)', '🦀', {
    vn: ['8034'], servings: sv(['100g', 100]), aliases: ['cua dong', 'rieu cua'],
  }),
  // ── Trứng ──
  E('trung-vit-song', 'Trứng vịt (sống, cả quả)', '🥚', {
    usda: ['172189'], vn: ['9004'], servings: sv(['1 quả', 70]), aliases: ['trung vit', 'duck egg'],
  }),
  E('trung-cut-song', 'Trứng cút (sống, cả quả)', '🥚', {
    usda: ['172191'], vn: ['9007'], servings: sv(['5 quả', 45], ['10 quả', 90]), aliases: ['trung cut song', 'quail egg raw'],
  }),
  E('trung-ga-ta-song', 'Trứng gà ta (sống, cả quả)', '🥚', {
    vn: ['9001'], servings: sv(['1 quả', 45]), aliases: ['trung ga ta', 'trung ga que'],
  }),
  E('trung-ga-cong-nghiep-song', 'Trứng gà công nghiệp (sống, cả quả)', '🥚', {
    vn: ['9012'], servings: sv(['1 quả', 55]), aliases: ['trung ga cong nghiep', 'trung ga trang'],
  }),
  E('long-do-trung-vit', 'Lòng đỏ trứng vịt', '🥚', {
    vn: ['9005'], servings: sv(['1 lòng đỏ', 20]), aliases: ['long do vit'],
  }),
]

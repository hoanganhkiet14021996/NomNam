import type { Food } from '@/types'
import { dish, food, s } from '../foodHelpers'

/** Món Việt: bún, phở, mì, cháo, xôi, bánh, ăn vặt. Nguồn từng món: docs/food-research/vn-noodle.md */
export const VN_NOODLE_FOODS: Food[] = [
  // ── Phở / bún / hủ tiếu / mì nước ─────────────────
  dish('pho-bo-dac-biet', 'Phở bò đặc biệt', '🍜', '1 tô lớn', 665, [589, 40.8, 72, 15.2, 0.9], ['pho dac biet', 'pho tai nam gau', 'pho tai nam', 'pho bo vien', 'pho bo to lon']),
  dish('pho-xao', 'Phở xào bò', '🍝', '1 đĩa', 410, [584, 26.3, 78.9, 18.7, 2.4], ['pho xao', 'pho xao bo', 'hu tieu xao', 'hu tieu xao bo']),
  dish('pho-cuon', 'Phở cuốn (1 cuốn)', '🌯', '1 cuốn', 55, [81, 4.4, 10.2, 2.5, 0.2], ['pho cuon', 'pho cuon ha noi']),
  dish('pho-ga-tron', 'Phở gà trộn', '🍜', '1 tô', 370, [583, 29, 80.8, 16.2, 1.9], ['pho tron', 'pho ga tron', 'pho kho ga']),
  dish('bun-mam', 'Bún mắm', '🍜', '1 tô', 690, [545, 41.8, 62.3, 14.2, 2.6], ['bun mam', 'bun mam mien tay', 'bun mam soc trang']),
  dish('bun-ca', 'Bún cá (cá chiên, chả cá)', '🍜', '1 tô', 650, [420, 22.7, 59, 10.6, 1.8], ['bun ca', 'bun ca ro dong', 'bun ca hai phong']),
  dish('bun-mang-vit', 'Bún măng vịt', '🦆', '1 tô', 700, [604, 24.9, 58.5, 29.9, 2.1], ['bun mang vit', 'bun vit', 'bun mang']),
  dish('bun-moc', 'Bún mọc', '🍜', '1 tô', 610, [414, 22.8, 56.6, 11.1, 1.3], ['bun moc', 'bun moc suon']),
  dish('bun-cha-ca', 'Bún chả cá', '🍜', '1 tô', 650, [412, 15.6, 62.8, 11.2, 1.9], ['bun cha ca', 'bun cha ca da nang', 'bun cha ca nha trang']),
  dish('bun-oc', 'Bún ốc', '🐌', '1 tô', 670, [430, 25.6, 61.4, 9.9, 3.2], ['bun oc', 'bun oc ha noi']),
  dish('bun-thang', 'Bún thang', '🍜', '1 tô', 535, [330, 24.2, 40.8, 7.7, 0.9], ['bun thang', 'bun thang ha noi']),
  dish('hu-tieu-kho', 'Hủ tiếu khô (kèm chén nước lèo)', '🍜', '1 phần', 550, [547, 33.1, 72.7, 14, 1.3], ['hu tieu kho', 'hu tieu nam vang kho', 'hu tieu tron']),
  dish('hu-tieu-go', 'Hủ tiếu gõ', '🍜', '1 tô', 435, [366, 18.9, 50.5, 10.3, 1.2], ['hu tieu go', 'hu tieu xe']),
  dish('hu-tieu-bo-kho', 'Hủ tiếu bò kho', '🍲', '1 tô', 540, [626, 36.4, 72.9, 21.1, 3.1], ['hu tieu bo kho', 'bo kho hu tieu']),
  dish('mi-hoanh-thanh', 'Mì hoành thánh (mì vằn thắn)', '🍜', '1 tô', 550, [520, 29.8, 59.5, 17.6, 3.1], ['mi hoanh thanh', 'mi van than', 'hoanh thanh', 'van than', 'wonton noodle']),
  dish('mi-vit-tiem', 'Mì vịt tiềm', '🦆', '1 tô', 605, [710, 33, 53.7, 39.7, 3.2], ['mi vit tiem', 'vit tiem']),
  dish('mi-goi-trung', 'Mì gói nấu trứng (1 gói + 1 trứng)', '🍜', '1 tô', 455, [421, 13.5, 46.6, 19.6, 2], ['mi goi trung', 'mi tom trung', 'mi tom nau trung', 'mi goi nau']),
  dish('banh-canh-cua', 'Bánh canh cua', '🦀', '1 tô', 645, [578, 28.4, 85.5, 13.7, 1], ['banh canh cua']),
  dish('banh-canh-gio-heo', 'Bánh canh giò heo', '🍜', '1 tô', 605, [597, 27.1, 75.3, 20.4, 1.1], ['banh canh gio heo', 'banh canh gio', 'banh canh trang bang']),
  dish('banh-canh-cha-ca', 'Bánh canh chả cá', '🍜', '1 tô', 590, [467, 13.7, 77.4, 11.3, 1.1], ['banh canh cha ca', 'banh canh ca']),
  dish('mien-luon', 'Miến lươn', '🍜', '1 tô', 580, [427, 16.6, 49.1, 18.3, 1.4], ['mien luon', 'mien luon nuoc']),
  dish('banh-da-cua', 'Bánh đa cua', '🦀', '1 tô', 635, [458, 17.5, 63.2, 14.1, 1.8], ['banh da cua', 'banh da do', 'banh da cua hai phong']),

  // ── Bún / mì / hủ tiếu khô, xào, trộn ─────────────
  dish('bun-bo-xao', 'Bún bò xào (bún bò Nam Bộ)', '🥢', '1 tô', 445, [543, 28.4, 62.9, 20.7, 3.4], ['bun bo nam bo', 'bun bo xao', 'bun tron bo']),
  dish('bun-thit-nuong-cha-gio', 'Bún thịt nướng chả giò', '🥢', '1 tô', 455, [724, 32, 71.5, 35, 3.1], ['bun thit nuong cha gio', 'bun cha gio', 'bun nem']),
  dish('banh-hoi-thit-nuong', 'Bánh hỏi thịt nướng', '🥢', '1 phần', 375, [532, 26.3, 54.1, 23.7, 2.2], ['banh hoi thit nuong', 'banh hoi']),
  dish('bun-xao', 'Bún xào (thịt bò, rau)', '🍝', '1 đĩa', 430, [493, 19.2, 70, 15.4, 3.1], ['bun xao', 'bun xao bo', 'bun xao thit']),
  dish('mi-xao-gion', 'Mì xào giòn hải sản', '🍝', '1 đĩa', 375, [609, 31.2, 62.9, 26.1, 4.5], ['mi xao gion', 'mi xao gion hai san', 'mi xao don']),
  dish('nui-xao-bo', 'Nui xào bò', '🍝', '1 đĩa', 355, [577, 28.6, 75.6, 17.4, 4.7], ['nui xao bo', 'nui xao']),
  dish('cao-lau', 'Cao lầu', '🍜', '1 tô', 355, [501, 21.2, 72.3, 14.7, 1.9], ['cao lau', 'cao lau hoi an']),

  // ── Cháo ──────────────────────────────────────────
  dish('chao-vit', 'Cháo vịt', '🦆', '1 tô', 460, [418, 18.7, 32.8, 23.1, 0.3], ['chao vit']),
  dish('yen-mach-sua', 'Yến mạch nấu sữa tươi không đường', '🥣', '1 chén', 240, [278, 13, 36, 9.4, 4.2], ['chao yen mach', 'yen mach nau sua', 'oatmeal', 'oat sua']),

  // ── Xôi ───────────────────────────────────────────
  dish('xoi-xeo', 'Xôi xéo', '🍙', '1 gói', 235, [458, 10.2, 79.1, 10.9, 4.1], ['xoi xeo ha noi', 'xoi dau xanh hanh phi']),
  dish('xoi-dau-xanh', 'Xôi đậu xanh (dừa, muối mè)', '🍙', '1 gói', 215, [423, 10.4, 77.8, 8.2, 5.5], ['xoi dau xanh', 'xoi dau']),
  dish('xoi-lap-xuong', 'Xôi lạp xưởng', '🍙', '1 gói', 215, [473, 12.2, 68.6, 16.1, 1.6], ['xoi lap xuong']),
  dish('xoi-bap', 'Xôi bắp', '🌽', '1 gói', 235, [430, 10.8, 74.3, 11.2, 6.2], ['xoi bap', 'xoi ngo']),

  // ── Bánh Việt (theo phần) ─────────────────────────
  dish('banh-uot', 'Bánh ướt chả lụa', '🥟', '1 đĩa', 350, [386, 14.6, 58.5, 10.4, 2], ['banh uot', 'banh uot cha lua']),
  dish('banh-beo', 'Bánh bèo (đĩa ~10 chén)', '🥟', '1 đĩa', 245, [313, 11.2, 51.8, 6.4, 1], ['banh beo', 'banh beo hue', 'banh beo chen']),
  dish('banh-bot-loc', 'Bánh bột lọc (đĩa 10 cái)', '🥟', '1 đĩa', 255, [450, 11.4, 66.5, 15.2, 0.6], ['banh bot loc', 'banh bot loc la', 'banh loc']),
  dish('banh-khot', 'Bánh khọt (8 cái, kèm rau)', '🥞', '1 phần', 325, [514, 14.8, 57.9, 25.3, 2.8], ['banh khot', 'banh khot vung tau']),
  dish('banh-can', 'Bánh căn (6 cái, kèm nước chấm)', '🥞', '1 phần', 300, [465, 15.3, 66.2, 14.6, 1.7], ['banh can', 'banh can phan rang', 'banh can da lat']),
  dish('banh-bot-chien', 'Bột chiên trứng', '🍳', '1 đĩa', 285, [485, 10, 66.2, 20.3, 1.2], ['bot chien', 'banh bot chien', 'bot chien trung']),
  dish('banh-gio', 'Bánh giò', '🥟', '1 cái', 160, [216, 7.8, 21.2, 10.9, 1.9], ['banh gio']),
  dish('nem-nuong', 'Nem nướng cuốn (4 xiên, kèm rau, nước chấm)', '🌯', '1 phần', 365, [670, 26.3, 75.5, 29.3, 2.9], ['nem nuong', 'nem nuong nha trang', 'nem nuong ninh hoa', 'nem lui']),
  dish('banh-trang-cuon-thit-heo', 'Bánh tráng cuốn thịt heo (kèm rau, mắm nêm)', '🌯', '1 phần', 320, [521, 21.6, 52.8, 24.1, 2.2], ['banh trang cuon thit heo', 'banh trang phoi suong cuon thit', 'banh trang trang bang']),

  // ── Ăn vặt / chè ──────────────────────────────────
  dish('bo-bia', 'Bò bía (1 cuốn)', '🌯', '1 cuốn', 70, [143, 5.8, 13.5, 7.5, 2], ['bo bia', 'popiah'], 'snack'),
  dish('banh-trang-tron', 'Bánh tráng trộn', '🥗', '1 bịch', 165, [457, 17, 55.6, 19.4, 2.4], ['banh trang tron'], 'snack'),
  dish('banh-trang-nuong', 'Bánh tráng nướng (trứng gà, xúc xích)', '🍕', '1 cái', 105, [289, 11.4, 17.5, 19.1, 0.3], ['banh trang nuong', 'banh trang nuong da lat', 'pizza viet nam'], 'snack'),
  dish('bap-xao', 'Bắp xào (bơ, tôm khô)', '🌽', '1 ly', 145, [220, 8, 28.9, 10.2, 2.9], ['bap xao', 'ngo xao', 'bap xao bo'], 'snack'),
  dish('banh-cam', 'Bánh cam / bánh rán (1 cái)', '🍩', '1 cái', 55, [201, 3.4, 31, 7.1, 1.9], ['banh cam', 'banh ran', 'banh ran dau xanh'], 'snack'),
  dish('banh-mi-que', 'Bánh mì que pate (1 cây)', '🥖', '1 cây', 40, [102, 3.5, 13, 4.1, 0.6], ['banh mi que', 'banh mi que hai phong', 'banh mi que pate'], 'snack'),
  dish('che-dau-xanh', 'Chè đậu xanh (nước cốt dừa)', '🍧', '1 ly', 300, [306, 8.9, 55.9, 6.4, 6.3], ['che dau xanh', 'che dau xanh danh'], 'snack'),
  dish('che-dau-den', 'Chè đậu đen', '🍧', '1 ly', 300, [289, 8, 54.9, 5.3, 5.9], ['che dau den'], 'snack'),
  dish('che-thai', 'Chè Thái', '🍧', '1 ly', 340, [313, 5.5, 53.5, 10.3, 2], ['che thai', 'che thai sau rieng'], 'snack'),
  dish('che-ba-mau', 'Chè ba màu', '🍧', '1 ly', 330, [297, 7.3, 53, 7.4, 5.3], ['che ba mau'], 'snack'),
  dish('che-troi-nuoc', 'Chè trôi nước (3 viên)', '🍡', '1 chén', 230, [362, 7.3, 72.5, 5, 4.3], ['che troi nuoc', 'banh troi nuoc', 'che xoi nuoc'], 'snack'),
  dish('tau-hu-nuoc-duong', 'Tàu hũ nước đường (gừng)', '🍮', '1 chén', 300, [208, 13, 24.6, 7.3, 0.9], ['tau hu nuoc duong', 'tau hu nuoc duong gung', 'dau hu nuoc duong', 'tao pho', 'tofu pudding'], 'snack'),
  dish('sua-chua-nep-cam', 'Sữa chua nếp cẩm', '🍶', '1 ly', 185, [240, 6.1, 44.8, 4.2, 1.1], ['sua chua nep cam', 'yaourt nep cam'], 'snack'),

  // ── Bánh theo 100g ────────────────────────────────
  food('banh-chung', 'Bánh chưng', '🟩', 'dish', [181, 4.3, 31.6, 4.2, 1.5], [s('1 miếng (⅛ cái)', 125), s('¼ cái', 250)], ['banh chung', 'banh chung tet']),
  food('banh-tet', 'Bánh tét (đậu xanh, thịt mỡ)', '🟩', 'dish', [215, 7.5, 35, 5.3, 2], [s('1 khoanh', 100), s('2 khoanh', 200)], ['banh tet', 'banh tet nhan thit']),
  food('nem-chua', 'Nem chua', '🍖', 'snack', [151, 21.8, 3.6, 5.5, 0], [s('1 cái', 25), s('5 cái', 125)], ['nem chua', 'nem chua thanh hoa']),
]

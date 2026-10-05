import type { Food, FoodCategory, Serving } from '@/types'

/**
 * Bảng món ăn mặc định. Giá trị tham khảo từ Bảng thành phần thực phẩm Việt Nam (Viện Dinh dưỡng)
 * và USDA FoodData Central; món phức hợp là ước lượng theo khẩu phần phổ biến.
 * Nguyên liệu: số liệu trên 100g. Đồ uống: 100ml ≈ 100g.
 */

type N5 = [kcal: number, protein: number, carbs: number, fat: number, fiber: number]

function food(
  id: string,
  name: string,
  emoji: string,
  category: FoodCategory,
  [kcal, protein, carbs, fat, fiber]: N5,
  servings: Serving[] = [],
  aliases: string[] = [],
): Food {
  return {
    id,
    name,
    emoji,
    category,
    per100: { kcal, protein, carbs, fat, fiber },
    servings: [...servings, { label: '100g', grams: 100 }].filter(
      (s, i, arr) => arr.findIndex((x) => x.grams === s.grams && x.label === s.label) === i,
    ),
    defaultGrams: servings[0]?.grams ?? 100,
    aliases,
  }
}

/** Món phức hợp: nhập theo 1 phần ăn, tự quy ra trên 100g. */
function dish(
  id: string,
  name: string,
  emoji: string,
  serving: string,
  grams: number,
  [kcal, protein, carbs, fat, fiber]: N5,
  aliases: string[] = [],
  category: FoodCategory = 'dish',
): Food {
  const r = 100 / grams
  return {
    id,
    name,
    emoji,
    category,
    per100: { kcal: kcal * r, protein: protein * r, carbs: carbs * r, fat: fat * r, fiber: fiber * r },
    servings: [
      { label: serving, grams },
      { label: `½ ${serving.replace(/^1 /, '')}`, grams: Math.round(grams / 2) },
    ],
    defaultGrams: grams,
    aliases,
  }
}

const s = (label: string, grams: number): Serving => ({ label, grams })

export const FOODS: Food[] = [
  // ── Tinh bột ─────────────────────────────────────────
  food('com-trang', 'Cơm trắng', '🍚', 'carb', [130, 2.7, 28.2, 0.3, 0.4], [s('1 chén', 150), s('1 chén đầy', 200), s('½ chén', 75)], ['com', 'rice']),
  food('com-gao-lut', 'Cơm gạo lứt', '🍚', 'carb', [123, 2.7, 25.6, 1.0, 1.6], [s('1 chén', 150)], ['brown rice']),
  food('bun-tuoi', 'Bún tươi', '🍜', 'carb', [110, 1.7, 25.7, 0.1, 0.5], [s('1 vắt', 100), s('1 phần', 200)]),
  food('banh-pho', 'Bánh phở tươi', '🍜', 'carb', [141, 3.2, 32.1, 0.2, 0.4], [s('1 phần', 200)]),
  food('mi-goi', 'Mì gói (khô)', '🍜', 'carb', [450, 9, 60, 19, 2], [s('1 gói', 75)], ['mi tom', 'hao hao', 'instant noodle']),
  food('mi-trung', 'Mì trứng luộc', '🍜', 'carb', [138, 4.5, 25, 2.1, 1.2], [s('1 vắt', 150)]),
  food('nui', 'Nui / mì Ý (luộc)', '🍝', 'carb', [158, 5.8, 31, 0.9, 1.8], [s('1 phần', 200)], ['pasta', 'spaghetti']),
  food('banh-mi-khong', 'Bánh mì (ổ không)', '🥖', 'carb', [250, 8.5, 49, 2, 2.4], [s('1 ổ', 90), s('½ ổ', 45)], ['banh my']),
  food('banh-mi-sandwich', 'Bánh mì sandwich', '🍞', 'carb', [265, 9, 49, 3.2, 2.7], [s('1 lát', 30), s('2 lát', 60)], ['sandwich']),
  food('banh-mi-den', 'Bánh mì đen / nguyên cám', '🍞', 'carb', [247, 13, 41, 3.4, 7], [s('1 lát', 32), s('2 lát', 64)], ['whole wheat']),
  food('xoi-trang', 'Xôi trắng', '🍙', 'carb', [170, 3.5, 37, 0.6, 0.8], [s('1 gói', 200), s('½ gói', 100)], ['xoi nep']),
  food('khoai-lang', 'Khoai lang luộc', '🍠', 'carb', [86, 1.6, 20, 0.1, 3], [s('1 củ vừa', 150)], ['sweet potato']),
  food('khoai-tay', 'Khoai tây luộc', '🥔', 'carb', [87, 1.9, 20, 0.1, 1.8], [s('1 củ vừa', 150)], ['potato']),
  food('yen-mach', 'Yến mạch (khô)', '🥣', 'carb', [389, 16.9, 66, 6.9, 10.6], [s('1 phần', 40), s('1 phần lớn', 60)], ['oat', 'oats']),
  food('bap-luoc', 'Bắp luộc', '🌽', 'carb', [96, 3.4, 21, 1.5, 2.4], [s('1 trái', 150)], ['ngo', 'corn']),
  food('banh-trang', 'Bánh tráng (khô)', '⚪', 'carb', [333, 5.5, 77, 0.5, 1.5], [s('1 cái', 10)], ['rice paper']),
  food('granola', 'Granola', '🥣', 'carb', [471, 10, 64, 20, 7], [s('1 phần', 50)]),

  // ── Đạm ──────────────────────────────────────────────
  food('uc-ga-chin', 'Ức gà (đã nấu, bỏ da)', '🍗', 'protein', [165, 31, 0, 3.6, 0], [s('1 phần', 150), s('1 miếng', 120)], ['chicken breast', 'uc ga luoc', 'uc ga ap chao']),
  food('uc-ga-song', 'Ức gà sống (bỏ da)', '🍗', 'protein', [120, 22.5, 0, 2.6, 0], [s('1 miếng', 200)], ['chicken breast raw']),
  food('dui-ga', 'Đùi gà (đã nấu, có da)', '🍗', 'protein', [229, 24, 0, 14, 0], [s('1 đùi', 130)], ['chicken thigh', 'ma dui']),
  food('ga-luoc', 'Gà luộc (có da)', '🐔', 'protein', [215, 27, 0, 11.5, 0], [s('1 phần', 150)], ['thit ga']),
  food('bo-nac-song', 'Thịt bò nạc (sống)', '🥩', 'protein', [118, 21, 0, 3.8, 0], [s('1 phần', 150), s('1 phần lớn', 200)], ['beef', 'thit bo']),
  food('bo-chin', 'Thịt bò (đã nấu)', '🥩', 'protein', [217, 26, 0, 12, 0], [s('1 phần', 120)], ['beef cooked', 'bo xao', 'bo nuong']),
  food('heo-nac-song', 'Thịt heo nạc (sống)', '🥓', 'protein', [139, 19, 0, 7, 0], [s('1 phần', 150)], ['thit lon', 'pork']),
  food('ba-chi', 'Thịt ba chỉ (sống)', '🥓', 'protein', [260, 16.5, 0, 21.5, 0], [s('1 phần', 100)], ['ba roi', 'pork belly']),
  food('suon-nuong', 'Sườn heo nướng', '🍖', 'protein', [280, 23, 5, 18, 0], [s('1 miếng', 120)], ['suon cot let']),
  food('ca-hoi', 'Cá hồi (sống)', '🐟', 'protein', [208, 20, 0, 13, 0], [s('1 miếng', 150)], ['salmon']),
  food('ca-ngu-hop', 'Cá ngừ hộp (ngâm nước)', '🐟', 'protein', [116, 25.5, 0, 0.8, 0], [s('1 hộp (ráo)', 120)], ['tuna']),
  food('ca-basa', 'Cá basa / cá tra (sống)', '🐟', 'protein', [92, 15, 0, 3.4, 0], [s('1 miếng', 150)], ['ca tra']),
  food('ca-thu', 'Cá thu (sống)', '🐟', 'protein', [166, 18.2, 0, 10.3, 0], [s('1 khúc', 120)], ['mackerel']),
  food('tom', 'Tôm (sống)', '🦐', 'protein', [85, 20, 0, 0.5, 0], [s('1 phần', 150)], ['shrimp']),
  food('muc', 'Mực (sống)', '🦑', 'protein', [92, 15.6, 3.1, 1.4, 0], [s('1 phần', 150)], ['squid']),
  food('trung-ga', 'Trứng gà', '🥚', 'protein', [143, 12.6, 0.7, 9.5, 0], [s('1 quả', 50), s('2 quả', 100), s('3 quả', 150)], ['egg', 'trung luoc', 'trung op la']),
  food('long-trang', 'Lòng trắng trứng', '🥚', 'protein', [52, 10.9, 0.7, 0.2, 0], [s('1 lòng trắng', 33), s('4 lòng trắng', 132)], ['egg white']),
  food('trung-vit-lon', 'Trứng vịt lộn', '🥚', 'protein', [182, 13.6, 4, 12.4, 0], [s('1 quả', 70)], ['hot vit lon']),
  food('dau-hu', 'Đậu hũ trắng', '🧈', 'protein', [95, 10.9, 0.7, 5.4, 0.4], [s('1 bìa', 150), s('½ bìa', 75)], ['dau phu', 'tofu']),
  food('cha-lua', 'Chả lụa', '🍥', 'protein', [136, 21.5, 0, 5.5, 0], [s('1 lát', 30), s('3 lát', 90)], ['gio lua']),
  food('xuc-xich', 'Xúc xích', '🌭', 'protein', [290, 12, 4, 25, 0], [s('1 cây', 40)], ['sausage']),

  // ── Rau củ ───────────────────────────────────────────
  food('rau-muong', 'Rau muống', '🥬', 'veg', [19, 2.6, 3.1, 0.2, 2.1], [s('1 đĩa', 200)]),
  food('bap-cai', 'Bắp cải', '🥬', 'veg', [25, 1.3, 5.8, 0.1, 2.5], [s('1 đĩa', 200)], ['cai bap', 'cabbage']),
  food('bong-cai-xanh', 'Bông cải xanh', '🥦', 'veg', [34, 2.8, 6.6, 0.4, 2.6], [s('1 phần', 150)], ['sup lo xanh', 'broccoli']),
  food('cai-ngot', 'Cải ngọt / cải thìa', '🥬', 'veg', [13, 1.5, 2.2, 0.2, 1], [s('1 đĩa', 200)], ['bok choy']),
  food('ca-chua', 'Cà chua', '🍅', 'veg', [18, 0.9, 3.9, 0.2, 1.2], [s('1 quả', 100)], ['tomato']),
  food('dua-leo', 'Dưa leo', '🥒', 'veg', [15, 0.7, 3.6, 0.1, 0.5], [s('1 trái', 200)], ['dua chuot', 'cucumber']),
  food('ca-rot', 'Cà rốt', '🥕', 'veg', [41, 0.9, 9.6, 0.2, 2.8], [s('1 củ', 80)], ['carrot']),
  food('gia-do', 'Giá đỗ', '🌱', 'veg', [30, 3, 5.9, 0.2, 1.8], [s('1 nắm', 50)], ['gia']),
  food('rau-song', 'Rau sống / xà lách', '🥗', 'veg', [15, 1.4, 2.9, 0.2, 1.3], [s('1 đĩa', 100)], ['xa lach', 'salad', 'lettuce']),
  food('dau-que', 'Đậu que', '🫛', 'veg', [31, 1.8, 7, 0.2, 2.7], [s('1 phần', 150)], ['green bean']),
  food('nam', 'Nấm tươi', '🍄', 'veg', [22, 3.1, 3.3, 0.3, 1], [s('1 phần', 100)], ['mushroom', 'nam rom', 'nam dong co']),
  food('bi-do', 'Bí đỏ', '🎃', 'veg', [26, 1, 6.5, 0.1, 0.5], [s('1 phần', 150)], ['pumpkin']),
  food('dau-bap', 'Đậu bắp', '🌿', 'veg', [33, 1.9, 7.5, 0.2, 3.2], [s('1 phần', 100)], ['okra']),
  food('bi-dao', 'Bí đao', '🥒', 'veg', [13, 0.4, 3, 0.2, 2.9], [s('1 phần', 200)]),

  // ── Trái cây ─────────────────────────────────────────
  food('chuoi', 'Chuối', '🍌', 'fruit', [89, 1.1, 22.8, 0.3, 2.6], [s('1 quả', 100), s('1 quả lớn', 130)], ['banana']),
  food('tao', 'Táo', '🍎', 'fruit', [52, 0.3, 13.8, 0.2, 2.4], [s('1 quả', 180)], ['apple']),
  food('cam', 'Cam', '🍊', 'fruit', [47, 0.9, 11.8, 0.1, 2.4], [s('1 quả', 150)], ['orange']),
  food('du-du', 'Đu đủ', '🍈', 'fruit', [43, 0.5, 10.8, 0.3, 1.7], [s('1 miếng', 200)], ['papaya']),
  food('xoai', 'Xoài chín', '🥭', 'fruit', [60, 0.8, 15, 0.4, 1.6], [s('1 quả', 200)], ['mango']),
  food('dua-hau', 'Dưa hấu', '🍉', 'fruit', [30, 0.6, 7.6, 0.2, 0.4], [s('1 miếng', 250)], ['watermelon']),
  food('thanh-long', 'Thanh long', '🐉', 'fruit', [60, 1.2, 13, 0.4, 3], [s('½ quả', 200)], ['dragon fruit']),
  food('oi', 'Ổi', '🍐', 'fruit', [68, 2.6, 14.3, 1, 5.4], [s('1 quả', 150)], ['guava']),
  food('bo', 'Bơ (trái)', '🥑', 'fruit', [160, 2, 8.5, 14.7, 6.7], [s('½ quả', 100)], ['avocado']),
  food('nho', 'Nho', '🍇', 'fruit', [69, 0.7, 18, 0.2, 0.9], [s('1 chùm nhỏ', 150)], ['grape']),

  // ── Sữa ──────────────────────────────────────────────
  food('sua-tuoi-kd', 'Sữa tươi không đường', '🥛', 'dairy', [61, 3.1, 4.8, 3.3, 0], [s('1 hộp 180ml', 180), s('1 ly 250ml', 250)], ['milk', 'vinamilk', 'th true milk']),
  food('sua-tuoi-cd', 'Sữa tươi có đường', '🥛', 'dairy', [76, 3, 8.5, 3.3, 0], [s('1 hộp 180ml', 180)], ['milk']),
  food('sua-tuoi-ta', 'Sữa tươi tách béo', '🥛', 'dairy', [35, 3.4, 5, 0.1, 0], [s('1 hộp 180ml', 180), s('1 ly 250ml', 250)], ['skim milk']),
  food('sua-chua', 'Sữa chua có đường', '🍶', 'dairy', [95, 3.4, 14, 2.9, 0], [s('1 hộp', 100)], ['yaourt', 'yogurt']),
  food('sua-chua-hy-lap', 'Sữa chua Hy Lạp không đường', '🍶', 'dairy', [59, 10.2, 3.6, 0.4, 0], [s('1 hộp', 100), s('1 chén', 170)], ['greek yogurt']),
  food('sua-dau-nanh', 'Sữa đậu nành', '🥛', 'dairy', [54, 2.8, 6.5, 2, 0.5], [s('1 hộp 200ml', 200)], ['fami', 'soy milk']),
  food('pho-mai', 'Phô mai lát', '🧀', 'dairy', [330, 18, 6, 26, 0], [s('1 lát', 18)], ['cheese']),

  // ── Thực phẩm bổ sung ───────────────────────────────
  food('whey', 'Whey protein', '💪', 'supplement', [400, 78, 8, 6, 0], [s('1 muỗng', 30), s('2 muỗng', 60)], ['protein powder', 'whey isolate']),
  food('protein-bar', 'Thanh protein', '🍫', 'supplement', [367, 33, 37, 12, 8], [s('1 thanh', 60)], ['protein bar']),
  food('mass-gainer', 'Mass gainer', '💪', 'supplement', [380, 15, 75, 2.5, 1], [s('1 muỗng', 80)], ['sua tang can']),

  // ── Món Việt (theo phần ăn) ─────────────────────────
  dish('pho-bo', 'Phở bò', '🍜', '1 tô', 500, [450, 30, 55, 12, 1.5], ['pho tai', 'pho chin', 'pho nam']),
  dish('pho-ga', 'Phở gà', '🍜', '1 tô', 500, [420, 30, 55, 9, 1.5]),
  dish('bun-bo-hue', 'Bún bò Huế', '🍜', '1 tô', 550, [550, 32, 60, 18, 2]),
  dish('bun-cha', 'Bún chả', '🥢', '1 phần', 400, [600, 28, 70, 22, 3]),
  dish('bun-rieu', 'Bún riêu', '🍜', '1 tô', 500, [420, 22, 55, 12, 3]),
  dish('bun-thit-nuong', 'Bún thịt nướng', '🥢', '1 tô', 400, [550, 25, 70, 18, 3]),
  dish('hu-tieu', 'Hủ tiếu', '🍜', '1 tô', 500, [450, 25, 60, 12, 1.5], ['hu tieu nam vang']),
  dish('mi-quang', 'Mì Quảng', '🍜', '1 tô', 450, [550, 28, 65, 18, 2]),
  dish('com-tam-suon', 'Cơm tấm sườn', '🍛', '1 đĩa', 400, [650, 30, 80, 22, 2]),
  dish('com-tam-sbc', 'Cơm tấm sườn bì chả', '🍛', '1 đĩa', 450, [800, 38, 88, 32, 2]),
  dish('com-ga', 'Cơm gà xối mỡ', '🍛', '1 đĩa', 400, [750, 35, 80, 32, 1.5]),
  dish('com-chien', 'Cơm chiên dương châu', '🍳', '1 đĩa', 350, [600, 18, 80, 22, 2], ['com rang']),
  dish('com-van-phong', 'Cơm văn phòng (cơm + mặn + rau)', '🍱', '1 hộp', 500, [700, 30, 90, 22, 3], ['com hop', 'com binh dan']),
  dish('banh-mi-thit', 'Bánh mì thịt', '🥖', '1 ổ', 200, [450, 18, 55, 17, 2.5], ['banh mi pate']),
  dish('banh-mi-op-la', 'Bánh mì ốp la (2 trứng)', '🍳', '1 phần', 190, [420, 18, 50, 16, 2]),
  dish('xoi-man', 'Xôi mặn / xôi gà', '🍙', '1 gói', 250, [500, 18, 75, 14, 1.5], ['xoi xeo', 'xoi thit']),
  dish('banh-cuon', 'Bánh cuốn', '🥟', '1 đĩa', 300, [400, 15, 60, 11, 2]),
  dish('goi-cuon', 'Gỏi cuốn', '🌯', '1 cuốn', 80, [90, 5, 13, 2, 1], ['spring roll']),
  dish('cha-gio', 'Chả giò', '🥟', '1 cuốn', 40, [110, 4, 8, 7, 0.5], ['nem ran']),
  dish('banh-xeo', 'Bánh xèo', '🥞', '1 cái', 200, [400, 12, 35, 23, 2]),
  dish('chao', 'Cháo gà / cháo thịt', '🥣', '1 tô', 400, [250, 14, 38, 5, 0.5]),
  dish('banh-bao', 'Bánh bao nhân thịt', '🥟', '1 cái', 150, [330, 11, 50, 9, 1.5]),
  dish('thit-kho-trung', 'Thịt kho trứng', '🍲', '1 phần', 200, [450, 28, 8, 34, 0]),
  dish('ca-kho', 'Cá kho tộ', '🐟', '1 phần', 150, [250, 22, 8, 14, 0]),
  dish('canh-chua', 'Canh chua cá', '🥘', '1 tô', 300, [120, 12, 8, 4, 1.5]),
  dish('canh-rau', 'Canh rau', '🥣', '1 chén', 250, [40, 2, 5, 1.5, 1.5], ['canh bi', 'canh cai']),
  dish('rau-xao', 'Rau xào tỏi', '🥬', '1 đĩa', 200, [120, 5, 8, 8, 4], ['rau muong xao']),
  dish('trung-chien', 'Trứng chiên (2 quả)', '🍳', '1 phần', 110, [210, 13, 1, 17, 0], ['trung op la']),
  dish('dau-sot-ca', 'Đậu hũ sốt cà', '🍅', '1 phần', 200, [220, 14, 10, 14, 1.5]),
  dish('bo-xao', 'Bò xào rau', '🥩', '1 phần', 200, [300, 24, 10, 18, 2]),
  dish('bo-bit-tet', 'Bò bít tết', '🥩', '1 phần', 250, [500, 35, 20, 30, 1], ['beefsteak']),
  dish('ga-ran', 'Gà rán', '🍗', '1 miếng', 130, [320, 25, 11, 20, 0.5], ['kfc', 'fried chicken']),
  dish('che', 'Chè', '🍧', '1 ly', 300, [300, 6, 60, 5, 3], [], 'snack'),
  dish('banh-flan', 'Bánh flan', '🍮', '1 cái', 100, [150, 5, 22, 5, 0], [], 'snack'),

  // ── Đồ uống ──────────────────────────────────────────
  dish('cf-sua-da', 'Cà phê sữa đá', '☕', '1 ly', 200, [130, 2.5, 22, 3.5, 0], ['ca phe sua', 'bac xiu'], 'drink'),
  dish('cf-den-duong', 'Cà phê đen có đường', '☕', '1 ly', 200, [40, 0.3, 10, 0, 0], ['ca phe den'], 'drink'),
  dish('cf-den', 'Cà phê đen không đường', '☕', '1 ly', 200, [4, 0.3, 0, 0, 0], ['americano'], 'drink'),
  dish('tra-sua', 'Trà sữa trân châu', '🧋', '1 ly', 500, [450, 4, 75, 15, 0.5], ['milk tea'], 'drink'),
  dish('nuoc-ngot', 'Nước ngọt', '🥤', '1 lon', 330, [140, 0, 35, 0, 0], ['coca', 'pepsi', 'soda'], 'drink'),
  dish('bia', 'Bia', '🍺', '1 lon', 330, [145, 1.5, 12, 0, 0], ['beer'], 'drink'),
  dish('nuoc-mia', 'Nước mía', '🥤', '1 ly', 300, [180, 0.5, 45, 0, 0], [], 'drink'),
  dish('nuoc-cam', 'Nước cam vắt', '🍊', '1 ly', 250, [112, 1.7, 26, 0.5, 0.5], ['orange juice'], 'drink'),

  // ── Ăn vặt / hạt / gia vị ───────────────────────────
  food('dau-phong', 'Đậu phộng rang', '🥜', 'snack', [585, 24, 21, 49, 8], [s('1 nắm', 30)], ['lac', 'peanut']),
  food('hat-dieu', 'Hạt điều', '🥜', 'snack', [553, 18, 30, 44, 3.3], [s('1 nắm', 30)], ['cashew']),
  food('hanh-nhan', 'Hạnh nhân', '🌰', 'snack', [579, 21, 22, 50, 12.5], [s('1 nắm', 30)], ['almond']),
  food('bo-dau-phong', 'Bơ đậu phộng', '🥜', 'snack', [588, 25, 20, 50, 6], [s('1 muỗng', 16), s('2 muỗng', 32)], ['peanut butter']),
  food('snack-khoai', 'Snack khoai tây', '🍟', 'snack', [536, 7, 53, 34, 4.4], [s('1 gói', 50)], ['chips', 'poca', 'lays']),
  food('socola-den', 'Socola đen 70%', '🍫', 'snack', [600, 7.8, 46, 43, 11], [s('1 thanh nhỏ', 20)], ['chocolate']),
  food('banh-quy', 'Bánh quy', '🍪', 'snack', [480, 6, 68, 20, 2], [s('1 gói nhỏ', 40)], ['cookie', 'biscuit']),
  food('mat-ong', 'Mật ong', '🍯', 'snack', [304, 0.3, 82, 0, 0.2], [s('1 muỗng', 21)], ['honey']),
  food('dau-an', 'Dầu ăn', '🫗', 'snack', [884, 0, 0, 100, 0], [s('1 muỗng canh', 14), s('1 muỗng cà phê', 5)], ['oil', 'mo']),
]

export const CATEGORY_LABEL: Record<FoodCategory, string> = {
  carb: 'Tinh bột',
  protein: 'Đạm',
  veg: 'Rau củ',
  fruit: 'Trái cây',
  dish: 'Món Việt',
  dairy: 'Sữa',
  snack: 'Ăn vặt',
  drink: 'Đồ uống',
  supplement: 'Bổ sung',
}

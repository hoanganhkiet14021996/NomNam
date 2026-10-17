import type { Food } from '@/types'
import { dish, food, s } from '../foodHelpers'

/** Món Việt: cơm quán, món mặn, canh, xào. Nguồn từng món: docs/food-research/vn-rice.md */
export const VN_RICE_FOODS: Food[] = [
  // ── Cơm phần (1 đĩa cho 1 người, ~200 g cơm) ─────────
  // Tính từ công thức (nguyên liệu × USDA SR / bảng gốc), đã gồm dầu thấm, nước sốt / nước mắm pha như ghi trong log.
  dish('com-bo-luc-lac', 'Cơm bò lúc lắc', '🥩', '1 đĩa', 450, [670, 39.7, 71, 24.3, 3], ['com bo luc lac', 'bo luc lac com', 'shaking beef rice']),
  dish('com-rang-dua-bo', 'Cơm rang dưa bò', '🍳', '1 đĩa', 370, [583, 24.4, 70.4, 21.9, 3.5], ['com rang dua bo', 'com chien dua bo', 'com rang bo']),
  dish('com-chien-hai-san', 'Cơm chiên hải sản', '🍤', '1 đĩa', 380, [597, 30.9, 67.9, 21.4, 1.8], ['com chien hai san', 'com rang hai san', 'seafood fried rice', 'com chien tom']),
  dish('com-heo-quay', 'Cơm heo quay', '🍖', '1 đĩa', 370, [732, 27.9, 64.2, 39.7, 1.4], ['com heo quay', 'com thit quay', 'com quay']),
  dish('com-xa-xiu', 'Cơm xá xíu', '🍖', '1 đĩa', 395, [585, 30, 74.1, 17.9, 1.1], ['com xa xiu', 'char siu rice', 'com thit xa xiu']),
  dish('com-ga-nuong', 'Cơm gà nướng (đùi gà)', '🍗', '1 đĩa', 400, [659, 34.8, 68, 26.6, 1.3], ['com ga nuong', 'com tam ga nuong', 'com dui ga nuong']),
  dish('com-thit-nuong', 'Cơm thịt nướng (heo nướng lát)', '🍛', '1 đĩa', 380, [628, 32.2, 71.5, 22.9, 1.7], ['com thit nuong', 'com tam thit nuong', 'com heo nuong']),
  dish('com-chay', 'Cơm chay (đậu hũ + rau nấm xào)', '🥬', '1 đĩa', 420, [547, 20.5, 71.9, 21.1, 5.7], ['com chay', 'com chay thap cam', 'vegetarian rice']),
  dish('com-chien-ca-man', 'Cơm chiên cá mặn', '🍳', '1 đĩa', 340, [562, 25.8, 65.3, 21, 1.6], ['com chien ca man', 'com rang ca man', 'salted fish fried rice']),
  dish('com-chien-lap-xuong', 'Cơm chiên lạp xưởng', '🍳', '1 đĩa', 340, [614, 20.6, 65, 29.3, 1.2], ['com chien lap xuong', 'com rang lap xuong']),
  dish('com-vit-quay', 'Cơm vịt quay', '🦆', '1 đĩa', 390, [741, 34.2, 66, 36.8, 1.1], ['com vit quay', 'com vit']),
  dish('com-ga-ro-ti', 'Cơm gà rô ti (đùi gà góc tư)', '🍗', '1 đĩa', 390, [727, 35.2, 69.5, 33, 1.4], ['com ga ro ti', 'com ga roti', 'com dui ga ro ti']),
  dish('com-ca-ri-ga', 'Cơm cà ri gà', '🍛', '1 đĩa', 500, [688, 24.7, 81.7, 28.9, 4], ['com ca ri ga', 'com cari ga', 'chicken curry rice']),

  // ── Món mặn ăn kèm cơm (1 phần cho 1 người, không gồm cơm) ──
  dish('bo-luc-lac', 'Bò lúc lắc (không cơm)', '🥩', '1 phần', 250, [407, 34, 14, 23.7, 2], ['bo luc lac', 'shaking beef']),
  dish('bo-xao-hanh-tay', 'Bò xào hành tây', '🥩', '1 phần', 180, [279, 22.6, 11.3, 15.7, 1.4], ['bo xao hanh tay', 'bo xao hanh', 'beef onion stir fry']),
  dish('bo-kho', 'Bò kho (1 tô, không bánh mì)', '🍲', '1 tô', 430, [424, 29.9, 28.4, 20.8, 1.9], ['bo kho', 'vietnamese beef stew']),
  dish('thit-kho-tieu', 'Thịt kho tiêu (ba chỉ + nạc)', '🍲', '1 phần', 110, [358, 22.6, 9.3, 25.5, 0.2], ['thit kho tieu', 'thit kho kho', 'thit kho', 'thit kho mam']),
  dish('suon-ram', 'Sườn non ram mặn (bỏ xương)', '🍖', '1 phần', 125, [495, 22.8, 12.9, 38.8, 0.3], ['suon ram', 'suon ram man', 'suon rim', 'suon non ram', 'suon kho']),
  dish('ga-xao-sa-ot', 'Gà xào sả ớt (gà có da)', '🍗', '1 phần', 150, [455, 26, 13.1, 33, 0.3], ['ga xao sa ot', 'ga xao sa', 'lemongrass chicken']),
  dish('canh-ga-chien-nuoc-mam', 'Cánh gà chiên nước mắm (~4 cánh, phần ăn được)', '🍗', '1 phần', 150, [493, 29, 19.4, 32.7, 0.2], ['canh ga chien nuoc mam', 'ga chien nuoc mam', 'canh ga chien', 'fish sauce wings']),
  dish('ba-chi-chien-nuoc-mam', 'Ba chỉ chiên nước mắm', '🥓', '1 phần', 90, [432, 20, 9.7, 35.1, 0.1], ['ba chi chien nuoc mam', 'ba roi chien nuoc mam', 'thit chien nuoc mam']),
  dish('ga-ro-ti', 'Gà rô ti (1 đùi góc tư, bỏ xương)', '🍗', '1 đùi', 140, [459, 29.4, 11.3, 32.3, 0.2], ['ga ro ti', 'ga roti', 'dui ga ro ti', 'dui ga chien']),
  dish('ca-ri-ga', 'Cà ri gà (1 tô, không cơm/bánh mì)', '🍛', '1 tô', 400, [570, 25.7, 33.7, 37.7, 4.3], ['ca ri ga', 'cari ga', 'chicken curry']),
  dish('ca-sot-ca-chua', 'Cá sốt cà chua (cá chiên rồi sốt)', '🐟', '1 phần', 210, [306, 31.3, 9, 16.7, 1.1], ['ca sot ca chua', 'ca sot ca', 'ca thu sot ca', 'ca chien sot ca']),
  dish('ca-hap-xi-dau', 'Cá hấp xì dầu (rô phi / diêu hồng)', '🐟', '1 phần', 170, [215, 31.6, 5.4, 7.7, 0.5], ['ca hap xi dau', 'ca hap hanh gung', 'ca dieu hong hap', 'steamed fish soy sauce']),
  dish('ca-nuc-kho-ca', 'Cá nục kho cà', '🐟', '1 phần', 180, [250, 31.4, 9.2, 10.1, 0.8], ['ca nuc kho', 'ca nuc kho ca', 'ca kho ca chua']),
  dish('tom-rang-muoi', 'Tôm rang muối', '🦐', '1 phần', 135, [282, 30.6, 11.3, 12.8, 0.3], ['tom rang muoi', 'tom rang', 'salt and pepper shrimp']),
  dish('tom-chien-bot', 'Tôm chiên bột (tẩm bột chiên giòn)', '🍤', '1 phần', 140, [295, 26.9, 16, 13.7, 0.5], ['tom chien bot', 'tom chien gion', 'tom tam bot', 'fried shrimp']),
  dish('tep-rang', 'Tép rang (rang khô với ít ba chỉ)', '🦐', '1 phần', 100, [260, 25.4, 5.8, 15.3, 0.1], ['tep rang', 'tep rang thit', 'tep rim']),
  dish('muc-chien-gion', 'Mực chiên giòn (tẩm bột)', '🦑', '1 phần', 140, [330, 22, 19.1, 17.8, 0.5], ['muc chien', 'muc chien gion', 'muc chien xu', 'fried calamari']),
  dish('dau-hu-nhoi-thit', 'Đậu hũ nhồi thịt sốt cà', '🧈', '1 phần', 240, [359, 26.6, 6.9, 25.2, 1.4], ['dau hu nhoi thit', 'dau phu nhoi thit', 'dau nhoi thit']),
  dish('trung-chien-thit', 'Trứng chiên thịt bằm (2 trứng)', '🍳', '1 phần', 140, [281, 20.3, 1.2, 21.1, 0.1], ['trung chien thit', 'trung chien thit bam', 'trung chien thit heo']),
  dish('ca-tim-xao', 'Cà tím xào thịt bằm', '🍆', '1 đĩa', 200, [258, 10, 16.3, 18, 6.2], ['ca tim xao', 'ca tim xao thit', 'ca tim mo hanh']),
  dish('long-xao-dua', 'Lòng xào dưa', '🐖', '1 đĩa', 220, [334, 14.1, 6.6, 28.5, 3.3], ['long xao dua', 'long heo xao dua']),
  dish('bo-la-lot', 'Bò lá lốt (6 cuốn, không bún)', '🌿', '1 phần', 130, [310, 25.5, 6, 20.2, 0.5], ['bo la lot', 'bo cuon la lot', 'bo nuong la lot']),
  dish('goi-ga-bap-cai', 'Gỏi gà bắp cải', '🥗', '1 đĩa', 280, [368, 29.1, 17.3, 20.7, 4.3], ['goi ga', 'goi ga bap cai', 'ga xe phay', 'chicken cabbage salad']),
  food('thit-dong', 'Thịt đông (chân giò, bì, mộc nhĩ)', '🍖', 'dish', [160, 14.1, 2.2, 10.1, 0.8], [s('1 miếng', 80), s('1 phần', 120)], ['thit dong', 'thit nau dong', 'head cheese']),

  // ── Canh / súp / cháo (1 tô cho 1 người) ────────────
  dish('canh-bi-dao-tom', 'Canh bí đao nấu tôm', '🥣', '1 tô', 300, [67, 6.6, 5.1, 2.7, 1.5], ['canh bi dao', 'canh bi dao tom', 'canh bi xanh']),
  dish('canh-rau-ngot-thit-bam', 'Canh rau ngót thịt bằm', '🥣', '1 tô', 300, [140, 13, 3.6, 7.9, 2], ['canh rau ngot', 'canh rau ngot thit bam', 'canh rau ngot thit']),
  dish('canh-cai-thit-bam', 'Canh cải xanh thịt bằm', '🥣', '1 tô', 300, [121, 11.6, 5.8, 6.3, 3.2], ['canh cai thit bam', 'canh cai xanh', 'canh cai be xanh']),
  dish('canh-mong-toi-tom', 'Canh mồng tơi nấu tôm', '🥣', '1 tô', 300, [70, 8, 4.2, 2.8, 1.8], ['canh mong toi', 'canh mong toi tom']),
  dish('canh-trung-ca-chua', 'Canh trứng cà chua', '🥣', '1 tô', 300, [134, 8.3, 4.6, 9.2, 1.1], ['canh trung ca chua', 'canh ca chua trung', 'egg tomato soup']),
  dish('canh-bau-tom', 'Canh bầu nấu tôm', '🥣', '1 tô', 300, [69, 6.8, 5.7, 2.4, 0.8], ['canh bau', 'canh bau tom']),
  dish('canh-bi-do-thit-bam', 'Canh bí đỏ thịt bằm', '🥣', '1 tô', 300, [123, 9.7, 8.5, 6, 0.6], ['canh bi do', 'canh bi do thit bam', 'canh bi ro']),
  dish('canh-suon-ham-cu', 'Canh sườn hầm khoai tây cà rốt', '🥣', '1 tô', 350, [298, 15.6, 21.6, 16.3, 2.7], ['canh suon', 'canh suon ham', 'suon ham cu qua', 'canh khoai tay ca rot']),
  dish('sup-ga', 'Súp gà bắp', '🥣', '1 chén', 250, [122, 10.7, 13.5, 3, 0.7], ['sup ga', 'sup ga ngo', 'chicken corn soup']),
  dish('canh-khoai-mo-tom', 'Canh khoai mỡ nấu tôm', '🥣', '1 tô', 300, [170, 7.8, 29, 2.7, 4.2], ['canh khoai mo', 'canh khoai mo tom', 'canh khoai tim']),
  dish('sup-cua', 'Súp cua', '🥣', '1 chén', 250, [116, 8.5, 11.3, 4.2, 0.6], ['sup cua', 'soup cua', 'crab soup']),
  dish('chao-suon', 'Cháo sườn (không quẩy)', '🥣', '1 tô', 400, [253, 10.5, 28.2, 10.3, 0.6], ['chao suon', 'chao suon sun']),
  food('chao-trang', 'Cháo trắng', '🥣', 'carb', [36, 0.7, 7.9, 0.1, 0.1], [s('1 tô', 400), s('1 chén', 250)], ['chao trang', 'chao hoa', 'chao loang', 'rice porridge', 'congee']),

  // ── Rau xào / luộc (1 đĩa cho 1 người) ──────────────
  dish('dau-que-xao-thit', 'Đậu que xào thịt bò', '🫛', '1 đĩa', 190, [204, 13.7, 12, 12.1, 4.1], ['dau que xao thit', 'dau que xao bo']),
  dish('gia-xao', 'Giá hẹ xào', '🌱', '1 đĩa', 180, [141, 7.1, 13.2, 8.6, 4.4], ['gia xao', 'gia he xao', 'gia xao he']),
  dish('bong-cai-xao', 'Bông cải xào tỏi (xanh + trắng)', '🥦', '1 đĩa', 180, [137, 4.3, 13.5, 8.6, 4.5], ['bong cai xao', 'sup lo xao', 'broccoli xao toi']),
  dish('su-su-xao', 'Su su xào tỏi', '🥒', '1 đĩa', 190, [105, 1.9, 10.1, 7.2, 3.5], ['su su xao', 'su su xao toi']),
  dish('rau-cu-xao', 'Rau củ xào thập cẩm', '🥕', '1 đĩa', 210, [142, 4.3, 15, 8.6, 4.8], ['rau cu xao', 'rau xao thap cam', 'stir fried vegetables']),
  dish('cai-thia-xao-nam', 'Cải thìa xào nấm', '🥬', '1 đĩa', 220, [106, 4.8, 7.6, 7.6, 2.5], ['cai thia xao nam', 'cai xao nam', 'bok choy xao']),
  dish('muop-xao', 'Mướp xào tỏi', '🥒', '1 đĩa', 190, [97, 2.7, 9.6, 6.4, 2.2], ['muop xao', 'muop huong xao']),
  dish('kho-qua-xao-trung', 'Khổ qua xào trứng', '🥒', '1 đĩa', 190, [169, 8, 6, 13.1, 4.2], ['kho qua xao trung', 'muop dang xao trung']),
  dish('bap-cai-xao', 'Bắp cải xào cà chua', '🥬', '1 đĩa', 210, [121, 3.2, 13.5, 7.3, 5.4], ['bap cai xao', 'cai bap xao']),
  dish('rau-cu-luoc', 'Rau củ luộc thập cẩm (không chấm)', '🥦', '1 đĩa', 200, [62, 3.2, 13.6, 0.5, 4.8], ['rau cu luoc', 'bong cai luoc', 'ca rot luoc', 'su su luoc']),

  // ── Nước chấm / đồ ăn kèm (calo ẩn) ─────────────────
  food('nuoc-mam-pha', 'Nước mắm pha (chua ngọt, kiểu cơm tấm)', '🫙', 'dish', [88, 0.9, 21.9, 0, 0.1], [s('1 chén nhỏ', 30), s('1 muỗng canh', 15)], ['nuoc mam pha', 'nuoc mam chua ngot', 'nuoc cham']),
  food('mo-hanh', 'Mỡ hành', '🧅', 'dish', [543, 0.7, 2.9, 60.1, 1], [s('1 muỗng canh', 12), s('1 muỗng cà phê', 4)], ['mo hanh', 'dau hanh', 'scallion oil']),
  food('do-chua', 'Đồ chua (cà rốt, củ cải ngâm)', '🥕', 'veg', [49, 0.8, 11.9, 0.2, 2.2], [s('1 phần', 30), s('1 chén nhỏ', 60)], ['do chua', 'ca rot cu cai chua', 'pickled carrot daikon']),
]

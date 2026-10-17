import type { Food } from '@/types'
import { dish, food, s } from '../foodHelpers'

/** Món Tây, chuỗi cửa hàng, đồ uống. Nguồn từng món: docs/food-research/west-drinks.md */
export const WEST_DRINK_FOODS: Food[] = [
  // ── Chuỗi đồ ăn nhanh (1 phần = 1 cái/1 hộp, chưa gồm sốt chấm, nước) ──
  dish('mcchicken', 'Burger gà McChicken (McDonald\'s)', '🍔', '1 cái', 145, [391, 15, 42, 18, 2], ['mcchicken', 'mc chicken', 'burger ga mcdonalds', 'mcdonalds']),
  dish('mcnuggets-6', 'Gà viên McNuggets 6 miếng (McDonald\'s, chưa sốt)', '🍗', '1 hộp 6 miếng', 96, [273, 14, 17, 16, 1], ['mcnuggets', 'chicken nuggets', 'ga vien', 'ga nugget', 'mcdonalds']),
  dish('filet-o-fish', 'Burger cá Filet-O-Fish (McDonald\'s)', '🍔', '1 cái', 136, [360, 15.5, 38.5, 16, 2], ['filet o fish', 'burger ca', 'fish burger', 'mcdonalds']),
  dish('zinger-burger', 'Burger gà Zinger (KFC)', '🍔', '1 cái', 195, [460, 26.5, 40, 21, 2], ['zinger', 'burger zinger', 'burger ga kfc', 'kfc']),
  dish('pizza-pepperoni-lat', 'Pizza pepperoni (1 lát, đế vừa)', '🍕', '1 lát', 105, [291, 12.1, 33.5, 12.1, 2.3], ['pizza pepperoni', 'pizza xuc xich', 'pizza hut', 'dominos']),

  // ── Món Tây ──────────────────────────────────────────
  dish('mi-y-carbonara', 'Mì Ý sốt kem carbonara (thịt xông khói)', '🍝', '1 đĩa', 320, [670, 27, 70, 33, 3], ['carbonara', 'spaghetti carbonara', 'mi y sot kem', 'pasta carbonara']),
  dish('lasagna', 'Lasagna bò (mì lá nướng phô mai)', '🍝', '1 miếng', 250, [475, 27.5, 30, 27.3, 3.5], ['lasagne', 'lasagna bo', 'mi la nuong']),
  dish('salad-caesar-ga', 'Salad Caesar gà (có sốt, bánh mì nướng)', '🥗', '1 phần', 300, [420, 27, 19, 26, 3.5], ['caesar salad', 'salad caesar', 'xa lach caesar']),
  dish('salad-uc-ga', 'Salad ức gà nướng sốt dầu giấm', '🥗', '1 phần', 320, [385, 39.5, 14, 18.5, 2.8], ['grilled chicken salad', 'salad ga nuong', 'salad uc ga', 'eat clean']),
  dish('sandwich-ca-ngu', 'Sandwich cá ngừ mayonnaise', '🥪', '1 cái', 180, [392, 20, 31, 21.5, 1.6], ['tuna sandwich', 'banh mi ca ngu', 'sandwich ca ngu']),
  dish('club-sandwich', 'Club sandwich gà bacon (3 lớp)', '🥪', '1 phần', 250, [568, 41.5, 48, 23.3, 2.5], ['club sandwich', 'sandwich ga', 'chicken club']),
  dish('hotdog', 'Hotdog (bánh mì kẹp xúc xích)', '🌭', '1 cái', 102, [290, 10.3, 25.4, 16.1, 0.9], ['hot dog', 'banh mi xuc xich', 'hotdog']),
  dish('pancake', 'Pancake (2 cái vừa + siro + bơ)', '🥞', '1 phần 2 cái', 135, [364, 7, 59.7, 11.4, 1.9], ['pancake', 'banh kep', 'hotcake'], 'snack'),
  dish('waffle', 'Bánh waffle (1 cái vừa, không topping)', '🧇', '1 cái', 75, [225, 5.6, 31.5, 8.6, 1.5], ['waffle', 'banh to ong'], 'snack'),
  dish('tiramisu', 'Bánh tiramisu', '🍰', '1 miếng', 100, [340, 5.6, 30, 22.5, 0.6], ['tiramisu'], 'snack'),
  dish('cheesecake', 'Bánh cheesecake (phô mai nướng)', '🍰', '1 miếng', 100, [340, 6.4, 27.9, 23.4, 0.4], ['cheesecake', 'banh pho mai', 'new york cheesecake'], 'snack'),
  dish('donut', 'Bánh donut phủ đường', '🍩', '1 cái', 60, [244, 3.9, 28.5, 13.3, 1.2], ['donut', 'doughnut', 'banh vong', 'dunkin'], 'snack'),
  dish('muffin', 'Bánh muffin (việt quất / socola)', '🧁', '1 cái', 110, [418, 5.2, 55.6, 19.8, 1.7], ['muffin', 'cupcake', 'banh muffin'], 'snack'),
  food('ngu-coc-corn-flakes', 'Ngũ cốc bắp giòn (corn flakes, khô)', '🥣', 'carb', [377, 7.4, 83.9, 1.4, 3.6], [s('1 bát', 30), s('1 bát lớn', 45)], ['corn flakes', 'ngu coc an sang', 'cereal', 'kelloggs', 'bong ngo']),

  // ── Món Nhật / Hàn / dimsum ─────────────────────────
  dish('sushi-nigiri-ca-hoi', 'Sushi nigiri cá hồi', '🍣', '1 miếng', 35, [44, 2.9, 5.3, 1.2, 0.1], ['sushi ca hoi', 'salmon nigiri', 'sushi', 'nigiri']),
  dish('california-roll', 'Cơm cuộn California (8 miếng)', '🍣', '1 cuộn 8 miếng', 200, [206, 7.1, 38, 2.7, 1.5], ['california roll', 'sushi cuon', 'maki california']),
  dish('maki-ca-hoi', 'Cơm cuộn cá hồi maki (6 miếng)', '🍣', '1 cuộn 6 miếng', 150, [173, 9, 24.5, 4.2, 0.8], ['salmon roll', 'maki ca hoi', 'sushi cuon ca hoi']),
  dish('kimbap', 'Kimbap (cơm cuộn Hàn Quốc)', '🍙', '1 cuộn', 230, [360, 11, 55, 10.5, 2.5], ['kimbap', 'gimbap', 'com cuon han quoc']),
  dish('tokbokki', 'Tokbokki (bánh gạo cay, có chả cá)', '🌶️', '1 phần', 250, [370, 9, 72, 5.5, 2], ['tteokbokki', 'topokki', 'banh gao cay', 'tokbokki']),
  dish('bibimbap', 'Cơm trộn Hàn Quốc (bibimbap, có trứng + bò)', '🍲', '1 tô', 440, [600, 24.5, 77, 22, 4], ['bibimbap', 'com tron', 'com tron han quoc']),
  food('ga-ran-han-sot', 'Gà rán Hàn Quốc sốt cay ngọt (yangnyeom)', '🍗', 'dish', [262, 16.3, 13.9, 15.5, 0.3], [s('1 phần 1 người (~5 miếng)', 220), s('1 miếng', 45)], ['ga ran han quoc', 'ga sot cay', 'yangnyeom', 'korean fried chicken', 'ga sot han']),
  dish('ramen', 'Mì ramen Nhật (thịt heo chashu, trứng)', '🍜', '1 tô', 550, [700, 39, 77, 25, 5], ['ramen', 'mi ramen', 'tonkotsu', 'mi nhat']),
  dish('udon-bo', 'Mì udon nước thịt bò', '🍜', '1 tô', 650, [400, 15.5, 64, 10, 3.3], ['udon', 'mi udon', 'niku udon']),
  dish('gyoza', 'Há cảo áp chảo Nhật (gyoza, 5 cái)', '🥟', '1 phần 5 cái', 125, [250, 9.8, 22.7, 14, 1.9], ['gyoza', 'potsticker', 'banh xep chien', 'sui cao chien']),
  dish('ha-cao', 'Há cảo tôm hấp (dimsum)', '🥟', '1 cái', 25, [45, 2, 5.5, 1.7, 0.2], ['ha cao', 'har gow', 'dimsum', 'dim sum']),
  dish('xiu-mai-dimsum', 'Xíu mại hấp (dimsum)', '🥟', '1 viên', 25, [48, 2.3, 4.9, 2.3, 0.4], ['siu mai', 'shumai', 'xiu mai hap', 'dimsum']),

  // ── Đồ uống đóng chai / lon ─────────────────────────
  dish('nuoc-ngot-khong-duong', 'Nước ngọt không đường (Coca Zero / Pepsi không calo)', '🥤', '1 lon 320ml', 320, [1, 0, 0.3, 0, 0], ['coca zero', 'coke zero', 'pepsi khong calo', 'pepsi zero', '7up zero', 'diet coke', 'nuoc ngot zero'], 'drink'),
  dish('red-bull', 'Nước tăng lực Red Bull', '🥫', '1 lon 250ml', 250, [110, 0.5, 27, 0, 0], ['red bull', 'bo huc', 'nuoc tang luc', 'energy drink'], 'drink'),
  dish('tra-xanh-dong-chai', 'Trà xanh đóng chai có đường (Không Độ)', '🍵', '1 chai 455ml', 455, [91, 0, 22.8, 0, 0], ['tra xanh khong do', 'khong do', 'tra xanh chai', 'c2', 'green tea'], 'drink'),
  dish('milo-hop', 'Sữa Milo hộp', '🥛', '1 hộp 180ml', 180, [110, 2.8, 17, 3.5, 0], ['milo', 'sua milo', 'milo hop'], 'drink'),
  dish('yakult', 'Sữa uống lên men Yakult', '🥛', '1 chai 65ml', 65, [50, 0.8, 12.4, 0, 0], ['yakult', 'sua chua uong', 'probiotic'], 'drink'),
  dish('vang-do', 'Rượu vang đỏ', '🍷', '1 ly 150ml', 150, [120, 0.1, 3, 0, 0], ['ruou vang do', 'red wine', 'vang'], 'drink'),
  dish('vang-trang', 'Rượu vang trắng (khô)', '🥂', '1 ly 150ml', 150, [112, 0.1, 2, 0, 0], ['ruou vang trang', 'white wine'], 'drink'),
  dish('soju', 'Soju truyền thống (~16%)', '🍶', '1 chai 360ml', 360, [325, 0, 1, 0, 0], ['soju', 'chamisul', 'jinro', 'ruou han quoc'], 'drink'),
  dish('ruou-manh', 'Rượu mạnh 40% (whisky / vodka / rượu trắng)', '🥃', '1 ly 40ml', 40, [88, 0, 0, 0, 0], ['whisky', 'vodka', 'ruou trang', 'ruou de', 'ruou manh', 'shot'], 'drink'),
  dish('nuoc-ep-tao', 'Nước ép táo 100%', '🧃', '1 hộp 250ml', 250, [118, 0.3, 28.3, 0.5, 0.5], ['apple juice', 'nuoc tao', 'nuoc ep tao'], 'drink'),
  dish('nuoc-ep-dua-hau', 'Nước ép dưa hấu (không thêm đường)', '🍉', '1 ly 300ml', 300, [96, 1.8, 22.7, 0.5, 1.2], ['watermelon juice', 'nuoc dua hau', 'ep dua hau'], 'drink'),
  dish('kombucha', 'Kombucha (trà lên men)', '🍵', '1 chai 330ml', 330, [50, 0.3, 12.5, 0, 0], ['kombucha', 'tra len men'], 'drink'),
  food('sua-hanh-nhan-kd', 'Sữa hạnh nhân không đường', '🥛', 'drink', [15, 0.5, 0.6, 1.1, 0.1], [s('1 hộp 180ml', 180), s('1 ly 250ml', 250)], ['almond milk', 'sua hat', 'sua hanh nhan']),

  // ── Đồ uống pha (quán cà phê / trà sữa) ─────────────
  food('latte', 'Cà phê latte (sữa tươi, không đường)', '☕', 'drink', [43, 2.8, 4.4, 1.6, 0], [s('1 ly M / Tall 350ml', 350), s('1 ly L / Grande 470ml', 470)], ['latte', 'caffe latte', 'cafe latte', 'ca phe sua tuoi', 'starbucks latte', 'the coffee house']),
  food('cappuccino', 'Cà phê cappuccino (sữa tươi, không đường)', '☕', 'drink', [27, 1.7, 2.8, 1, 0], [s('1 ly M / Tall 350ml', 350), s('1 ly L / Grande 470ml', 470)], ['cappuccino', 'capuchino', 'starbucks cappuccino']),
  dish('ca-phe-muoi', 'Cà phê muối (sữa đặc + kem muối)', '☕', '1 ly', 250, [210, 4, 18.5, 13.5, 0], ['ca phe muoi', 'cafe muoi', 'salted coffee', 'salt coffee'], 'drink'),
  dish('cacao-sua-da', 'Cacao sữa đá', '🥤', '1 ly', 300, [190, 7.6, 27, 7.3, 3.5], ['cacao sua', 'ca cao sua da', 'hot chocolate', 'chocolate da'], 'drink'),
  dish('matcha-latte', 'Matcha latte đá (sữa tươi, có đường)', '🍵', '1 ly M', 350, [210, 7.5, 31, 6.8, 1], ['matcha latte', 'tra xanh sua', 'matcha sua', 'green tea latte'], 'drink'),
  dish('sinh-to-xoai', 'Sinh tố xoài (có sữa đặc)', '🥭', '1 ly', 335, [240, 4.8, 48.5, 4.4, 2.4], ['mango smoothie', 'sinh to xoai'], 'drink'),
  dish('nuoc-chanh', 'Nước chanh / trà chanh có đường', '🍋', '1 ly', 350, [105, 0.1, 27, 0.1, 0.1], ['nuoc chanh', 'tra chanh', 'chanh da', 'lemonade', 'tra tac'], 'drink'),
  dish('tran-chau-den', 'Trân châu đen (topping trà sữa)', '🧋', '1 phần topping', 60, [85, 0, 21, 0, 0.1], ['tran chau', 'boba', 'tapioca pearl', 'topping tra sua'], 'snack'),
]

import type { Food } from '@/types'
import { food, s } from '../foodHelpers'

/** Món bổ sung từ danh sách chờ (AI chụp ảnh gặp mà bảng chưa có). SINH TỰ ĐỘNG bởi scripts/foods-bulk.mjs từ scripts/specs/requests.mjs — sửa spec rồi chạy lại, đừng sửa tay. Nguồn từng món: docs/food-research/requests.md */
export const REQUEST_FOODS: Food[] = [
  food('nuoc-ep-luu', 'Nước ép lựu', '🍹', 'drink', [54, 0.2, 13.1, 0.3, 0.1], [s('1 ly 250ml', 250), s('1 chai 330ml', 330)], ['nuoc luu', 'pomegranate juice']),
  food('soi-mi-lanh', 'Sợi mì lạnh', '🍜', 'carb', [115, 4.1, 25, 0.3, 1.2], [s('1 phần', 120), s('1 phần lớn', 180)], ['mi lanh', 'naengmyeon', 'mi lanh han quoc']),
  food('nuoc-dung-mi-lanh', 'Nước dùng mì lạnh', '🥣', 'dish', [21, 1, 3.9, 0.2, 0], [s('1 muỗng canh', 15), s('1 chén', 200)], ['nuoc mi lanh', 'nuoc dung naengmyeon']),
  food('trung-ga-hap-han', 'Trứng gà hấp Hàn Quốc', '🥚', 'protein', [100, 8.1, 1, 6.9, 0.1], [s('1 phần', 80), s('1 tô nhỏ', 150)], ['trung hap han quoc', 'gyeran jjim', 'trung hap han']),
  food('pizza-prosciutto', 'Pizza Prosciutto', '🍕', 'dish', [263, 10.9, 28.3, 11.4, 1.8], [s('1 phần', 210), s('1 miếng', 105)], ['pizza giam bong', 'pizza ham']),
  food('pizza-steak', 'Pizza Steak', '🍕', 'dish', [267, 11.8, 27.9, 11.8, 1.8], [s('1 miếng', 105), s('1 phần', 210)], ['pizza bo bit tet', 'pizza bo']),
  food('mi-y-ngheu-pesto', 'Mì Ý nghêu sốt pesto', '🍝', 'dish', [168, 7, 21.7, 5.6, 1.2], [s('1 đĩa', 250)], ['mi y ngheu pesto', 'spaghetti vongole pesto', 'mi y nghieu']),
  food('tra-mang-cau-phuc-long', 'Trà mãng cầu Phúc Long', '🍹', 'drink', [37, 0.1, 8.9, 0, 0.2], [s('1 ly 450ml', 450), s('1 ly 360ml', 360)], ['tra mang cau', 'phuc long mang cau']),
  food('patty-tom-chien', 'Patty tôm chiên', '🍤', 'protein', [234, 17.6, 12, 12.4, 0.5], [s('1 cái', 80), s('2 cái', 160)], ['cha tom chien', 'tom tam bot chien', 'shrimp patty']),
  food('hanh-ngo', 'Hành ngò', '🌿', 'veg', [23, 2.1, 3.7, 0.3, 2.7], [s('1 nắm', 15), s('1 muỗng canh', 5)], ['hanh la ngo', 'ngo ri hanh la', 'rau thom']),
]

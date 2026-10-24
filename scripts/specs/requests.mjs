// Món từ danh sách "chờ bổ sung" (npm run food-requests). Tên PHẢI trùng tên trong yêu cầu (hoặc thêm vào aliases)
// để app tự nhận ra và cho bấm "Cập nhật N bữa". manual: số tự tính / ước tính khi bộ dữ liệu không có món.
export const meta = { out: 'requests', exportName: 'REQUEST_FOODS', title: 'Món bổ sung từ danh sách chờ (AI chụp ảnh gặp mà bảng chưa có)' }

const sv = (...a) => a.map(([l, g]) => [l, g])
const AI = (kcal, p, c, f, fib) => ({ kcal, p, c, f, fib, note: 'Ước tính của AI khi chụp ảnh (số trong yêu cầu chờ)' })

export default [
  {
    id: 'nuoc-ep-luu', name: 'Nước ép lựu', emoji: '🍹', cat: 'drink', usda: ['167787'],
    servings: sv(['1 ly 250ml', 250], ['1 chai 330ml', 330]), aliases: ['nuoc luu', 'pomegranate juice'],
  },
  {
    id: 'soi-mi-lanh', name: 'Sợi mì lạnh', emoji: '🍜', cat: 'carb', usda: ['168907'],
    manual: [{ kcal: 130, p: 3.2, c: 28.5, f: 0.4, fib: 1.2, note: 'Mì lạnh Hàn (kiều mạch + bột khoai) luộc, ước tính theo thành phần' }],
    servings: sv(['1 phần', 120], ['1 phần lớn', 180]), aliases: ['mi lanh', 'naengmyeon', 'mi lanh han quoc'],
  },
  {
    id: 'nuoc-dung-mi-lanh', name: 'Nước dùng mì lạnh', emoji: '🥣', cat: 'dish',
    manual: [{ kcal: 20, p: 1, c: 3.8, f: 0.2, fib: 0, note: 'Nước dùng bò ướp lạnh + giấm + đường, ước tính' }, AI(22.5, 1, 4, 0.25, 0)],
    servings: sv(['1 muỗng canh', 15], ['1 chén', 200]), aliases: ['nuoc mi lanh', 'nuoc dung naengmyeon'],
  },
  {
    id: 'trung-ga-hap-han', name: 'Trứng gà hấp Hàn Quốc', emoji: '🥚', cat: 'protein',
    manual: [{ kcal: 93, p: 7.6, c: 0.7, f: 6.4, fib: 0, note: 'Trứng luộc USDA (155 kcal/100g) × 60% + 40% nước, kiểu gyeran-jjim' }, AI(106.7, 8.7, 1.3, 7.3, 0.1)],
    servings: sv(['1 phần', 80], ['1 tô nhỏ', 150]), aliases: ['trung hap han quoc', 'gyeran jjim', 'trung hap han'],
  },
  {
    id: 'pizza-prosciutto', name: 'Pizza Prosciutto', emoji: '🍕', cat: 'dish', usda: ['170317'], manual: [AI(257.1, 11.4, 27.6, 10.5, 1.4)],
    servings: sv(['1 phần', 210], ['1 miếng', 105]), aliases: ['pizza giam bong', 'pizza ham'],
  },
  {
    id: 'pizza-steak', name: 'Pizza Steak', emoji: '🍕', cat: 'dish', usda: ['170317'], manual: [AI(266.7, 13.3, 26.7, 11.4, 1.4)],
    servings: sv(['1 miếng', 105], ['1 phần', 210]), aliases: ['pizza bo bit tet', 'pizza bo'],
  },
  {
    id: 'mi-y-ngheu-pesto', name: 'Mì Ý nghêu sốt pesto', emoji: '🍝', cat: 'dish',
    manual: [
      { kcal: 187, p: 8.2, c: 25.7, f: 5.4, fib: 1.5, note: 'Tính công thức 250g: 200g mì Ý chín 316 kcal + 30g thịt nghêu + 15g pesto + 5g dầu olive' },
      AI(148.6, 5.7, 17.7, 5.7, 0.9),
    ],
    servings: sv(['1 đĩa', 250]), aliases: ['mi y ngheu pesto', 'spaghetti vongole pesto', 'mi y nghieu'],
  },
  {
    id: 'tra-mang-cau-phuc-long', name: 'Trà mãng cầu Phúc Long', emoji: '🍹', cat: 'drink', manual: [AI(36.7, 0.1, 8.9, 0.04, 0.2)],
    servings: sv(['1 ly 450ml', 450], ['1 ly 360ml', 360]), aliases: ['tra mang cau', 'phuc long mang cau'],
  },
  {
    id: 'patty-tom-chien', name: 'Patty tôm chiên', emoji: '🍤', cat: 'protein', usda: ['171970'], manual: [AI(225, 13.8, 12.5, 12.5, 0.6)],
    servings: sv(['1 cái', 80], ['2 cái', 160]), aliases: ['cha tom chien', 'tom tam bot chien', 'shrimp patty'],
  },
  {
    id: 'hanh-ngo', name: 'Hành ngò', emoji: '🌿', cat: 'veg', usda: ['169997', '170005'], vn: ['4081', '4038'], force: true, // hỗn hợp hành lá + ngò rí nên các nguồn lệch là bình thường
    servings: sv(['1 nắm', 15], ['1 muỗng canh', 5]), aliases: ['hanh la ngo', 'ngo ri hanh la', 'rau thom'],
  },
]

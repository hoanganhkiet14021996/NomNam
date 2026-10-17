import { normalize, searchFoods } from '@/lib/search'
import { scaleNutrients } from '@/lib/nutrition'
import type { AiItem, AiOption, AiQuestion } from '@/lib/ai/gemini'
import type { CookingMethod, Food, FoodCategory, FoodRole, Nutrients } from '@/types'

/** Một thành phần trên màn "Kiểm tra lại": AI đề xuất, người dùng chọn lại món/gram/trả lời câu hỏi. */
export interface ReviewItem {
  key: string
  /** món trong bảng đang chọn; null = dùng số AI ước lượng */
  food: Food | null
  name: string
  emoji: string
  grams: number
  role: FoodRole
  kind: string
  cooking: CookingMethod
  confidence: AiItem['confidence']
  /** tên/emoji/dinh dưỡng (trên 100g) AI ước lượng — dùng khi không chọn món trong bảng */
  ai: { name: string; emoji: string; per100: Nutrients }
  /** tối đa 3 món gần nhất trong bảng để chọn lại */
  candidates: Food[]
  question: AiQuestion | null
  /** nhãn đáp án người dùng đã chọn */
  answer: string | null
  /** lưu thành "món riêng" khi thêm (chỉ áp dụng nếu food = null) */
  saveCustom: boolean
}

export interface UsualPortion {
  grams: number
  count: number
}

/** Tìm món theo id, rồi theo tên/alias khớp CHÍNH XÁC (không dấu) — không khớp mờ để tránh nhầm món. */
export function findFood(item: { name: string; foodId?: string | null }, foods: readonly Food[]): Food | null {
  if (item.foodId) {
    const byId = foods.find((f) => f.id === item.foodId)
    if (byId) return byId
  }
  const key = normalize(item.name)
  if (!key) return null
  return foods.find((f) => normalize(f.name) === key) ?? foods.find((f) => f.aliases?.some((a) => normalize(a) === key)) ?? null
}

/** Ứng viên: id AI gợi ý (hợp lệ) trước, thiếu thì bù bằng tìm kiếm theo tên/loại. Món đang chọn luôn đứng đầu. */
export function pickCandidates(item: Pick<AiItem, 'name' | 'kind' | 'candidates'>, chosen: Food | null, foods: readonly Food[], max = 3): Food[] {
  const out: Food[] = chosen ? [chosen] : []
  const add = (f: Food | undefined) => {
    if (f && out.length < max && !out.some((x) => x.id === f.id)) out.push(f)
  }
  for (const id of item.candidates) add(foods.find((f) => f.id === id))
  for (const q of [item.kind, item.name]) {
    if (out.length >= max || !q) continue
    for (const f of searchFoods(q, foods, max)) add(f)
  }
  return out
}

/** AI trả tổng của phần ăn → quy về trên 100g để người dùng sửa gram vẫn đúng tỉ lệ. */
function aiPer100(item: AiItem): Nutrients {
  const g = item.grams > 0 ? item.grams : 100
  const r = 100 / g
  return { kcal: item.kcal * r, protein: item.protein * r, carbs: item.carbs * r, fat: item.fat * r, fiber: item.fiber * r }
}

export function toReviewItem(item: AiItem, foods: readonly Food[], index = 0): ReviewItem {
  const food = findFood(item, foods)
  return {
    key: `${index}-${item.name}`,
    food,
    name: food?.name ?? item.name,
    emoji: food?.emoji ?? item.emoji,
    grams: item.grams > 0 ? Math.round(item.grams) : 100,
    role: item.role,
    kind: item.kind,
    cooking: item.cooking,
    confidence: item.confidence,
    ai: { name: item.name, emoji: item.emoji, per100: aiPer100(item) },
    candidates: pickCandidates(item, food, foods),
    question: item.question && item.question.options.length >= 2 ? item.question : null,
    answer: null,
    saveCustom: false,
  }
}

/** Dinh dưỡng hiện tại của một thành phần: theo bảng nếu đã chọn món, không thì theo AI. */
export function reviewNutrients(r: Pick<ReviewItem, 'food' | 'ai' | 'grams'>): Nutrients {
  return scaleNutrients(r.food?.per100 ?? r.ai.per100, r.grams)
}

/** Chọn món khác trong bảng (null = quay về ước lượng AI). */
export function chooseFood(r: ReviewItem, food: Food | null): ReviewItem {
  if (!food) return { ...r, food: null, name: r.ai.name, emoji: r.ai.emoji }
  return { ...r, food, name: food.name, emoji: food.emoji, saveCustom: false }
}

/** Trả lời câu hỏi của AI: đổi món và/hoặc gram theo đáp án. */
export function answerQuestion(r: ReviewItem, option: AiOption, foods: readonly Food[]): ReviewItem {
  let next: ReviewItem = { ...r, answer: option.label }
  const food = option.foodId ? foods.find((f) => f.id === option.foodId) : undefined
  if (food) {
    next = chooseFood(next, food)
    if (!next.candidates.some((c) => c.id === food.id)) next.candidates = [food, ...next.candidates].slice(0, 3)
  }
  if (option.grams > 0) next.grams = Math.round(option.grams)
  return next
}

/** Khoá ghi nhớ khẩu phần: theo id món, món không có id thì theo tên không dấu. */
export function portionKey(x: { foodId: string | null; name: string }): string {
  return x.foodId ?? `name:${normalize(x.name)}`
}

/** Phần quen đáng gợi ý: đã ăn ≥ 2 lần và lệch ≥ 10% so với gram hiện tại. */
export function usualSuggestion(r: Pick<ReviewItem, 'food' | 'name' | 'grams'>, usual: Record<string, UsualPortion>): number | null {
  const u = usual[portionKey({ foodId: r.food?.id ?? null, name: r.name })]
  if (!u || u.count < 2) return null
  const g = Math.round(u.grams)
  return Math.abs(g - r.grams) / Math.max(r.grams, 1) >= 0.1 ? g : null
}

const ROLE_CATEGORY: Record<FoodRole, FoodCategory> = {
  carb: 'carb',
  protein: 'protein',
  veg: 'veg',
  fat: 'snack',
  sauce: 'dish',
  drink: 'drink',
  other: 'dish',
}
export const roleToCategory = (role: FoodRole): FoodCategory => ROLE_CATEGORY[role]

export const ROLE_LABEL: Record<FoodRole, string> = {
  carb: 'Tinh bột',
  protein: 'Đạm',
  veg: 'Rau',
  fat: 'Chất béo',
  sauce: 'Nước sốt',
  drink: 'Đồ uống',
  other: 'Khác',
}

export const COOKING_LABEL: Record<CookingMethod, string> = {
  raw: 'sống',
  boiled: 'luộc',
  steamed: 'hấp',
  grilled: 'nướng',
  fried: 'chiên',
  stir_fried: 'xào',
  braised: 'kho',
  soup: 'nấu canh',
  other: '',
}

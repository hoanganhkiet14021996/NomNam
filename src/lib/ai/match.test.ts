import { describe, expect, it } from 'vitest'
import { FOODS } from '@/data/foods.vn'
import { buildReference, parseResult, type AiItem } from '@/lib/ai/gemini'
import { mockAnalyze } from '@/lib/ai/mock'
import { answerQuestion, chooseFood, findFood, pickCandidates, reviewNutrients, toReviewItem, usualSuggestion } from '@/lib/ai/match'

const byId = (id: string) => FOODS.find((f) => f.id === id)!

const base: AiItem = {
  name: 'x',
  emoji: '🍽️',
  role: 'other',
  kind: '',
  cooking: 'other',
  grams: 100,
  kcal: 200,
  protein: 10,
  carbs: 20,
  fat: 5,
  fiber: 1,
  foodId: '',
  candidates: [],
  confidence: 'medium',
  question: null,
}

describe('khớp món AI với bảng món', () => {
  const f = byId('com-trang')

  it('khớp theo foodId → dinh dưỡng tính từ bảng theo gram', () => {
    const r = toReviewItem({ ...base, name: 'tên AI tự đặt', foodId: f.id, grams: 200 }, FOODS)
    expect(r.food?.id).toBe(f.id)
    expect(r.name).toBe(f.name)
    expect(reviewNutrients(r).kcal).toBeCloseTo(f.per100.kcal * 2)
  })

  it('foodId sai nhưng tên khớp chính xác (không dấu, không phân biệt hoa thường) → vẫn khớp', () => {
    expect(findFood({ name: 'COM TRANG', foodId: 'khong-ton-tai' }, FOODS)?.id).toBe(f.id)
  })

  it('khớp theo alias chính xác', () => {
    expect(findFood({ name: 'rice' }, FOODS)?.id).toBe(f.id)
  })

  it('không khớp mờ theo một phần tên (tránh nhầm món)', () => {
    expect(findFood({ name: 'Thịt', foodId: '' }, FOODS)).toBeNull()
  })

  it('không khớp → giữ số AI, quy về trên 100g để sửa gram vẫn đúng tỉ lệ', () => {
    const r = toReviewItem({ ...base, name: 'món lạ hoắc', grams: 50, kcal: 150 }, FOODS)
    expect(r.food).toBeNull()
    expect(r.ai.per100.kcal).toBeCloseTo(300)
    expect(reviewNutrients({ ...r, grams: 100 }).kcal).toBeCloseTo(300)
  })

  it('AI trả gram = 0 → mặc định 100g, không chia cho 0', () => {
    const r = toReviewItem({ ...base, name: 'món lạ', grams: 0, kcal: 120 }, FOODS)
    expect(r.grams).toBe(100)
    expect(reviewNutrients(r).kcal).toBeCloseTo(120)
  })
})

describe('ứng viên & chọn lại', () => {
  it('tối đa 3, không trùng, món đang chọn đứng đầu, bỏ id không tồn tại', () => {
    const chosen = byId('ba-chi-nuong')
    const c = pickCandidates(
      { name: 'thịt nướng', kind: 'thịt heo', candidates: ['khong-co', 'ba-chi-nuong', 'suon-nuong', 'heo-nac-dam-chin', 'com-trang'] },
      chosen,
      FOODS,
    )
    expect(c.length).toBe(3)
    expect(c[0].id).toBe('ba-chi-nuong')
    expect(new Set(c.map((x) => x.id)).size).toBe(3)
  })

  it('AI không gợi ý → bù bằng tìm kiếm theo loại/tên', () => {
    expect(pickCandidates({ name: 'Ức gà', kind: '', candidates: [] }, null, FOODS).length).toBeGreaterThan(0)
  })

  it('chọn món khác → đổi tên + số theo bảng; chọn "AI ước lượng" → quay về tên AI', () => {
    const r = toReviewItem({ ...base, name: 'Thịt heo', foodId: 'ba-chi-nuong', grams: 100 }, FOODS)
    const nac = chooseFood(r, byId('heo-nac-dam-chin'))
    expect(nac.name).toBe(byId('heo-nac-dam-chin').name)
    expect(reviewNutrients(nac).kcal).toBeCloseTo(byId('heo-nac-dam-chin').per100.kcal)
    const back = chooseFood(nac, null)
    expect(back.food).toBeNull()
    expect(back.name).toBe('Thịt heo')
  })

  it('trả lời câu hỏi: đổi món và/hoặc gram theo đáp án', () => {
    const r = toReviewItem({ ...base, name: 'Cơm trắng', foodId: 'com-trang', grams: 180 }, FOODS)
    const g = answerQuestion(r, { label: '2 chén', foodId: '', grams: 300 }, FOODS)
    expect(g.grams).toBe(300)
    expect(g.food?.id).toBe('com-trang')
    expect(g.answer).toBe('2 chén')
    const m = answerQuestion(r, { label: 'Cơm chiên', foodId: 'com-chien-trung', grams: 0 }, FOODS)
    expect(m.food?.id).toBe('com-chien-trung')
    expect(m.grams).toBe(180)
    expect(m.candidates.some((c) => c.id === 'com-chien-trung')).toBe(true)
  })
})

describe('khẩu phần quen', () => {
  const r = toReviewItem({ ...base, name: 'Cơm trắng', foodId: 'com-trang', grams: 150 }, FOODS)
  it('gợi ý khi đã ăn ≥ 2 lần và lệch ≥ 10%', () => {
    expect(usualSuggestion(r, { 'com-trang': { grams: 220, count: 3 } })).toBe(220)
  })
  it('không gợi ý khi mới ăn 1 lần hoặc gần bằng gram hiện tại', () => {
    expect(usualSuggestion(r, { 'com-trang': { grams: 220, count: 1 } })).toBeNull()
    expect(usualSuggestion(r, { 'com-trang': { grams: 155, count: 5 } })).toBeNull()
  })
})

describe('bảng món gửi AI', () => {
  it('mỗi món một dòng [id] tên, không kèm số dinh dưỡng, đủ gọn khi bảng lớn', () => {
    const ref = buildReference(FOODS)
    const lines = ref.split('\n')
    expect(lines).toHaveLength(FOODS.length)
    expect(ref).toContain('[com-trang] Cơm trắng · 1 chén=150g')
    expect(ref).not.toMatch(/kcal/)
    // ~600 món × ≤ 90 ký tự ≈ dưới 15k token mỗi lần gọi
    expect(ref.length / lines.length).toBeLessThan(90)
  })
})

describe('phản hồi AI', () => {
  it('dữ liệu giả lập đọc được và mọi id trong đó có thật', async () => {
    const res = parseResult(await mockAnalyze())
    expect(res.items.length).toBeGreaterThan(0)
    const ids = res.items.flatMap((it) => [it.foodId, ...it.candidates, ...(it.question?.options.map((o) => o.foodId) ?? [])]).filter(Boolean)
    for (const id of ids) expect(FOODS.some((f) => f.id === id), id).toBe(true)
  })

  it('trường thiếu/sai được thay bằng giá trị mặc định thay vì làm hỏng cả kết quả', () => {
    const res = parseResult({
      items: [{ name: 'Cơm', grams: '150', kcal: 195, protein: 4, carbs: 42, fat: 0.5, role: 'lạ', question: { text: 'x', options: [] } }],
    })
    expect(res.items[0].grams).toBe(150)
    expect(res.items[0].role).toBe('other')
    expect(res.items[0].candidates).toEqual([])
    expect(res.items[0].question).toBeNull()
  })
})

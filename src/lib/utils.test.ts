import { describe, expect, it } from 'vitest'
import { addDays, friendlyDay, rangeKeys, toKey, weekKeys } from './date'
import { normalize, searchFoods } from './search'
import { FOODS } from '@/data/foods.vn'
import { frequentItems, mealForNow, recentItems, weightTrend } from '@/store/derive'
import type { FoodLog } from '@/types'

describe('date', () => {
  it('toKey dùng giờ địa phương', () => {
    expect(toKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
    expect(toKey(new Date(2026, 0, 5, 0, 1))).toBe('2026-01-05')
  })
  it('addDays qua tháng/năm', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })
  it('tuần bắt đầu Thứ Hai', () => {
    const w = weekKeys('2026-10-04') // Chủ nhật
    expect(w[0]).toBe('2026-09-28')
    expect(w[6]).toBe('2026-10-04')
  })
  it('rangeKeys', () => {
    expect(rangeKeys('2026-10-01', '2026-10-03')).toEqual(['2026-10-01', '2026-10-02', '2026-10-03'])
  })
  it('friendlyDay', () => {
    expect(friendlyDay('2026-10-04', '2026-10-04')).toBe('Hôm nay')
    expect(friendlyDay('2026-10-03', '2026-10-04')).toBe('Hôm qua')
  })
})

describe('search', () => {
  it('bỏ dấu', () => {
    expect(normalize('Ức Gà  Đùi')).toBe('uc ga dui')
  })
  it('gõ không dấu vẫn ra', () => {
    expect(searchFoods('uc ga', FOODS)[0].name).toMatch(/^Ức gà/)
    expect(searchFoods('pho', FOODS).some((f) => f.id === 'pho-bo')).toBe(true)
    expect(searchFoods('trung', FOODS)[0].id).toBe('trung-ga')
  })
  it('tìm theo alias', () => {
    expect(searchFoods('whey', FOODS)[0].id).toBe('whey')
    expect(searchFoods('egg', FOODS)[0].id).toBe('trung-ga')
  })
  it('food DB có id không trùng và số liệu hợp lệ', () => {
    const ids = new Set(FOODS.map((f) => f.id))
    expect(ids.size).toBe(FOODS.length)
    // kcal khai báo phải gần với 4P + 4(C − xơ) + 2·xơ + 9F. Món rất ít calo (rau) cho sai số tuyệt đối.
    // Bia có cồn (7 kcal/g) nên bỏ qua.
    const off = FOODS.filter((f) => f.id !== 'bia').filter((f) => {
      const { kcal, protein, carbs, fat, fiber } = f.per100
      const est = protein * 4 + (carbs - fiber) * 4 + fiber * 2 + fat * 9
      return kcal < 60 ? Math.abs(est - kcal) > 12 : Math.abs(est - kcal) / kcal > 0.15
    })
    expect(off.map((f) => f.id)).toEqual([])
  })
})

describe('derive', () => {
  const log = (p: Partial<FoodLog>): FoodLog => ({
    id: Math.random().toString(),
    date: '2026-10-04',
    meal: 'lunch',
    name: 'Cơm trắng',
    emoji: '🍚',
    foodId: 'com-trang',
    grams: 150,
    servingLabel: null,
    source: 'db',
    kcal: 195,
    protein: 4,
    carbs: 42,
    fat: 0.5,
    fiber: 0.6,
    createdAt: '2026-10-04T05:00:00.000Z',
    updatedAt: '2026-10-04T05:00:00.000Z',
    deletedAt: null,
    ...p,
  })

  it('recent không trùng và mới nhất trước', () => {
    const logs = [
      log({ id: 'a', createdAt: '2026-10-04T01:00:00Z' }),
      log({ id: 'b', createdAt: '2026-10-04T02:00:00Z', grams: 200 }),
      log({ id: 'c', foodId: 'trung-ga', name: 'Trứng gà', createdAt: '2026-10-04T03:00:00Z' }),
      log({ id: 'd', foodId: 'whey', name: 'Whey', deletedAt: '2026-10-04T04:00:00Z' }),
    ]
    const r = recentItems(Object.fromEntries(logs.map((l) => [l.id, l])))
    expect(r.map((l) => l.id)).toEqual(['c', 'b'])
  })

  it('frequent cần ít nhất 2 lần', () => {
    const logs = [log({ id: 'a' }), log({ id: 'b', date: '2026-10-03' }), log({ id: 'c', foodId: 'x', name: 'X' })]
    const f = frequentItems(Object.fromEntries(logs.map((l) => [l.id, l])), '2026-10-04')
    expect(f.map((l) => l.foodId)).toEqual(['com-trang'])
  })

  it('mealForNow', () => {
    expect(mealForNow(new Date(2026, 0, 1, 7))).toBe('breakfast')
    expect(mealForNow(new Date(2026, 0, 1, 12))).toBe('lunch')
    expect(mealForNow(new Date(2026, 0, 1, 19))).toBe('dinner')
    expect(mealForNow(new Date(2026, 0, 1, 15))).toBe('snack')
  })

  it('weight trend trung bình 7 ngày', () => {
    const w = (id: string, date: string, kg: number) => ({ id, date, kg, updatedAt: '', deletedAt: null })
    const t = weightTrend({ a: w('a', '2026-10-01', 65), b: w('b', '2026-10-02', 66), c: w('c', '2026-10-10', 67) })
    expect(t[1].avg).toBe(65.5)
    expect(t[2].avg).toBe(67)
  })
})

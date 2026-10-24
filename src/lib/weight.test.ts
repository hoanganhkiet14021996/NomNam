import { describe, expect, it } from 'vitest'
import { addDays } from '@/lib/date'
import { adviseCalories, daysSinceLastWeigh, needsWeighReminder, weeklySummaries, weightSlopePerWeek } from '@/lib/weight'
import type { FoodLog, WeightLog } from '@/types'

const TODAY = '2026-10-21' // Thứ Tư

const wl = (entries: [string, number][]): Record<string, WeightLog> =>
  Object.fromEntries(entries.map(([date, kg]) => [date, { id: date, date, kg, updatedAt: date, deletedAt: null }]))

const fl = (entries: [string, number, number?][]): Record<string, FoodLog> =>
  Object.fromEntries(
    entries.map(([date, kcal, protein = 100], i) => [
      `f${i}`,
      {
        id: `f${i}`, date, meal: 'lunch', name: 'x', emoji: '🍽️', foodId: null, grams: 100, servingLabel: null, source: 'db',
        kcal, protein, carbs: 0, fat: 0, fiber: 0, createdAt: date, updatedAt: date, deletedAt: null,
      } as FoodLog,
    ]),
  )

/** n ngày liên tiếp kết thúc ở `end`, kg thay đổi `perDay` mỗi ngày từ `start` kg. */
function series(end: string, n: number, start: number, perDay: number): [string, number][] {
  return Array.from({ length: n }, (_, i) => [addDays(end, -(n - 1 - i)), Math.round((start + perDay * i) * 100) / 100] as [string, number])
}

describe('nhắc cân', () => {
  it('đếm số ngày từ lần cân gần nhất', () => {
    expect(daysSinceLastWeigh(wl([['2026-10-21', 70]]), TODAY)).toBe(0)
    expect(daysSinceLastWeigh(wl([['2026-10-19', 70], ['2026-10-10', 71]]), TODAY)).toBe(2)
    expect(daysSinceLastWeigh({}, TODAY)).toBeNull()
  })
  it('nhắc khi ≥ 2 ngày chưa cân hoặc chưa cân lần nào; hôm qua đã cân thì chưa nhắc', () => {
    expect(needsWeighReminder(wl([['2026-10-20', 70]]), TODAY)).toBe(false)
    expect(needsWeighReminder(wl([['2026-10-19', 70]]), TODAY)).toBe(true)
    expect(needsWeighReminder({}, TODAY)).toBe(true)
  })
  it('lần cân đã xoá không tính', () => {
    const logs = wl([['2026-10-21', 70]])
    logs['2026-10-21'].deletedAt = '2026-10-21T01:00:00Z'
    expect(needsWeighReminder(logs, TODAY)).toBe(true)
  })
})

describe('tóm tắt theo tuần', () => {
  const w = wl([['2026-10-05', 70], ['2026-10-07', 70.4], ['2026-10-12', 70.8], ['2026-10-21', 71.2]])
  const f = fl([
    ['2026-10-12', 2000], ['2026-10-13', 2200], ['2026-10-14', 300], // ngày 14: log dở → bỏ
    ['2026-10-20', 2400], ['2026-10-21', 900], // hôm nay chưa xong → bỏ
  ])
  const s = weeklySummaries({ weightLogs: w, foodLogs: f, today: TODAY, weeks: 3 })
  it('gom đúng 3 tuần Thứ Hai → Chủ Nhật, cũ → mới', () => {
    expect(s.map((x) => x.start)).toEqual(['2026-10-05', '2026-10-12', '2026-10-19'])
    expect(s[2].end).toBe('2026-10-25')
  })
  it('cân trung bình tuần và thay đổi so với tuần trước', () => {
    expect(s[0].weightAvg).toBe(70.2)
    expect(s[1].weightAvg).toBe(70.8)
    expect(s[1].weightDelta).toBe(0.6)
    expect(s[0].weightDelta).toBeNull()
    expect(s[2].weightDelta).toBe(0.4)
  })
  it('kcal trung bình bỏ ngày log dở (< 600) và hôm nay', () => {
    expect(s[1].avgKcal).toBe(2100)
    expect(s[1].loggedDays).toBe(2)
    expect(s[2].avgKcal).toBe(2400)
    expect(s[2].loggedDays).toBe(1)
    expect(s[0].avgKcal).toBeNull()
  })
  it('tuần không có cân → weightAvg null và không phá delta của tuần sau', () => {
    const g = weeklySummaries({ weightLogs: wl([['2026-10-05', 70], ['2026-10-20', 71]]), foodLogs: {}, today: TODAY, weeks: 3 })
    expect(g[1].weightAvg).toBeNull()
    expect(g[2].weightDelta).toBe(1)
  })
})

describe('độ dốc cân nặng', () => {
  it('đúng kg/tuần', () => {
    const pts = series(TODAY, 15, 70, 0.1).map(([date, kg]) => ({ date, kg }))
    expect(weightSlopePerWeek(pts)!).toBeCloseTo(0.7, 2)
  })
  it('ít hơn 2 điểm → null', () => {
    expect(weightSlopePerWeek([{ date: TODAY, kg: 70 }])).toBeNull()
  })
})

describe('gợi ý chỉnh kcal', () => {
  const food = (days: number, kcal = 2200) => fl(Array.from({ length: days }, (_, i) => [addDays(TODAY, -(i + 1)), kcal] as [string, number]))
  const base = { goal: 'bulk' as const, weightKg: 70, targetKcal: 2400, today: TODAY }

  it('chưa đủ dữ liệu → collecting, nói rõ thiếu gì', () => {
    const a = adviseCalories({ ...base, weightLogs: wl(series(TODAY, 3, 70, 0)), foodLogs: food(3) })
    expect(a.kind).toBe('collecting')
    expect(a.missing.length).toBe(2)
    expect(a.newKcal).toBeNull()
  })
  it('lean bulk mà cân đang giảm → đề xuất tăng 250 kcal, kèm TDEE thực tế', () => {
    const a = adviseCalories({ ...base, weightLogs: wl(series(TODAY, 21, 71, -0.05)), foodLogs: food(18) })
    expect(a.kind).toBe('raise')
    expect(a.delta).toBe(250)
    expect(a.newKcal).toBe(2650)
    expect(a.slope!).toBeCloseTo(-0.35, 2)
    expect(a.tdee).toBe(Math.round(2200 + 0.35 * (7700 / 7)))
  })
  it('đang tăng trong khoảng 0,2–0,5 kg/tuần → ok, không đề xuất', () => {
    const a = adviseCalories({ ...base, weightLogs: wl(series(TODAY, 21, 70, 0.05)), foodLogs: food(18) })
    expect(a.kind).toBe('ok')
    expect(a.delta).toBe(0)
  })
  it('tăng quá nhanh khi bulk → đề xuất giảm', () => {
    const a = adviseCalories({ ...base, weightLogs: wl(series(TODAY, 21, 70, 0.15)), foodLogs: food(18) })
    expect(a.kind).toBe('lower')
    expect(a.delta).toBeLessThan(0)
    expect(a.delta).toBeGreaterThanOrEqual(-250)
  })
  it('giảm mỡ: giảm quá chậm → hạ kcal; giảm hợp lý → ok', () => {
    const cut = { ...base, goal: 'cut' as const }
    const slow = adviseCalories({ ...cut, weightLogs: wl(series(TODAY, 21, 70, 0)), foodLogs: food(18) })
    expect(slow.kind).toBe('lower')
    const ok = adviseCalories({ ...cut, weightLogs: wl(series(TODAY, 21, 70, -0.06)), foodLogs: food(18) })
    expect(ok.kind).toBe('ok')
  })
  it('chỉ tính dữ liệu từ sau lần chỉnh gần nhất', () => {
    const adjustedAt = `${addDays(TODAY, -5)}T08:00:00.000Z`
    const a = adviseCalories({ ...base, adjustedAt, weightLogs: wl(series(TODAY, 21, 71, -0.05)), foodLogs: food(18) })
    expect(a.kind).toBe('collecting')
    expect(a.from).toBe(addDays(TODAY, -4))
  })
  it('không đề xuất kcal dưới 1200', () => {
    const a = adviseCalories({ ...base, goal: 'cut', targetKcal: 1250, weightLogs: wl(series(TODAY, 21, 70, 0)), foodLogs: food(18) })
    expect(a.newKcal).toBeGreaterThanOrEqual(1200)
  })
  it('log thiếu ngày (< 8 ngày đủ) → collecting dù cân đã đủ', () => {
    const a = adviseCalories({ ...base, weightLogs: wl(series(TODAY, 21, 71, -0.05)), foodLogs: food(5) })
    expect(a.kind).toBe('collecting')
  })
})

import { describe, expect, it } from 'vitest'
import { DEFAULT_PROFILE } from '@/data/defaults'
import { addDays } from '@/lib/date'
import { buildFitnessReport } from '@/lib/fitnessReport'
import type { ActivityLog, FoodLog, WeightLog } from '@/types'

const TODAY = '2026-10-21'
const food = (date: string, kcal: number, protein: number, meal: FoodLog['meal'] = 'lunch', name = 'Cơm gà'): FoodLog => ({
  id: `${date}-${meal}`, date, meal, name, emoji: '🍗', foodId: null, grams: 300, servingLabel: null, source: 'ai',
  kcal, protein, carbs: 100, fat: 30, fiber: 5, createdAt: date, updatedAt: date, deletedAt: null,
})
const weight = (date: string, kg: number): WeightLog => ({ id: date, date, kg, updatedAt: date, deletedAt: null })
const activity = (date: string): ActivityLog => ({ id: `a${date}`, date, activityId: 'gym', name: 'Gym', emoji: '🏋️', minutes: 60, intensity: 'moderate', met: 5, kcal: 300, manual: false, createdAt: date, updatedAt: date, deletedAt: null })

function dataset() {
  const foodLogs: Record<string, FoodLog> = {}
  const weightLogs: Record<string, WeightLog> = {}
  const activityLogs: Record<string, ActivityLog> = {}
  for (let i = 1; i <= 20; i++) {
    const d = addDays(TODAY, -i)
    const f = food(d, 2000, 130)
    foodLogs[f.id] = f
    const w = weight(d, 70 + 0.05 * i) // giảm dần theo thời gian
    weightLogs[w.id] = w
    if (i % 3 === 0) activityLogs[`a${d}`] = activity(d)
  }
  const partial = food(addDays(TODAY, -25), 300, 20, 'snack')
  foodLogs[partial.id] = partial
  foodLogs.today = food(TODAY, 800, 40)
  return { foodLogs, weightLogs, activityLogs }
}

describe('báo cáo fitness', () => {
  const md = buildFitnessReport({ ...dataset(), profile: { ...DEFAULT_PROFILE, weightKg: 70 }, today: TODAY, days: 28 })

  it('có đủ các mục chính và đầu báo cáo ghi ngày tạo', () => {
    for (const h of ['# Báo cáo fitness NomNam', '## Hồ sơ & mục tiêu', '## Cân nặng', '## Tổng quan 28 ngày', '## Theo tuần', '## Từng ngày', '## Vận động', '## Ước tính TDEE thực tế', '## Chất lượng dữ liệu log'])
      expect(md).toContain(h)
    expect(md).toContain(`tạo ${TODAY}`)
  })
  it('chỉ tính ngày đủ log, bỏ hôm nay và ngày log dở', () => {
    expect(md).toContain('Ngày đủ log: **20/27**')
    expect(md).toContain('2.000 kcal')
    expect(md).toContain('(hôm nay, chưa tính)')
  })
  it('cân giảm theo thời gian → xu hướng âm và TDEE thực tế cao hơn kcal ăn', () => {
    expect(md).toContain('14 ngày gần nhất −0,4 kg/tuần')
    expect(md).toContain('≈ **2.385 kcal/ngày**') // 2000 − (−0,35 × 1100)
  })
  it('đếm buổi tập và ghi nhận nguồn AI ước lượng', () => {
    expect(md).toContain('Gym 6 buổi/360')
    expect(md).toContain('AI ước lượng 100%')
  })
  it('hồ sơ chưa có dữ liệu vẫn tạo được báo cáo, không lỗi', () => {
    const empty = buildFitnessReport({ foodLogs: {}, activityLogs: {}, weightLogs: {}, profile: DEFAULT_PROFILE, today: TODAY })
    expect(empty).toContain('Chưa có lần cân nào')
    expect(empty).toContain('Không có buổi tập nào')
  })
})

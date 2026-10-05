import { describe, expect, it } from 'vitest'
import {
  calcAutoTargets,
  calcBMR,
  calcTargets,
  dailyBudget,
  dayAdherence,
  scaleNutrients,
  splitMacros,
  sumNutrients,
} from './nutrition'
import { activityKcal } from './met'
import { DEFAULT_PROFILE } from '@/data/defaults'
import type { Profile } from '@/types'

const me: Profile = { ...DEFAULT_PROFILE, sex: 'male', age: 25, heightCm: 170, weightKg: 65, neat: 1.375, goal: 'bulk' }

describe('BMR & mục tiêu', () => {
  it('Mifflin-St Jeor nam/nữ', () => {
    expect(calcBMR(me)).toBeCloseTo(10 * 65 + 6.25 * 170 - 5 * 25 + 5) // 1592.5
    expect(calcBMR({ ...me, sex: 'female' })).toBeCloseTo(1592.5 - 166)
  })

  it('lean bulk = BMR × NEAT × 1.10, protein 2 g/kg', () => {
    const t = calcAutoTargets(me)
    expect(t.kcal).toBe(Math.round(1592.5 * 1.375 * 1.1)) // 2409
    expect(t.protein).toBe(130)
  })

  it('macro cộng lại xấp xỉ kcal', () => {
    const t = splitMacros(2400, 130)
    const kcalFromMacros = t.protein * 4 + t.carbs * 4 + t.fat * 9
    expect(Math.abs(kcalFromMacros - 2400)).toBeLessThan(10)
    expect(t.fiber).toBe(34)
  })

  it('override kcal → carbs tính lại cho khớp', () => {
    const t = calcTargets({ ...me, overrides: { kcal: 3000, protein: 150 } })
    expect(t.kcal).toBe(3000)
    expect(t.protein).toBe(150)
    expect(t.protein * 4 + t.carbs * 4 + t.fat * 9).toBeGreaterThan(2990)
  })

  it('không xuống dưới 1200 kcal', () => {
    expect(calcAutoTargets({ ...me, weightKg: 40, heightCm: 145, age: 60, sex: 'female', neat: 1.2, goal: 'cut' }).kcal).toBe(1200)
  })
})

describe('Món ăn', () => {
  it('scale theo gram', () => {
    const n = scaleNutrients({ kcal: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 }, 150)
    expect(n.kcal).toBeCloseTo(247.5)
    expect(n.protein).toBeCloseTo(46.5)
  })
  it('cộng tổng', () => {
    const s = sumNutrients([
      { kcal: 100, protein: 10, carbs: 5, fat: 2, fiber: 1 },
      { kcal: 50, protein: 1, carbs: 10, fat: 0, fiber: 2 },
    ])
    expect(s).toEqual({ kcal: 150, protein: 11, carbs: 15, fat: 2, fiber: 3 })
  })
})

describe('Vận động & quỹ calo', () => {
  it('đá banh vừa 60 phút, 65kg = (7−1)×65 = 390 kcal; cộng lại 50% = 195', () => {
    const kcal = activityKcal(7, 65, 60)
    expect(kcal).toBe(390)
    expect(dailyBudget(2409, kcal, 50)).toBe(2409 + 195)
  })
  it('đầu vào không hợp lệ → 0', () => {
    expect(activityKcal(1, 65, 60)).toBe(0)
    expect(activityKcal(5, 65, 0)).toBe(0)
  })
})

describe('Đạt mục tiêu ngày', () => {
  const eaten = (kcal: number, protein: number) => ({ kcal, protein, carbs: 0, fat: 0, fiber: 0 })
  it('trong ±10% quỹ calo và đủ protein → đạt', () => {
    const a = dayAdherence(eaten(2300, 131), 2400, 130)
    expect(a.kcalOk).toBe(true)
    expect(a.proteinOk).toBe(true)
    expect(a.hit).toBe(true)
  })
  it('ăn thiếu nhiều (bulk) → không đạt calo', () => {
    expect(dayAdherence(eaten(2000, 140), 2400, 130).kcalOk).toBe(false)
  })
  it('thiếu protein → không đạt', () => {
    expect(dayAdherence(eaten(2400, 120), 2400, 130).proteinOk).toBe(false)
  })
  it('chưa log gì → không tính đạt', () => {
    expect(dayAdherence(eaten(0, 0), 2400, 130).logged).toBe(false)
  })
})

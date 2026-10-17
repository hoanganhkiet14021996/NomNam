import { describe, expect, it } from 'vitest'
import widgetSrc from '../../scripts/widget/nomnam-widget.js?raw'
import { usernameToEmail } from './auth'
import { calcTargets as appTargets } from './nutrition'
import { summarizeDay } from '@/store/derive'
import type { FoodLog, Profile } from '@/types'

/**
 * Script widget (Scriptable) chép lại công thức mục tiêu của app → test này giữ hai bên không lệch nhau.
 * Chạy script ngoài Scriptable: không có `Script` nên nó chỉ export hàm thuần (các API Scriptable được giả lập rỗng).
 */
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (...args: string[]) => (...a: unknown[]) => Promise<void>
class FakeColor {}
const FakeDevice = { isUsingDarkAppearance: () => false }
function loadWidget() {
  const mod: { exports: Record<string, (...a: never[]) => unknown> } = { exports: {} }
  void new AsyncFunction('module', 'Color', 'Device', widgetSrc)(mod, FakeColor, FakeDevice)
  return mod.exports
}
const w = loadWidget()

const base: Profile = {
  sex: 'male',
  age: 25,
  heightCm: 170,
  weightKg: 65,
  neat: 1.375,
  goal: 'bulk',
  proteinPerKg: 2,
  overrides: {},
  exerciseEatBackPct: 50,
  updatedAt: '',
}
const toRow = (p: Profile) => ({
  sex: p.sex,
  age: p.age,
  height_cm: p.heightCm,
  weight_kg: p.weightKg,
  neat: p.neat,
  goal: p.goal,
  protein_per_kg: p.proteinPerKg,
  overrides: p.overrides,
  exercise_eat_back_pct: p.exerciseEatBackPct,
})

describe('script widget khớp app', () => {
  const profiles: Profile[] = [
    base,
    { ...base, sex: 'female', age: 31, heightCm: 158, weightKg: 52, goal: 'cut', proteinPerKg: 2.2, neat: 1.2 },
    { ...base, goal: 'maintain', neat: 1.55, weightKg: 80 },
    { ...base, sex: 'female', weightKg: 35, heightCm: 140, age: 60, goal: 'cut', neat: 1.2 }, // chạm sàn 1200 kcal
    { ...base, overrides: { kcal: 3000, protein: 150 } },
    { ...base, overrides: { protein: 170 } },
  ]

  it('mục tiêu kcal / protein / carbs / fat / xơ', () => {
    for (const p of profiles) {
      expect(w.calcTargets(toRow(p) as never)).toEqual(appTargets(p))
    }
    // override từng macro riêng lẻ
    for (const overrides of [{ fat: 90 }, { carbs: 200 }, { fiber: 40 }, { kcal: 2800, fat: 70, carbs: 350, fiber: 30, protein: 160 }]) {
      const p = { ...base, overrides }
      expect(w.calcTargets(toRow(p) as never)).toEqual(appTargets(p))
    }
  })

  it('tổng kết ngày: đã ăn, quỹ ngày, còn lại từng chất', () => {
    const food = (kcal: number, protein: number, carbs: number, fat: number, fiber: number): FoodLog =>
      ({ kcal, protein, carbs, fat, fiber, name: 'x', createdAt: '', emoji: '🍽️', meal: 'lunch', date: '2026-10-17', deletedAt: null }) as unknown as FoodLog
    const logs = [food(500, 30, 60, 15, 4), food(700, 45, 80, 20, 6)]
    const acts = [{ kcal: 400 }, { kcal: 100 }]
    const s = w.computeSummary(toRow(base) as never, logs as never, acts as never) as {
      budget: number
      bonus: number
      remainingKcal: number
      eaten: Record<string, number>
      remaining: Record<string, number>
    }
    const ref = summarizeDay('2026-10-17', logs, acts as never, base)
    expect(s.budget).toBe(ref.budget)
    expect(s.remainingKcal).toBe(ref.remaining)
    expect(s.eaten).toEqual(ref.eaten)
    expect(s.remaining).toEqual({
      protein: ref.targets.protein - ref.eaten.protein,
      carbs: ref.targets.carbs - ref.eaten.carbs,
      fat: ref.targets.fat - ref.eaten.fat,
      fiber: ref.targets.fiber - ref.eaten.fiber,
    })
  })

  it('tên → email giống app (bỏ dấu, đ, khoảng trắng)', () => {
    for (const name of ['Kiệt Hoàng', 'đức  Anh', 'nam_01', ' Lê Văn Đạt ']) {
      expect(w.usernameToEmail(name as never)).toBe(usernameToEmail(name))
    }
  })

  it('ngày địa phương và định dạng số', () => {
    expect(w.localDateKey(new Date(2026, 0, 5, 23, 59) as never)).toBe('2026-01-05')
    expect(w.fmt(2259.4 as never)).toBe('2.259')
    expect(w.fmt(-0 as never)).toBe('0')
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

// Không có IndexedDB trong môi trường test → giả lập bằng Map
vi.mock('idb-keyval', () => {
  const m = new Map<string, unknown>()
  return {
    get: async (k: string) => m.get(k),
    set: async (k: string, v: unknown) => void m.set(k, v),
    del: async (k: string) => void m.delete(k),
  }
})

import { useAppStore, type NewFoodLog } from './useAppStore'
import { activitiesForDate, logsForDate, summarizeDay } from './derive'
import { DEFAULT_PROFILE } from '@/data/defaults'
import { FOODS } from '@/data/foods.vn'
import { calcTargets } from '@/lib/nutrition'

const DAY = '2026-10-05'
const store = () => useAppStore.getState()

const log = (over: Partial<NewFoodLog> = {}): NewFoodLog => ({
  date: DAY,
  meal: 'lunch',
  name: 'Ức gà',
  emoji: '🍗',
  foodId: 'uc-ga',
  grams: 150,
  servingLabel: null,
  source: 'db',
  kcal: 248,
  protein: 46,
  carbs: 0,
  fat: 5,
  fiber: 0,
  ...over,
})

beforeEach(() => store()._resetData())

describe('thêm / xoá / hoàn tác món ăn', () => {
  it('thêm món → hiện trong ngày và vào outbox để sync', () => {
    const [id] = store().addFoodLogs([log()])
    expect(logsForDate(store().foodLogs, DAY)).toHaveLength(1)
    expect(store().outbox[`food_logs:${id}`]).toBe(true)
  })

  it('xoá = soft delete: ẩn khỏi ngày nhưng bản ghi còn (để sync)', () => {
    const [id] = store().addFoodLogs([log()])
    store().removeFoodLog(id)
    expect(logsForDate(store().foodLogs, DAY)).toHaveLength(0)
    expect(store().foodLogs[id].deletedAt).not.toBeNull()
  })

  it('Hoàn tác đưa món trở lại', () => {
    const [id] = store().addFoodLogs([log()])
    store().removeFoodLog(id)
    store().restoreFoodLog(id)
    expect(logsForDate(store().foodLogs, DAY)).toHaveLength(1)
    expect(store().foodLogs[id].deletedAt).toBeNull()
  })

  it('xoá id không tồn tại không gây lỗi', () => {
    expect(() => store().removeFoodLog('khong-co')).not.toThrow()
  })

  it('thêm nhiều món một lần → mỗi món id riêng', () => {
    const ids = store().addFoodLogs([log(), log({ name: 'Cơm' }), log({ name: 'Trứng' })])
    expect(new Set(ids).size).toBe(3)
    expect(logsForDate(store().foodLogs, DAY)).toHaveLength(3)
  })

  it('log ngày khác không lẫn vào ngày đang xem', () => {
    store().addFoodLogs([log({ date: '2026-10-04' })])
    expect(logsForDate(store().foodLogs, DAY)).toHaveLength(0)
  })

  it('sửa món cập nhật số liệu', () => {
    const [id] = store().addFoodLogs([log()])
    store().updateFoodLog(id, { grams: 300, kcal: 496 })
    expect(store().foodLogs[id]).toMatchObject({ grams: 300, kcal: 496 })
  })

  it('copy ngày: nhân bản món chưa xoá, bỏ qua món đã xoá', () => {
    const [a, b] = store().addFoodLogs([log(), log({ name: 'Cơm' })])
    store().removeFoodLog(b)
    expect(store().copyDay(DAY, '2026-10-06')).toBe(1)
    const copied = logsForDate(store().foodLogs, '2026-10-06')
    expect(copied).toHaveLength(1)
    expect(copied[0].id).not.toBe(a)
  })
})

describe('bữa mẫu & món riêng', () => {
  it('lưu bữa mẫu, xoá, hoàn tác', () => {
    const id = store().saveMeal('Bữa gym', [])
    store().removeSavedMeal(id)
    expect(store().savedMeals[id].deletedAt).not.toBeNull()
    store().restoreSavedMeal(id)
    expect(store().savedMeals[id].deletedAt).toBeNull()
  })

  it('món riêng: thêm, xoá, hoàn tác', () => {
    const f = store().addCustomFood({
      name: 'Món nhà làm',
      emoji: '🍲',
      category: 'dish',
      per100: { kcal: 100, protein: 5, carbs: 10, fat: 3, fiber: 1 },
      servings: [],
      defaultGrams: 100,
      aliases: [],
    })
    expect(store().customFoods[f.id].custom).toBe(true)
    store().removeCustomFood(f.id)
    expect(store().customFoods[f.id].deletedAt).not.toBeNull()
    store().restoreCustomFood(f.id)
    expect(store().customFoods[f.id].deletedAt).toBeNull()
  })
})

const ACT = {
  date: DAY,
  activityId: 'football',
  name: 'Đá banh',
  emoji: '⚽',
  minutes: 90,
  intensity: 'moderate' as const,
  met: 7,
  kcal: 600,
  manual: false,
}

describe('vận động & cân nặng', () => {
  it('thêm / xoá / hoàn tác vận động', () => {
    const id = store().addActivity(ACT)
    expect(activitiesForDate(store().activityLogs, DAY)).toHaveLength(1)
    store().removeActivity(id)
    expect(activitiesForDate(store().activityLogs, DAY)).toHaveLength(0)
    store().restoreActivity(id)
    expect(activitiesForDate(store().activityLogs, DAY)).toHaveLength(1)
  })

  it('ghi cân cùng ngày hai lần → cập nhật, không tạo bản ghi thứ hai', () => {
    store().setWeight(DAY, 70)
    store().setWeight(DAY, 71)
    const alive = Object.values(store().weightLogs).filter((w) => !w.deletedAt)
    expect(alive).toHaveLength(1)
    expect(alive[0].kg).toBe(71)
  })

  it('cân mới nhất được dùng làm cân nặng tính mục tiêu', () => {
    store().setWeight(DAY, 68.5)
    expect(store().profile.weightKg).toBe(68.5)
  })
})

describe('tổng kết ngày', () => {
  it('cộng đúng kcal/protein, món đã xoá không tính, tập luyện cộng vào quỹ ngày', () => {
    const [, b] = store().addFoodLogs([log(), log({ name: 'Cơm', kcal: 200, protein: 4 })])
    store().removeFoodLog(b)
    const logs = logsForDate(store().foodLogs, DAY)
    const targets = calcTargets(DEFAULT_PROFILE)

    const rest = summarizeDay(DAY, logs, [], DEFAULT_PROFILE, targets)
    expect(rest.eaten.kcal).toBe(248)
    expect(rest.eaten.protein).toBe(46)
    expect(rest.budget).toBe(targets.kcal)

    store().addActivity(ACT)
    const trained = summarizeDay(DAY, logs, activitiesForDate(store().activityLogs, DAY), DEFAULT_PROFILE, targets)
    expect(trained.exerciseKcal).toBe(600)
    expect(trained.budget).toBeGreaterThan(rest.budget)
  })
})

describe('sync (merge từ server)', () => {
  it('bản ghi server mới hơn thắng, cũ hơn bị bỏ qua', () => {
    const [id] = store().addFoodLogs([log()])
    const local = store().foodLogs[id]

    store()._merge('food_logs', [{ ...local, kcal: 1, updatedAt: '2000-01-01T00:00:00.000Z' }])
    expect(store().foodLogs[id].kcal).toBe(248)

    store()._merge('food_logs', [{ ...local, kcal: 999, updatedAt: '2999-01-01T00:00:00.000Z' }])
    expect(store().foodLogs[id].kcal).toBe(999)
    expect(store().outbox[`food_logs:${id}`]).toBeUndefined()
  })

  it('đổi user: _resetData xoá sạch dữ liệu local', () => {
    store().addFoodLogs([log()])
    store()._resetData()
    expect(Object.keys(store().foodLogs)).toHaveLength(0)
    expect(Object.keys(store().outbox)).toHaveLength(0)
  })
})

describe('dữ liệu món ăn có sẵn', () => {
  it('id không trùng, số liệu không âm, kcal hợp lý', () => {
    const ids = FOODS.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of FOODS) {
      const { kcal, protein, carbs, fat, fiber } = f.per100
      expect([kcal, protein, carbs, fat, fiber].every((n) => n >= 0), f.name).toBe(true)
      expect(f.defaultGrams, f.name).toBeGreaterThan(0)
      // kcal không thể thấp hơn nhiều so với macro cộng lại (4/4/9)
      expect(kcal, f.name).toBeGreaterThanOrEqual((protein * 4 + carbs * 4 + fat * 9) * 0.6)
    }
  })
})

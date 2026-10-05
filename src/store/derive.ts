import type { ActivityLog, Food, FoodLog, MealType, Nutrients, Profile, Targets, WeightLog } from '@/types'
import { FOODS } from '@/data/foods.vn'
import { calcTargets, dailyBudget, dayAdherence, fmtG, pickNutrients, sumNutrients, type DayAdherence } from '@/lib/nutrition'
import { addDays } from '@/lib/date'

export const MEALS: { id: MealType; label: string; short: string; emoji: string }[] = [
  { id: 'breakfast', label: 'Bữa sáng', short: 'Sáng', emoji: '🌅' },
  { id: 'lunch', label: 'Bữa trưa', short: 'Trưa', emoji: '☀️' },
  { id: 'dinner', label: 'Bữa tối', short: 'Tối', emoji: '🌙' },
  { id: 'snack', label: 'Ăn vặt', short: 'Ăn vặt', emoji: '🍎' },
]

export const MEAL_LABEL: Record<MealType, string> = Object.fromEntries(MEALS.map((m) => [m.id, m.label])) as Record<
  MealType,
  string
>

/** Bữa mặc định theo giờ hiện tại. */
export function mealForNow(d = new Date()): MealType {
  const h = d.getHours() + d.getMinutes() / 60
  if (h >= 4 && h < 10.5) return 'breakfast'
  if (h >= 10.5 && h < 14.5) return 'lunch'
  if (h >= 17 && h < 21.5) return 'dinner'
  return 'snack'
}

/** "1 chén · 150g", "150g" hoặc "Nhập nhanh". */
export function portionText(l: Pick<FoodLog, 'grams' | 'servingLabel' | 'source'>): string {
  if (l.source === 'quick' || !l.grams) return 'Nhập nhanh'
  if (l.servingLabel && !/^\d+g$/.test(l.servingLabel)) return `${l.servingLabel} · ${fmtG(l.grams)}g`
  return `${fmtG(l.grams)}g`
}

const alive =<T extends { deletedAt: string | null }>(x: T) => !x.deletedAt

export function logsForDate(foodLogs: Record<string, FoodLog>, date: string): FoodLog[] {
  return Object.values(foodLogs)
    .filter((l) => alive(l) && l.date === date)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function activitiesForDate(activityLogs: Record<string, ActivityLog>, date: string): ActivityLog[] {
  return Object.values(activityLogs)
    .filter((a) => alive(a) && a.date === date)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function allFoods(customFoods: Record<string, Food>): Food[] {
  return [...Object.values(customFoods).filter((f) => !f.deletedAt), ...FOODS]
}

export interface DaySummary {
  date: string
  eaten: Nutrients
  exerciseKcal: number
  targets: Targets
  budget: number
  remaining: number
  adherence: DayAdherence
}

export function summarizeDay(
  date: string,
  logs: FoodLog[],
  activities: ActivityLog[],
  profile: Profile,
  targets: Targets = calcTargets(profile),
): DaySummary {
  const eaten = sumNutrients(logs.map(pickNutrients))
  const exerciseKcal = activities.reduce((s, a) => s + a.kcal, 0)
  const budget = dailyBudget(targets.kcal, exerciseKcal, profile.exerciseEatBackPct)
  return {
    date,
    eaten,
    exerciseKcal,
    targets,
    budget,
    remaining: budget - eaten.kcal,
    adherence: dayAdherence(eaten, budget, targets.protein),
  }
}

/** Khoá gom nhóm món giống nhau (cùng món DB hoặc cùng tên). */
export const itemKey = (l: Pick<FoodLog, 'foodId' | 'name'>) => l.foodId ?? `name:${l.name.toLowerCase()}`

/** Món ăn gần đây (không trùng), mới nhất trước — giữ khẩu phần lần cuối. */
export function recentItems(foodLogs: Record<string, FoodLog>, limit = 30): FoodLog[] {
  const seen = new Set<string>()
  const out: FoodLog[] = []
  const sorted = Object.values(foodLogs)
    .filter(alive)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  for (const l of sorted) {
    const k = itemKey(l)
    if (seen.has(k)) continue
    seen.add(k)
    out.push(l)
    if (out.length >= limit) break
  }
  return out
}

/** Món hay ăn trong 30 ngày, ưu tiên món hay ăn ở bữa `meal`. */
export function frequentItems(
  foodLogs: Record<string, FoodLog>,
  today: string,
  meal?: MealType,
  limit = 20,
): FoodLog[] {
  const since = addDays(today, -30)
  const stats = new Map<string, { count: number; last: FoodLog }>()
  for (const l of Object.values(foodLogs)) {
    if (!alive(l) || l.date < since) continue
    const k = itemKey(l)
    const weight = meal && l.meal === meal ? 2 : 1
    const cur = stats.get(k)
    if (!cur) stats.set(k, { count: weight, last: l })
    else {
      cur.count += weight
      if (l.createdAt > cur.last.createdAt) cur.last = l
    }
  }
  return [...stats.values()]
    .filter((s) => s.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((s) => s.last)
}

/** Trung bình trượt 7 ngày của cân nặng (theo ngày có cân). */
export function weightTrend(weights: Record<string, WeightLog>): { date: string; kg: number; avg: number }[] {
  const list = Object.values(weights)
    .filter(alive)
    .sort((a, b) => a.date.localeCompare(b.date))
  return list.map((w) => {
    const from = addDays(w.date, -6)
    const window = list.filter((x) => x.date >= from && x.date <= w.date)
    const avg = window.reduce((s, x) => s + x.kg, 0) / window.length
    return { date: w.date, kg: w.kg, avg: Math.round(avg * 10) / 10 }
  })
}

import { addDays, fromKey, weekKeys } from '@/lib/date'
import type { FoodLog, Goal, WeightLog } from '@/types'

/** Logic thuần cho theo dõi cân nặng nhiều tuần, nhắc cân và gợi ý chỉnh kcal (có test: weight.test.ts). */

/** 1 kg mỡ/cơ thể thay đổi ≈ 7700 kcal → 1 kg/tuần ≈ 1100 kcal/ngày. */
export const KCAL_PER_KG_PER_DAY = 7700 / 7
/** Ngày có tổng log dưới mức này coi là log chưa đủ (quên log), không đưa vào trung bình kcal. */
export const MIN_COMPLETE_DAY_KCAL = 600

export interface WeightPoint {
  date: string
  kg: number
}

const alive = <T extends { deletedAt: string | null }>(x: T) => !x.deletedAt

/** Các lần cân còn hiệu lực, cũ → mới. */
export function weighIns(weightLogs: Record<string, WeightLog>): WeightPoint[] {
  return Object.values(weightLogs)
    .filter(alive)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((w) => ({ date: w.date, kg: w.kg }))
}

export function daysBetween(from: string, to: string): number {
  return Math.round((fromKey(to).getTime() - fromKey(from).getTime()) / 864e5)
}

/** Số ngày từ lần cân gần nhất tới `today` (0 = đã cân hôm nay); null nếu chưa cân lần nào. */
export function daysSinceLastWeigh(weightLogs: Record<string, WeightLog>, today: string): number | null {
  const last = weighIns(weightLogs).filter((w) => w.date <= today).at(-1)
  return last ? daysBetween(last.date, today) : null
}

/** Nhắc cân khi đã ≥ 2 ngày chưa cân (hoặc chưa cân lần nào). */
export function needsWeighReminder(weightLogs: Record<string, WeightLog>, today: string, afterDays = 2): boolean {
  const d = daysSinceLastWeigh(weightLogs, today)
  return d === null || d >= afterDays
}

export interface DayIntake {
  kcal: number
  protein: number
}

/** Tổng kcal/protein mỗi ngày từ nhật ký ăn. */
export function dailyIntake(foodLogs: Record<string, FoodLog>): Map<string, DayIntake> {
  const m = new Map<string, DayIntake>()
  for (const l of Object.values(foodLogs)) {
    if (!alive(l)) continue
    const cur = m.get(l.date) ?? { kcal: 0, protein: 0 }
    cur.kcal += l.kcal
    cur.protein += l.protein
    m.set(l.date, cur)
  }
  return m
}

/** Ngày đã log đủ để tính trung bình: trước hôm nay (hôm nay chưa xong) và ≥ MIN_COMPLETE_DAY_KCAL. */
function completeDays(intake: Map<string, DayIntake>, from: string, to: string, today: string): [string, DayIntake][] {
  const out: [string, DayIntake][] = []
  for (let d = from; d <= to; d = addDays(d, 1)) {
    const v = intake.get(d)
    if (d < today && v && v.kcal >= MIN_COMPLETE_DAY_KCAL) out.push([d, v])
  }
  return out
}

const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null)
const r1 = (x: number) => Math.round(x * 10) / 10

export interface WeekSummary {
  start: string
  end: string
  weightAvg: number | null
  weighIns: number
  /** thay đổi trung bình cân so với tuần trước có cân (null nếu không có để so) */
  weightDelta: number | null
  avgKcal: number | null
  avgProtein: number | null
  avgBudget: number | null
  loggedDays: number
}

/** Tóm tắt N tuần gần nhất (Thứ Hai → Chủ Nhật), cũ → mới. `budgetOf(date)` = quỹ kcal của ngày đó. */
export function weeklySummaries(opts: {
  weightLogs: Record<string, WeightLog>
  foodLogs: Record<string, FoodLog>
  today: string
  weeks: number
  budgetOf?: (date: string) => number
}): WeekSummary[] {
  const { weightLogs, foodLogs, today, weeks, budgetOf } = opts
  const w = weighIns(weightLogs)
  const intake = dailyIntake(foodLogs)
  const thisMonday = weekKeys(today)[0]
  const out: WeekSummary[] = []
  for (let i = weeks - 1; i >= 0; i--) {
    const start = addDays(thisMonday, -7 * i)
    const end = addDays(start, 6)
    const ws = w.filter((x) => x.date >= start && x.date <= end)
    const days = completeDays(intake, start, end, today)
    out.push({
      start,
      end,
      weightAvg: ws.length ? r1(mean(ws.map((x) => x.kg))!) : null,
      weighIns: ws.length,
      weightDelta: null,
      avgKcal: days.length ? Math.round(mean(days.map(([, v]) => v.kcal))!) : null,
      avgProtein: days.length ? Math.round(mean(days.map(([, v]) => v.protein))!) : null,
      avgBudget: days.length && budgetOf ? Math.round(mean(days.map(([d]) => budgetOf(d)))!) : null,
      loggedDays: days.length,
    })
  }
  let prev: number | null = null
  for (const s of out) {
    if (s.weightAvg !== null) {
      if (prev !== null) s.weightDelta = r1(s.weightAvg - prev)
      prev = s.weightAvg
    }
  }
  return out
}

/** Độ dốc cân nặng (kg/tuần) bằng hồi quy tuyến tính trên các lần cân; null nếu < 2 điểm hoặc cùng 1 ngày. */
export function weightSlopePerWeek(points: WeightPoint[]): number | null {
  if (points.length < 2) return null
  const t0 = points[0].date
  const xs = points.map((p) => daysBetween(t0, p.date))
  const mx = mean(xs)!
  const my = mean(points.map((p) => p.kg))!
  let num = 0
  let den = 0
  points.forEach((p, i) => {
    num += (xs[i] - mx) * (p.kg - my)
    den += (xs[i] - mx) ** 2
  })
  return den === 0 ? null : (num / den) * 7
}

/** Khoảng tăng/giảm cân lý tưởng (kg/tuần) theo mục tiêu. */
export function targetRateRange(goal: Goal, weightKg: number): [number, number] {
  if (goal === 'bulk') return [0.2, 0.5]
  if (goal === 'cut') return [-0.01 * weightKg, -0.005 * weightKg]
  return [-0.2, 0.2]
}

export type AdviceKind = 'collecting' | 'ok' | 'raise' | 'lower'

export interface Advice {
  kind: AdviceKind
  /** thay đổi kcal/ngày đề xuất (dương = tăng); 0 nếu không đề xuất */
  delta: number
  /** kcal mục tiêu mới nếu áp dụng */
  newKcal: number | null
  slope: number | null
  rate: [number, number]
  avgKcal: number | null
  /** TDEE thực tế ước tính = kcal ăn TB − độ dốc × 1100 */
  tdee: number | null
  weighIns: number
  loggedDays: number
  /** lý do chưa đủ dữ liệu (kind = collecting) */
  missing: string[]
  /** ngày bắt đầu cửa sổ phân tích */
  from: string
}

export const ADVICE_WINDOW_DAYS = 21
export const ADVICE_MIN_WEIGHINS = 6
export const ADVICE_MIN_SPAN_DAYS = 10
export const ADVICE_MIN_LOGGED_DAYS = 8
export const ADVICE_MAX_DELTA = 250
export const ADVICE_MIN_DELTA = 100
const MIN_KCAL_TARGET = 1200

const round50 = (x: number) => Math.round(x / 50) * 50

/**
 * Gợi ý chỉnh kcal dựa trên xu hướng cân thật (3 tuần gần nhất, hoặc từ sau lần chỉnh gần nhất `adjustedAt`).
 * Chỉ gợi ý khi đủ dữ liệu; mức chỉnh ±100–250 kcal/ngày để không đuổi theo nhiễu (nước, muối) của cân.
 */
export function adviseCalories(opts: {
  weightLogs: Record<string, WeightLog>
  foodLogs: Record<string, FoodLog>
  goal: Goal
  weightKg: number
  targetKcal: number
  adjustedAt?: string
  today: string
}): Advice {
  const { weightLogs, foodLogs, goal, weightKg, targetKcal, adjustedAt, today } = opts
  let from = addDays(today, -(ADVICE_WINDOW_DAYS - 1))
  if (adjustedAt) {
    // Chỉ tính dữ liệu từ NGÀY SAU lần chỉnh: cân/kcal trước đó phản ánh mục tiêu cũ
    const after = addDays(adjustedAt.slice(0, 10), 1)
    if (after > from) from = after
  }
  const points = weighIns(weightLogs).filter((w) => w.date >= from && w.date <= today)
  const intake = dailyIntake(foodLogs)
  const days = completeDays(intake, from, today, today)
  const avgKcal = days.length ? Math.round(mean(days.map(([, v]) => v.kcal))!) : null
  const slope = weightSlopePerWeek(points)
  const rate = targetRateRange(goal, weightKg)
  const span = points.length ? daysBetween(points[0].date, points.at(-1)!.date) : 0

  const missing: string[] = []
  if (points.length < ADVICE_MIN_WEIGHINS) missing.push(`cân thêm (có ${points.length}/${ADVICE_MIN_WEIGHINS} lần)`)
  else if (span < ADVICE_MIN_SPAN_DAYS) missing.push(`theo dõi thêm ${ADVICE_MIN_SPAN_DAYS - span} ngày (lần cân đầu → cuối mới ${span} ngày)`)
  if (days.length < ADVICE_MIN_LOGGED_DAYS) missing.push(`log đủ bữa thêm (có ${days.length}/${ADVICE_MIN_LOGGED_DAYS} ngày)`)

  const base = { slope, rate, avgKcal, weighIns: points.length, loggedDays: days.length, from }
  if (missing.length || slope === null || avgKcal === null) {
    return { ...base, kind: 'collecting', delta: 0, newKcal: null, tdee: null, missing }
  }
  const tdee = Math.round(avgKcal - slope * KCAL_PER_KG_PER_DAY)
  const [lo, hi] = rate
  if (slope >= lo && slope <= hi) return { ...base, kind: 'ok', delta: 0, newKcal: null, tdee, missing }
  const center = (lo + hi) / 2
  const raw = (center - slope) * KCAL_PER_KG_PER_DAY
  const mag = Math.min(ADVICE_MAX_DELTA, Math.max(ADVICE_MIN_DELTA, Math.abs(round50(raw))))
  const delta = raw > 0 ? mag : -mag
  const newKcal = Math.max(MIN_KCAL_TARGET, targetKcal + delta)
  return { ...base, kind: delta > 0 ? 'raise' : 'lower', delta: newKcal - targetKcal, newKcal, tdee, missing }
}

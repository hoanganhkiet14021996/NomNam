import type { Goal, Nutrients, Profile, Targets } from '@/types'

export const ZERO: Nutrients = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }

export const GOAL_FACTOR: Record<Goal, number> = { cut: 0.82, maintain: 1, bulk: 1.1 }
export const GOAL_LABEL: Record<Goal, string> = { cut: 'Giảm mỡ', maintain: 'Giữ cân', bulk: 'Tăng cơ' }
export const DEFAULT_PROTEIN_PER_KG: Record<Goal, number> = { cut: 2.2, maintain: 2.0, bulk: 2.0 }

export const NEAT_LEVELS = [
  { value: 1.2, label: 'Ít đi lại', hint: 'Ngồi văn phòng, đi xe, < 5.000 bước' },
  { value: 1.375, label: 'Đi lại vừa', hint: '5.000–10.000 bước/ngày' },
  { value: 1.55, label: 'Đi lại nhiều', hint: 'Công việc đứng/di chuyển, > 10.000 bước' },
] as const

/** Hệ số an toàn: kcal tối thiểu để mục tiêu không xuống quá thấp. */
const MIN_KCAL = 1200

/** Mifflin-St Jeor */
export function calcBMR(p: Pick<Profile, 'sex' | 'age' | 'heightCm' | 'weightKg'>): number {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age
  return p.sex === 'male' ? base + 5 : base - 161
}

/** TDEE nền: BMR × NEAT, không gồm buổi tập (buổi tập log riêng ở tab Vận động). */
export function calcBaseTDEE(p: Profile): number {
  return calcBMR(p) * p.neat
}

/** Mục tiêu tự tính theo hồ sơ, chưa áp override. */
export function calcAutoTargets(p: Profile): Targets {
  const kcal = Math.max(MIN_KCAL, Math.round(calcBaseTDEE(p) * GOAL_FACTOR[p.goal]))
  return splitMacros(kcal, Math.round(p.weightKg * p.proteinPerKg))
}

/** Chia macro từ kcal + protein: fat 25% kcal, xơ 14g/1000kcal, carbs phần còn lại. */
export function splitMacros(kcal: number, protein: number): Targets {
  const fat = Math.round((kcal * 0.25) / 9)
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4))
  const fiber = Math.round((kcal / 1000) * 14)
  return { kcal, protein, carbs, fat, fiber }
}

/** Mục tiêu cuối cùng: override (nếu có) đè lên số tự tính. Nếu đổi kcal/protein, macro còn lại tính lại cho khớp. */
export function calcTargets(p: Profile): Targets {
  const auto = calcAutoTargets(p)
  const o = p.overrides ?? {}
  const kcal = o.kcal ?? auto.kcal
  const protein = o.protein ?? auto.protein
  const split = splitMacros(kcal, protein)
  const fat = o.fat ?? split.fat
  const carbs = o.carbs ?? Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4))
  return { kcal, protein, fat, carbs, fiber: o.fiber ?? split.fiber }
}

export function scaleNutrients(per100: Nutrients, grams: number): Nutrients {
  const r = grams / 100
  return {
    kcal: per100.kcal * r,
    protein: per100.protein * r,
    carbs: per100.carbs * r,
    fat: per100.fat * r,
    fiber: per100.fiber * r,
  }
}

/** Nhân toàn bộ dinh dưỡng theo tỉ lệ (dùng khi sửa gram của 1 log). */
export function multiplyNutrients(n: Nutrients, factor: number): Nutrients {
  return {
    kcal: n.kcal * factor,
    protein: n.protein * factor,
    carbs: n.carbs * factor,
    fat: n.fat * factor,
    fiber: n.fiber * factor,
  }
}

export function sumNutrients(items: readonly Nutrients[]): Nutrients {
  return items.reduce<Nutrients>(
    (acc, n) => ({
      kcal: acc.kcal + n.kcal,
      protein: acc.protein + n.protein,
      carbs: acc.carbs + n.carbs,
      fat: acc.fat + n.fat,
      fiber: acc.fiber + n.fiber,
    }),
    { ...ZERO },
  )
}

export function pickNutrients(n: Nutrients): Nutrients {
  return { kcal: n.kcal, protein: n.protein, carbs: n.carbs, fat: n.fat, fiber: n.fiber }
}

/** Quỹ calo ngày = mục tiêu + X% calo tập. */
export function dailyBudget(targetKcal: number, exerciseKcal: number, eatBackPct: number): number {
  return targetKcal + Math.round(exerciseKcal * (eatBackPct / 100))
}

/** Biên độ cho phép quanh quỹ calo để tính "đạt". */
export const KCAL_TOLERANCE = 0.1

export interface DayAdherence {
  logged: boolean
  kcalPct: number
  proteinPct: number
  kcalOk: boolean
  proteinOk: boolean
  /** Cả calo và protein đều đạt */
  hit: boolean
}

export function dayAdherence(eaten: Nutrients, budgetKcal: number, proteinTarget: number): DayAdherence {
  const logged = eaten.kcal > 0
  const kcalPct = budgetKcal > 0 ? eaten.kcal / budgetKcal : 0
  const proteinPct = proteinTarget > 0 ? eaten.protein / proteinTarget : 0
  const kcalOk = logged && Math.abs(kcalPct - 1) <= KCAL_TOLERANCE
  const proteinOk = logged && Math.round(eaten.protein) >= proteinTarget
  return { logged, kcalPct, proteinPct, kcalOk, proteinOk, hit: kcalOk && proteinOk }
}

/** Làm tròn hiển thị: kcal số nguyên, gram 1 chữ số nếu < 10. */
export function fmtKcal(n: number): string {
  return Math.round(n).toLocaleString('vi-VN')
}

export function fmtG(n: number): string {
  const v = Math.abs(n) < 10 ? Math.round(n * 10) / 10 : Math.round(n)
  return v.toLocaleString('vi-VN')
}

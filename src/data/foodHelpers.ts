import type { Food, FoodCategory, Serving } from '@/types'

/**
 * Hàm dựng món dùng chung cho mọi file bảng món (src/data/foods.vn.ts và src/data/foods/*.ts).
 * food(): nguyên liệu, số liệu trên 100g. dish(): món phức hợp, nhập theo 1 phần ăn rồi tự quy ra trên 100g.
 * s(): khẩu phần.
 */

export type N5 = [kcal: number, protein: number, carbs: number, fat: number, fiber: number]

export function food(
  id: string,
  name: string,
  emoji: string,
  category: FoodCategory,
  [kcal, protein, carbs, fat, fiber]: N5,
  servings: Serving[] = [],
  aliases: string[] = [],
): Food {
  return {
    id,
    name,
    emoji,
    category,
    per100: { kcal, protein, carbs, fat, fiber },
    servings: [...servings, { label: '100g', grams: 100 }].filter(
      (s, i, arr) => arr.findIndex((x) => x.grams === s.grams && x.label === s.label) === i,
    ),
    defaultGrams: servings[0]?.grams ?? 100,
    aliases,
  }
}

/** Món phức hợp: nhập theo 1 phần ăn, tự quy ra trên 100g. */
export function dish(
  id: string,
  name: string,
  emoji: string,
  serving: string,
  grams: number,
  [kcal, protein, carbs, fat, fiber]: N5,
  aliases: string[] = [],
  category: FoodCategory = 'dish',
): Food {
  const r = 100 / grams
  return {
    id,
    name,
    emoji,
    category,
    per100: { kcal: kcal * r, protein: protein * r, carbs: carbs * r, fat: fat * r, fiber: fiber * r },
    servings: [
      { label: serving, grams },
      { label: `½ ${serving.replace(/^1 /, '')}`, grams: Math.round(grams / 2) },
    ],
    defaultGrams: grams,
    aliases,
  }
}

export const s = (label: string, grams: number): Serving => ({ label, grams })

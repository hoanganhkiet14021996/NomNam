import type { Profile } from '@/types'
import { DEFAULT_PROTEIN_PER_KG } from '@/lib/nutrition'

export const DEFAULT_PROFILE: Profile = {
  sex: 'male',
  age: 25,
  heightCm: 170,
  weightKg: 65,
  neat: 1.375,
  goal: 'bulk',
  proteinPerKg: DEFAULT_PROTEIN_PER_KG.bulk,
  overrides: {},
  exerciseEatBackPct: 50,
  updatedAt: new Date(0).toISOString(),
}

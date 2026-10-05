import { useMemo } from 'react'
import { useAppStore } from './useAppStore'
import { activitiesForDate, allFoods, logsForDate, summarizeDay } from './derive'
import { calcTargets } from '@/lib/nutrition'

export function useTargets() {
  const profile = useAppStore((s) => s.profile)
  return useMemo(() => calcTargets(profile), [profile])
}

export function useDay(date: string) {
  const foodLogs = useAppStore((s) => s.foodLogs)
  const activityLogs = useAppStore((s) => s.activityLogs)
  const profile = useAppStore((s) => s.profile)
  const targets = useTargets()
  return useMemo(() => {
    const logs = logsForDate(foodLogs, date)
    const activities = activitiesForDate(activityLogs, date)
    return { logs, activities, ...summarizeDay(date, logs, activities, profile, targets) }
  }, [foodLogs, activityLogs, profile, targets, date])
}

export function useAllFoods() {
  const customFoods = useAppStore((s) => s.customFoods)
  return useMemo(() => allFoods(customFoods), [customFoods])
}

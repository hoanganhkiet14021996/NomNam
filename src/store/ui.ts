import { create } from 'zustand'
import type { MealType } from '@/types'
import { todayKey } from '@/lib/date'
import { mealForNow } from './derive'

export type Tab = 'today' | 'week' | 'activity' | 'goals'
export const TABS: Tab[] = ['today', 'week', 'activity', 'goals']
export type AddView = 'search' | 'quick' | 'ai'

interface UiState {
  tab: Tab
  /** Ngày đang xem ở tab Hôm nay / dùng khi thêm món, vận động */
  date: string
  addOpen: boolean
  addMeal: MealType
  addView: AddView
  editLogId: string | null
  setTab: (t: Tab) => void
  setDate: (d: string) => void
  openAdd: (opts?: { meal?: MealType; view?: AddView }) => void
  closeAdd: () => void
  setAddView: (v: AddView) => void
  setAddMeal: (m: MealType) => void
  editLog: (id: string | null) => void
}

const tabFromHash = (): Tab => {
  const h = location.hash.replace('#', '') as Tab
  return TABS.includes(h) ? h : 'today'
}

export const useUi = create<UiState>((set) => ({
  tab: tabFromHash(),
  date: todayKey(),
  addOpen: false,
  addMeal: mealForNow(),
  addView: 'search',
  editLogId: null,
  setTab: (tab) => {
    set({ tab })
    history.replaceState(null, '', tab === 'today' ? location.pathname : `#${tab}`)
  },
  setDate: (date) => set({ date }),
  openAdd: (opts) => set({ addOpen: true, addMeal: opts?.meal ?? mealForNow(), addView: opts?.view ?? 'search' }),
  closeAdd: () => set({ addOpen: false }),
  setAddView: (addView) => set({ addView }),
  setAddMeal: (addMeal) => set({ addMeal }),
  editLog: (editLogId) => set({ editLogId }),
}))

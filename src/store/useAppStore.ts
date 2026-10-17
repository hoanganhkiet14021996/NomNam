import { useSyncExternalStore } from 'react'
import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { del, get, set } from 'idb-keyval'
import type { ActivityLog, Food, FoodLog, FoodRequest, MealType, Profile, SavedMeal, SavedMealItem, WeightLog } from '@/types'
import { nowIso } from '@/lib/date'
import { scaleNutrients } from '@/lib/nutrition'
import { normalize } from '@/lib/search'
import { uuid } from '@/lib/id'
import { DEFAULT_PROFILE } from '@/data/defaults'
import { relinkableLogs } from './derive'

/** Tên bảng Supabase ↔ key trong store. */
export const TABLES = {
  food_logs: 'foodLogs',
  activity_logs: 'activityLogs',
  weight_logs: 'weightLogs',
  saved_meals: 'savedMeals',
  custom_foods: 'customFoods',
  food_requests: 'foodRequests',
} as const
export type TableName = keyof typeof TABLES | 'profiles'
type CollectionKey = (typeof TABLES)[keyof typeof TABLES]

export type NewFoodLog = Omit<FoodLog, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
/** Thông tin AI ước lượng về một món chưa có trong bảng. */
export type NewFoodRequest = Pick<FoodRequest, 'name' | 'emoji' | 'role' | 'kind' | 'cooking' | 'per100' | 'grams'>
export type NewActivityLog = Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>

export interface DataState {
  profile: Profile
  onboarded: boolean
  foodLogs: Record<string, FoodLog>
  activityLogs: Record<string, ActivityLog>
  weightLogs: Record<string, WeightLog>
  savedMeals: Record<string, SavedMeal>
  customFoods: Record<string, Food>
  foodRequests: Record<string, FoodRequest>
  /** Các bản ghi chưa đẩy lên Supabase: key = `${table}:${id}` */
  outbox: Record<string, true>
  lastPulledAt: string | null
  /** Supabase user sở hữu dữ liệu local (null = chưa đăng nhập lần nào) */
  ownerId: string | null
}

interface Actions {
  addFoodLogs: (items: NewFoodLog[]) => string[]
  updateFoodLog: (id: string, patch: Partial<NewFoodLog>) => void
  removeFoodLog: (id: string) => void
  restoreFoodLog: (id: string) => void
  copyDay: (from: string, to: string, meal?: MealType) => number

  addActivity: (a: NewActivityLog) => string
  removeActivity: (id: string) => void
  restoreActivity: (id: string) => void

  setWeight: (date: string, kg: number) => void
  removeWeight: (id: string) => void

  saveMeal: (name: string, items: SavedMealItem[]) => string
  removeSavedMeal: (id: string) => void
  restoreSavedMeal: (id: string) => void

  addCustomFood: (food: Omit<Food, 'id' | 'custom' | 'updatedAt' | 'deletedAt'>) => Food
  removeCustomFood: (id: string) => void
  restoreCustomFood: (id: string) => void

  /** Ghi món AI chưa khớp bảng vào danh sách chờ (gộp theo tên không dấu, tăng số lần gặp). */
  noteFoodRequests: (items: NewFoodRequest[]) => void
  setFoodRequestStatus: (id: string, status: FoodRequest['status'], foodId?: string | null) => void
  /**
   * Món đã có trong bảng → cập nhật các log cũ (AI ghi, chưa gắn món, cùng tên) theo số liệu của bảng.
   * Trả về bản trước khi sửa để Hoàn tác.
   */
  relinkLogs: (nameKey: string, food: Food) => FoodLog[]
  /** Ghi đè nguyên bản ghi log (dùng cho Hoàn tác relink). */
  restoreFoodLogs: (logs: FoodLog[]) => void

  updateProfile: (patch: Partial<Profile>) => void
  completeOnboarding: () => void

  /** Dùng bởi sync.ts */
  _merge: (table: TableName, rows: unknown[]) => void
  _clearOutbox: (keys: string[]) => void
  _enqueueAll: () => void
  _setSyncMeta: (meta: Partial<Pick<DataState, 'lastPulledAt' | 'ownerId'>>) => void
  _resetData: () => void
}

export type AppState = DataState & Actions

const EMPTY_DATA: DataState = {
  profile: DEFAULT_PROFILE,
  onboarded: false,
  foodLogs: {},
  activityLogs: {},
  weightLogs: {},
  savedMeals: {},
  customFoods: {},
  foodRequests: {},
  outbox: {},
  lastPulledAt: null,
  ownerId: null,
}

/** IndexedDB (dung lượng lớn, không chặn UI); rơi về localStorage nếu trình duyệt chặn IDB. */
const idbStorage: StateStorage = {
  getItem: async (name) => {
    try {
      return (await get<string>(name)) ?? localStorage.getItem(name)
    } catch {
      return localStorage.getItem(name)
    }
  },
  setItem: async (name, value) => {
    try {
      await set(name, value)
    } catch {
      localStorage.setItem(name, value)
    }
  },
  removeItem: async (name) => {
    try {
      await del(name)
    } catch {
      localStorage.removeItem(name)
    }
  },
}

const key = (table: TableName, id: string) => `${table}:${id}`

export const useAppStore = create<AppState>()(
  persist(
    (setState, getState) => {
      /** Ghi 1 bản ghi vào collection + đánh dấu cần sync. */
      function put<K extends CollectionKey>(
        col: K,
        table: keyof typeof TABLES,
        record: DataState[K][string],
      ) {
        setState((s) => ({
          [col]: { ...s[col], [record.id]: record },
          outbox: { ...s.outbox, [key(table, record.id)]: true },
        }) as Partial<AppState>)
      }

      function softDelete<K extends CollectionKey>(col: K, table: keyof typeof TABLES, id: string, deleted: boolean) {
        const cur = getState()[col][id]
        if (!cur) return
        put(col, table, { ...cur, deletedAt: deleted ? nowIso() : null, updatedAt: nowIso() } as DataState[K][string])
      }

      return {
        ...EMPTY_DATA,

        addFoodLogs: (items) => {
          const now = nowIso()
          const records = items.map<FoodLog>((it) => ({ ...it, id: uuid(), createdAt: now, updatedAt: now, deletedAt: null }))
          setState((s) => {
            const foodLogs = { ...s.foodLogs }
            const outbox = { ...s.outbox }
            for (const r of records) {
              foodLogs[r.id] = r
              outbox[key('food_logs', r.id)] = true
            }
            return { foodLogs, outbox }
          })
          return records.map((r) => r.id)
        },
        updateFoodLog: (id, patch) => {
          const cur = getState().foodLogs[id]
          if (cur) put('foodLogs', 'food_logs', { ...cur, ...patch, updatedAt: nowIso() })
        },
        removeFoodLog: (id) => softDelete('foodLogs', 'food_logs', id, true),
        restoreFoodLog: (id) => softDelete('foodLogs', 'food_logs', id, false),
        copyDay: (from, to, meal) => {
          const src = Object.values(getState().foodLogs).filter(
            (l) => !l.deletedAt && l.date === from && (!meal || l.meal === meal),
          )
          getState().addFoodLogs(
            src.map(({ id: _id, createdAt: _c, updatedAt: _u, deletedAt: _d, ...rest }) => ({ ...rest, date: to })),
          )
          return src.length
        },

        addActivity: (a) => {
          const now = nowIso()
          const rec: ActivityLog = { ...a, id: uuid(), createdAt: now, updatedAt: now, deletedAt: null }
          put('activityLogs', 'activity_logs', rec)
          return rec.id
        },
        removeActivity: (id) => softDelete('activityLogs', 'activity_logs', id, true),
        restoreActivity: (id) => softDelete('activityLogs', 'activity_logs', id, false),

        setWeight: (date, kg) => {
          const existing = Object.values(getState().weightLogs).find((w) => w.date === date && !w.deletedAt)
          put('weightLogs', 'weight_logs', {
            id: existing?.id ?? uuid(),
            date,
            kg,
            updatedAt: nowIso(),
            deletedAt: null,
          })
          // Cân mới nhất cũng là cân nặng dùng để tính mục tiêu
          const latest = Object.values(getState().weightLogs)
            .filter((w) => !w.deletedAt)
            .sort((a, b) => b.date.localeCompare(a.date))[0]
          if (latest && latest.date === date) getState().updateProfile({ weightKg: kg })
        },
        removeWeight: (id) => softDelete('weightLogs', 'weight_logs', id, true),

        saveMeal: (name, items) => {
          const rec: SavedMeal = { id: uuid(), name, items, updatedAt: nowIso(), deletedAt: null }
          put('savedMeals', 'saved_meals', rec)
          return rec.id
        },
        removeSavedMeal: (id) => softDelete('savedMeals', 'saved_meals', id, true),
        restoreSavedMeal: (id) => softDelete('savedMeals', 'saved_meals', id, false),

        addCustomFood: (f) => {
          const rec: Food = { ...f, id: uuid(), custom: true, updatedAt: nowIso(), deletedAt: null }
          put('customFoods', 'custom_foods', rec)
          return rec
        },
        removeCustomFood: (id) => softDelete('customFoods', 'custom_foods', id, true),
        restoreCustomFood: (id) => softDelete('customFoods', 'custom_foods', id, false),

        noteFoodRequests: (items) => {
          const now = nowIso()
          for (const it of items) {
            const nameKey = normalize(it.name)
            if (!nameKey) continue
            const existing = Object.values(getState().foodRequests).find((r) => !r.deletedAt && r.nameKey === nameKey)
            if (existing) {
              put('foodRequests', 'food_requests', {
                ...existing,
                ...it,
                name: existing.name,
                timesSeen: existing.timesSeen + 1,
                updatedAt: now,
              })
            } else {
              put('foodRequests', 'food_requests', {
                ...it,
                id: uuid(),
                nameKey,
                timesSeen: 1,
                status: 'pending',
                foodId: null,
                createdAt: now,
                updatedAt: now,
                deletedAt: null,
              })
            }
          }
        },
        setFoodRequestStatus: (id, status, foodId) => {
          const cur = getState().foodRequests[id]
          if (cur) put('foodRequests', 'food_requests', { ...cur, status, foodId: foodId === undefined ? cur.foodId : foodId, updatedAt: nowIso() })
        },
        relinkLogs: (nameKey, food) => {
          const before = relinkableLogs(getState().foodLogs, nameKey)
          for (const l of before) {
            getState().updateFoodLog(l.id, { ...scaleNutrients(food.per100, l.grams), foodId: food.id, name: food.name, emoji: food.emoji })
          }
          return before
        },
        restoreFoodLogs: (logs) => {
          for (const l of logs) put('foodLogs', 'food_logs', { ...l, updatedAt: nowIso() })
        },

        updateProfile: (patch) =>
          setState((s) => ({
            profile: { ...s.profile, ...patch, updatedAt: nowIso() },
            outbox: { ...s.outbox, [key('profiles', 'me')]: true },
          })),
        completeOnboarding: () => setState({ onboarded: true }),

        _merge: (table, rows) => {
          setState((s) => {
            if (table === 'profiles') {
              const remote = rows[0] as Profile | undefined
              if (!remote || remote.updatedAt <= s.profile.updatedAt) return {}
              const outbox = { ...s.outbox }
              delete outbox[key('profiles', 'me')]
              return { profile: { ...DEFAULT_PROFILE, ...remote }, onboarded: true, outbox }
            }
            const col = TABLES[table]
            const next = { ...(s[col] as Record<string, { id: string; updatedAt: string }>) }
            const outbox = { ...s.outbox }
            for (const r of rows as { id: string; updatedAt: string }[]) {
              const local = next[r.id]
              if (!local || r.updatedAt > local.updatedAt) {
                next[r.id] = r
                delete outbox[key(table, r.id)]
              }
            }
            return { [col]: next, outbox } as Partial<AppState>
          })
        },
        _clearOutbox: (keys) =>
          setState((s) => {
            const outbox = { ...s.outbox }
            for (const k of keys) delete outbox[k]
            return { outbox }
          }),
        _enqueueAll: () =>
          setState((s) => {
            const outbox: Record<string, true> = { [key('profiles', 'me')]: true }
            for (const [table, col] of Object.entries(TABLES)) {
              for (const id of Object.keys(s[col])) outbox[`${table}:${id}`] = true
            }
            return { outbox }
          }),
        _setSyncMeta: (meta) => setState(meta),
        _resetData: () => setState({ ...EMPTY_DATA }),
      }
    },
    {
      // Khoá IndexedDB giữ tên cũ (trước khi đổi thành NomNam) để không mất dữ liệu đã lưu trên máy
      name: 'calitrack-data',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => {
        const data: Partial<DataState> = {}
        for (const k of Object.keys(EMPTY_DATA) as (keyof DataState)[]) {
          ;(data as Record<string, unknown>)[k] = s[k]
        }
        return data as DataState
      },
    },
  ),
)

/** true khi đã đọc xong dữ liệu từ IndexedDB. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (cb) => useAppStore.persist.onFinishHydration(cb),
    () => useAppStore.persist.hasHydrated(),
  )
}

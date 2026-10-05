import { TABLES, useAppStore } from '@/store/useAppStore'
import { MEAL_LABEL } from '@/store/derive'

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const stamp = () => new Date().toISOString().slice(0, 10)

export function exportJSON() {
  const s = useAppStore.getState()
  const data = {
    app: 'nomnam',
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: s.profile,
    foodLogs: Object.values(s.foodLogs),
    activityLogs: Object.values(s.activityLogs),
    weightLogs: Object.values(s.weightLogs),
    savedMeals: Object.values(s.savedMeals),
    customFoods: Object.values(s.customFoods),
  }
  download(`nomnam-backup-${stamp()}.json`, JSON.stringify(data, null, 2), 'application/json')
}

export function exportFoodCSV() {
  const logs = Object.values(useAppStore.getState().foodLogs)
    .filter((l) => !l.deletedAt)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const rows = [
    ['Ngày', 'Bữa', 'Món', 'Gram', 'Kcal', 'Protein', 'Carbs', 'Fat', 'Xơ', 'Nguồn'],
    ...logs.map((l) => [l.date, MEAL_LABEL[l.meal], l.name, l.grams, Math.round(l.kcal), l.protein.toFixed(1), l.carbs.toFixed(1), l.fat.toFixed(1), l.fiber.toFixed(1), l.source]),
  ]
  // BOM để Excel đọc đúng tiếng Việt
  download(`nomnam-nhat-ky-${stamp()}.csv`, '﻿' + rows.map((r) => r.map(esc).join(',')).join('\n'), 'text/csv;charset=utf-8')
}

/** Nhập file backup: gộp vào dữ liệu hiện có (bản mới hơn thắng), rồi đánh dấu cần đồng bộ. */
export async function importJSON(file: File): Promise<number> {
  const data = JSON.parse(await file.text())
  // 'calitrack' = file sao lưu từ trước khi đổi tên app
  if (data?.app !== 'nomnam' && data?.app !== 'calitrack') throw new Error('File không phải bản sao lưu của NomNam')
  const store = useAppStore.getState()
  let count = 0
  for (const [table, col] of Object.entries(TABLES) as [keyof typeof TABLES, string][]) {
    const rows = Array.isArray(data[col]) ? data[col] : []
    count += rows.length
    store._merge(table, rows)
  }
  if (data.profile) store._merge('profiles', [data.profile])
  useAppStore.getState().completeOnboarding()
  useAppStore.getState()._enqueueAll()
  return count
}

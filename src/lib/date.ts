/** Mọi ngày trong app dùng key 'YYYY-MM-DD' theo GIỜ ĐỊA PHƯƠNG (không dùng toISOString → lệch ngày UTC). */

export function toKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey(): string {
  return toKey(new Date())
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

/** 7 ngày của tuần chứa `key`, bắt đầu từ Thứ Hai. */
export function weekKeys(key: string): string[] {
  const d = fromKey(key)
  const dow = (d.getDay() + 6) % 7 // T2 = 0
  const monday = addDays(key, -dow)
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i))
}

/** Các ngày từ `from` đến `to` (bao gồm cả 2 đầu). */
export function rangeKeys(from: string, to: string): string[] {
  const out: string[] = []
  for (let k = from; k <= to; k = addDays(k, 1)) out.push(k)
  return out
}

const DOW_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export function dowShort(key: string): string {
  return DOW_SHORT[fromKey(key).getDay()]
}

export function dayMonth(key: string): string {
  const d = fromKey(key)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

/** "Hôm nay", "Hôm qua", "Ngày mai" hoặc "T4, 2/10". */
export function friendlyDay(key: string, today = todayKey()): string {
  if (key === today) return 'Hôm nay'
  if (key === addDays(today, -1)) return 'Hôm qua'
  if (key === addDays(today, 1)) return 'Ngày mai'
  return `${dowShort(key)}, ${dayMonth(key)}`
}

export function nowIso(): string {
  return new Date().toISOString()
}

export function timeHHMM(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

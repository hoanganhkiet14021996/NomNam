import type { Food } from '@/types'

/** Bỏ dấu tiếng Việt + lowercase: "Ức Gà" → "uc ga". */
export function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function haystack(f: Food): string {
  return normalize([f.name, ...(f.aliases ?? [])].join(' '))
}

/**
 * Tìm món: mọi từ trong query phải xuất hiện. Điểm cao hơn nếu tên bắt đầu bằng query,
 * hoặc từ khớp ở đầu một từ. Món của người dùng được ưu tiên nhẹ.
 */
export function searchFoods(query: string, foods: readonly Food[], limit = 40): Food[] {
  const q = normalize(query)
  if (!q) return []
  const tokens = q.split(' ')
  const scored: { f: Food; score: number }[] = []
  for (const f of foods) {
    const name = normalize(f.name)
    const hay = haystack(f)
    if (!tokens.every((t) => hay.includes(t))) continue
    let score = 0
    if (name === q) score += 100
    if (name.startsWith(q)) score += 50
    for (const t of tokens) {
      if (new RegExp(`(^|\\s)${escapeRe(t)}`).test(name)) score += 10
      else if (name.includes(t)) score += 4
      else score += 1 // chỉ khớp alias
    }
    if (f.custom) score += 3
    score -= name.length * 0.05 // tên ngắn hơn lên trước
    scored.push({ f, score })
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.f)
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

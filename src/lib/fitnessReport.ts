import { addDays, dayMonth, dowShort, todayKey, weekKeys } from '@/lib/date'
import { calcAutoTargets, calcBMR, calcBaseTDEE, calcTargets, GOAL_FACTOR, hasTargetOverrides } from '@/lib/nutrition'
import { daysBetween, KCAL_PER_KG_PER_DAY, MIN_COMPLETE_DAY_KCAL, weighIns, weightSlopePerWeek } from '@/lib/weight'
import { activitiesForDate, logsForDate, summarizeDay } from '@/store/derive'
import type { ActivityLog, FoodLog, MealType, Profile, WeightLog } from '@/types'

/**
 * Báo cáo fitness dạng markdown gọn (cân, calo, protein, vận động, TDEE thực tế) để dán cho PT/AI đánh giá.
 * Tính ngay trên máy từ dữ liệu trong app — không cần đăng nhập hay PIN, dùng được trên iPad/điện thoại.
 */

const GOAL_TEXT = { cut: 'giảm mỡ', maintain: 'giữ cân', bulk: 'tăng cơ (lean bulk)' } as const
const MEAL: Record<MealType, string> = { breakfast: 'sáng', lunch: 'trưa', dinner: 'tối', snack: 'ăn vặt' }
const SRC: Record<string, string> = { db: 'bảng món', custom: 'món riêng', quick: 'nhập nhanh', ai: 'AI ước lượng', meal: 'bữa mẫu' }

const mean = (a: number[]) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null)
const r0 = (x: number | null | undefined) => (x === null || x === undefined ? '–' : Math.round(x).toLocaleString('vi-VN'))
const r1 = (x: number | null | undefined) => (x === null || x === undefined ? '–' : (Math.round(x * 10) / 10).toLocaleString('vi-VN'))
const sgn = (x: number | null, d = 1) =>
  x === null ? '–' : `${x > 0 ? '+' : x < 0 ? '−' : ''}${Math.abs(x).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d })}`

export interface ReportInput {
  foodLogs: Record<string, FoodLog>
  activityLogs: Record<string, ActivityLog>
  weightLogs: Record<string, WeightLog>
  profile: Profile
  /** số ngày gần nhất (14–90), mặc định 28 */
  days?: number
  today?: string
}

export function buildFitnessReport(input: ReportInput): string {
  const { foodLogs, activityLogs, weightLogs, profile } = input
  const DAYS = Math.min(90, Math.max(14, input.days ?? 28))
  const today = input.today ?? todayKey()
  const since = addDays(today, -(DAYS - 1))
  const T = calcTargets(profile)
  const bmr = calcBMR(profile)
  const tdeeBase = calcBaseTDEE(profile)
  const eatBack = (profile.exerciseEatBackPct ?? 50) / 100
  const w84 = weighIns(weightLogs).filter((w) => w.date >= addDays(today, -83) && w.date <= today)
  const wRecent = w84.filter((w) => w.date >= since)
  const lastKg = w84.at(-1)?.kg ?? profile.weightKg

  const days = Array.from({ length: DAYS }, (_, i) => addDays(since, i)).map((d) => {
    const f = logsForDate(foodLogs, d)
    const a = activitiesForDate(activityLogs, d)
    const s = summarizeDay(d, f, a, profile, calcTargets(profile))
    const logged = s.eaten.kcal >= MIN_COMPLETE_DAY_KCAL && d < today
    const kcalOk = logged && s.adherence.kcalOk
    const proteinOk = logged && s.adherence.proteinOk
    return { date: d, f, a, eaten: s.eaten, budget: s.budget, logged, partial: s.eaten.kcal > 0 && !logged, kcalOk, proteinOk, hit: kcalOk && proteinOk, isToday: d === today }
  })
  const done = days.filter((d) => d.logged)
  const avg = (rows: typeof days, fn: (d: (typeof days)[number]) => number) => mean(rows.map(fn))

  const out: string[] = []
  const L = (s = '') => out.push(s)

  L(`# Báo cáo fitness NomNam — ${DAYS} ngày (${dayMonth(since)} → ${dayMonth(today)}), tạo ${today}`)
  L()
  L('Nguồn: dữ liệu trong app NomNam. Ngày "đủ log" = ≥ 600 kcal và không phải hôm nay; ngày log dở/hôm nay KHÔNG tính vào trung bình.')
  L()
  L('## Hồ sơ & mục tiêu')
  L(`- ${profile.sex === 'male' ? 'Nam' : 'Nữ'}, ${profile.age} tuổi, cao ${profile.heightCm} cm, cân gần nhất ${r1(lastKg)} kg (BMI ${r1(lastKg / (profile.heightCm / 100) ** 2)}). Mục tiêu: **${GOAL_TEXT[profile.goal]}**.`)
  L(`- BMR ${r0(bmr)} · TDEE nền (BMR × NEAT ${profile.neat}, chưa gồm tập) ${r0(tdeeBase)} kcal. Hệ số mục tiêu ${GOAL_FACTOR[profile.goal]} → tự tính ${r0(calcAutoTargets(profile).kcal)} kcal.`)
  L(`- **Mục tiêu đang dùng**: ${r0(T.kcal)} kcal · protein ${T.protein}g (${r1(T.protein / lastKg)} g/kg) · carbs ${T.carbs}g · fat ${T.fat}g · xơ ${T.fiber}g.`)
  const ov = Object.keys(profile.overrides ?? {}).filter((k) => k !== 'adjustedAt')
  L(`- Override tự đặt: ${hasTargetOverrides(profile) ? ov.join(', ') : 'không'}${profile.overrides?.adjustedAt ? `; lần chỉnh kcal gần nhất ${profile.overrides.adjustedAt.slice(0, 10)}` : ''}. Calo tập được cộng lại vào quỹ ngày: ${Math.round(eatBack * 100)}%.`)
  L()

  L('## Cân nặng')
  if (!w84.length) L('- Chưa có lần cân nào trong 12 tuần gần nhất.')
  else {
    L(`- ${wRecent.length} lần cân trong ${DAYS} ngày: ${wRecent.map((w) => `${dayMonth(w.date)} ${r1(w.kg)}`).join(' · ') || '–'}`)
    const s14 = weightSlopePerWeek(w84.filter((w) => w.date >= addDays(today, -13)))
    const sAll = weightSlopePerWeek(wRecent)
    L(`- Xu hướng (hồi quy): 14 ngày gần nhất ${sgn(s14)} kg/tuần · ${DAYS} ngày ${sgn(sAll)} kg/tuần. Cân dao động 1–2 kg theo nước/muối, chỉ tin xu hướng ≥ 10 ngày có ≥ 6 lần cân.`)
    const weeks: string[] = []
    for (let m = weekKeys(w84[0].date)[0]; m <= today; m = addDays(m, 7)) {
      const ws = w84.filter((w) => w.date >= m && w.date <= addDays(m, 6))
      if (ws.length) weeks.push(`${dayMonth(m)}: ${r1(mean(ws.map((w) => w.kg)))} (${ws.length} lần)`)
    }
    L(`- Cân TB theo tuần (12 tuần): ${weeks.join(' · ')}`)
  }
  L()

  L(`## Tổng quan ${DAYS} ngày`)
  const partial = days.filter((d) => d.partial && !d.isToday)
  L(`- Ngày đủ log: **${done.length}/${DAYS - 1}** (không tính hôm nay)${partial.length ? `; log dở (< 600 kcal): ${partial.map((d) => dayMonth(d.date)).join(', ')}` : ''}.`)
  if (done.length) {
    const k = avg(done, (d) => d.eaten.kcal)!
    const P = avg(done, (d) => d.eaten.protein)!
    const C = avg(done, (d) => d.eaten.carbs)!
    const F = avg(done, (d) => d.eaten.fat)!
    const X = avg(done, (d) => d.eaten.fiber)!
    const B = avg(done, (d) => d.budget)!
    L(`- TB/ngày: **${r0(k)} kcal** (quỹ TB ${r0(B)}, ${sgn(((k - B) / B) * 100, 0)}%) · protein ${r0(P)}g (${r1(P / lastKg)} g/kg, mục tiêu ${T.protein}g) · carbs ${r0(C)}g · fat ${r0(F)}g · xơ ${r0(X)}g (mục tiêu ${T.fiber}g).`)
    L(`- Phân bổ năng lượng: protein ${r0(((P * 4) / k) * 100)}% · carbs ${r0(((C * 4) / k) * 100)}% · fat ${r0(((F * 9) / k) * 100)}%.`)
    L(`- Đạt: kcal trong ±10% quỹ **${done.filter((d) => d.kcalOk).length}/${done.length}** ngày · protein ≥ mục tiêu **${done.filter((d) => d.proteinOk).length}/${done.length}** ngày · đạt cả hai **${done.filter((d) => d.hit).length}/${done.length}**.`)
    const kc = done.map((d) => d.eaten.kcal)
    L(`- Biến thiên kcal giữa các ngày: thấp nhất ${r0(Math.min(...kc))}, cao nhất ${r0(Math.max(...kc))}.`)
    const byDow: Record<string, number[]> = {}
    for (const d of done) (byDow[dowShort(d.date)] ||= []).push(d.eaten.kcal)
    L(`- kcal TB theo thứ: ${['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].filter((x) => byDow[x]).map((x) => `${x} ${r0(mean(byDow[x]))}`).join(' · ')}`)
    const mealTxt = (Object.keys(MEAL) as MealType[]).map((m) => {
      const kcal = avg(done, (d) => d.f.filter((x) => x.meal === m).reduce((s, x) => s + x.kcal, 0))
      const pr = avg(done, (d) => d.f.filter((x) => x.meal === m).reduce((s, x) => s + x.protein, 0))
      return `${MEAL[m]} ${r0(kcal)} kcal / ${r0(pr)}g P`
    })
    L(`- TB mỗi bữa: ${mealTxt.join(' · ')}`)
    const byName = new Map<string, { n: number; kcal: number; p: number }>()
    for (const d of done)
      for (const x of d.f) {
        const c = byName.get(x.name) ?? { n: 0, kcal: 0, p: 0 }
        c.n++
        c.kcal += x.kcal
        c.p += x.protein
        byName.set(x.name, c)
      }
    const top = (key: 'p' | 'kcal', fmt: (c: { n: number; kcal: number; p: number }) => string) =>
      [...byName.entries()].sort((a, b) => b[1][key] - a[1][key]).slice(0, 6).map(([n, c]) => `${n} (${fmt(c)}/${c.n} lần)`).join(' · ')
    L(`- Nguồn protein chính: ${top('p', (c) => `${r0(c.p)}g`)}`)
    L(`- Món góp nhiều kcal nhất: ${top('kcal', (c) => r0(c.kcal))}`)
  }
  L()

  L('## Theo tuần (T2–CN)')
  L('| Tuần | Ngày log | kcal TB | Quỹ TB | Protein TB | Đạt kcal | Đạt protein | Cân TB | Δ cân | Buổi tập | Phút tập | Kcal tập |')
  L('|---|---|---|---|---|---|---|---|---|---|---|---|')
  let prevW: number | null = null
  for (let m = weekKeys(since)[0]; m <= today; m = addDays(m, 7)) {
    const wk = days.filter((d) => d.date >= m && d.date <= addDays(m, 6))
    if (!wk.length) continue
    const dn = wk.filter((d) => d.logged)
    const ws = w84.filter((w) => w.date >= m && w.date <= addDays(m, 6))
    const wAvg = ws.length ? mean(ws.map((w) => w.kg)) : null
    const sess = wk.flatMap((d) => d.a)
    L(
      `| ${dayMonth(m)}–${dayMonth(addDays(m, 6))} | ${dn.length}/${wk.filter((d) => d.date < today).length} | ${dn.length ? r0(avg(dn, (d) => d.eaten.kcal)) : '–'} | ${dn.length ? r0(avg(dn, (d) => d.budget)) : '–'} | ${dn.length ? `${r0(avg(dn, (d) => d.eaten.protein))}g` : '–'} | ${dn.filter((d) => d.kcalOk).length}/${dn.length} | ${dn.filter((d) => d.proteinOk).length}/${dn.length} | ${wAvg !== null ? r1(wAvg) : '–'} | ${wAvg !== null && prevW !== null ? sgn(wAvg - prevW) : '–'} | ${sess.length} | ${r0(sess.reduce((s, x) => s + x.minutes, 0))} | ${r0(sess.reduce((s, x) => s + x.kcal, 0))} |`,
    )
    if (wAvg !== null) prevW = wAvg
  }
  L()

  L('## Từng ngày')
  L('| Ngày | kcal | Quỹ | % quỹ | P | C | F | Xơ | Vận động |')
  L('|---|---|---|---|---|---|---|---|---|')
  for (const d of days) {
    const note = d.isToday ? ' (hôm nay, chưa tính)' : d.partial ? ' (log dở)' : ''
    const act = d.a.map((x) => `${x.name} ${x.minutes}'`).join(', ') || '–'
    L(
      d.eaten.kcal
        ? `| ${dowShort(d.date)} ${dayMonth(d.date)}${note} | ${r0(d.eaten.kcal)} | ${r0(d.budget)} | ${r0((d.eaten.kcal / d.budget) * 100)}% | ${r0(d.eaten.protein)} | ${r0(d.eaten.carbs)} | ${r0(d.eaten.fat)} | ${r0(d.eaten.fiber)} | ${act} |`
        : `| ${dowShort(d.date)} ${dayMonth(d.date)}${d.isToday ? ' (hôm nay)' : ''} | chưa log | | | | | | | ${act} |`,
    )
  }
  L()

  L('## Vận động')
  const allActs = days.flatMap((d) => d.a)
  if (!allActs.length) L('- Không có buổi tập nào được log.')
  else {
    const byAct = new Map<string, { n: number; min: number }>()
    for (const x of allActs) {
      const c = byAct.get(x.name) ?? { n: 0, min: 0 }
      c.n++
      c.min += x.minutes
      byAct.set(x.name, c)
    }
    L(`- ${allActs.length} buổi / ${DAYS} ngày (≈ ${r1((allActs.length / DAYS) * 7)} buổi/tuần), tổng ${r0(allActs.reduce((s, x) => s + x.minutes, 0))} phút, ${r0(allActs.reduce((s, x) => s + x.kcal, 0))} kcal (công thức (MET−1)×kg×giờ).`)
    L(`- Theo môn: ${[...byAct.entries()].map(([n, c]) => `${n} ${c.n} buổi/${r0(c.min)}'`).join(' · ')}`)
    L('- Lưu ý: app KHÔNG ghi bài tập gym chi tiết (bài/set/tạ) hay cardio theo nhịp tim — chỉ môn, thời gian, cường độ.')
  }
  L()

  L('## Ước tính TDEE thực tế')
  {
    const s = weightSlopePerWeek(wRecent)
    const span = wRecent.length ? daysBetween(wRecent[0].date, wRecent.at(-1)!.date) : 0
    if (s !== null && wRecent.length >= 6 && span >= 10 && done.length >= 8) {
      const k = avg(done, (d) => d.eaten.kcal)!
      L(`- Công thức: kcal ăn TB (${r0(k)}) − độ dốc cân (${sgn(s)} kg/tuần × 1100) ≈ **${r0(k - s * KCAL_PER_KG_PER_DAY)} kcal/ngày** (đã gồm tập luyện trung bình). So với TDEE nền công thức ${r0(tdeeBase)} + calo tập TB/ngày ≈ ${r0(allActs.reduce((x, a) => x + a.kcal, 0) / DAYS)}.`)
      L('- Độ tin cậy: trung bình — phụ thuộc log đủ chính xác (AI ước lượng ảnh thường lệch 10–20% mỗi món) và cân đều.')
    } else L(`- Chưa đủ dữ liệu (cần ≥ 6 lần cân trải ≥ 10 ngày và ≥ 8 ngày log đủ; hiện ${wRecent.length} lần cân, ${done.length} ngày log đủ).`)
  }
  L()

  L('## Chất lượng dữ liệu log')
  {
    const items = done.flatMap((d) => d.f)
    const bySrc: Record<string, number> = {}
    for (const x of items) bySrc[x.source] = (bySrc[x.source] || 0) + x.kcal
    const tot = Object.values(bySrc).reduce((s, x) => s + x, 0) || 1
    L(`- Nguồn kcal đã log: ${Object.entries(bySrc).map(([s, k]) => `${SRC[s] ?? s} ${r0((k / tot) * 100)}%`).join(' · ') || '–'}. Phần "AI ước lượng" và "nhập nhanh" kém chính xác hơn.`)
    L(`- Ngày không log: ${days.filter((d) => !d.eaten.kcal && !d.isToday).map((d) => dayMonth(d.date)).join(', ') || 'không có'}.`)
  }
  return out.join('\n') + '\n'
}

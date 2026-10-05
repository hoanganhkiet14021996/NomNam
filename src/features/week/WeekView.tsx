import { useMemo } from 'react'
import { Check, ChevronLeft, ChevronRight, Flame, Minus, X } from 'lucide-react'
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { addDays, dayMonth, dowShort, todayKey, weekKeys } from '@/lib/date'
import { fmtG, fmtKcal } from '@/lib/nutrition'
import { useCssColors } from '@/lib/useCssColor'
import { cn } from '@/lib/utils'
import { activitiesForDate, logsForDate, summarizeDay, type DaySummary } from '@/store/derive'
import { useTargets } from '@/store/hooks'
import { useAppStore } from '@/store/useAppStore'
import { useUi } from '@/store/ui'
import { WeightCard } from './WeightCard'

export function WeekView() {
  const date = useUi((s) => s.date)
  const setDate = useUi((s) => s.setDate)
  const foodLogs = useAppStore((s) => s.foodLogs)
  const activityLogs = useAppStore((s) => s.activityLogs)
  const profile = useAppStore((s) => s.profile)
  const targets = useTargets()
  const today = todayKey()
  const keys = weekKeys(date)

  const summarize = useMemo(
    () => (d: string) => summarizeDay(d, logsForDate(foodLogs, d), activitiesForDate(activityLogs, d), profile, targets),
    [foodLogs, activityLogs, profile, targets],
  )
  const weekStart = keys[0]
  const days = useMemo(() => weekKeys(weekStart).map(summarize), [weekStart, summarize])
  const logged = days.filter((d) => d.adherence.logged && d.date <= today)
  const hits = logged.filter((d) => d.adherence.hit).length
  const proteinHits = logged.filter((d) => d.adherence.proteinOk).length
  const kcalHits = logged.filter((d) => d.adherence.kcalOk).length
  const avg = (f: (d: DaySummary) => number) => (logged.length ? logged.reduce((s, d) => s + f(d), 0) / logged.length : 0)
  const avgKcal = avg((d) => d.eaten.kcal)
  const avgProtein = avg((d) => d.eaten.protein)
  const avgBudget = avg((d) => d.budget)

  // Chuỗi ngày đạt liên tiếp tính tới hôm nay (hôm nay chưa đạt thì tính từ hôm qua)
  const streak = useMemo(() => {
    let n = 0
    let d = summarize(today).adherence.hit ? today : addDays(today, -1)
    for (let i = 0; i < 365; i++, d = addDays(d, -1)) {
      if (!summarize(d).adherence.hit) break
      n++
    }
    return n
  }, [summarize, today])

  const isCurrentWeek = keys.includes(today)

  return (
    <div className="space-y-4">
      <PageHeader
        title="Tuần"
        subtitle="Tiến độ"
        right={
          <div className="flex items-center gap-1 rounded-xl bg-muted p-0.5">
            <Button variant="ghost" size="icon-sm" aria-label="Tuần trước" onClick={() => setDate(addDays(keys[0], -7))}>
              <ChevronLeft />
            </Button>
            <span className="num min-w-[86px] text-center text-xs font-semibold">
              {isCurrentWeek ? 'Tuần này' : `${dayMonth(keys[0])} – ${dayMonth(keys[6])}`}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Tuần sau"
              disabled={isCurrentWeek}
              onClick={() => {
                const next = addDays(keys[0], 7)
                setDate(next > today ? today : next)
              }}
            >
              <ChevronRight />
            </Button>
          </div>
        }
      />

      <div className="space-y-4 px-4">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Ngày đạt cả 2" value={`${hits}/${logged.length || 0}`} sub={`Calo ${kcalHits} · Protein ${proteinHits}`} />
          <Stat
            label="Chuỗi đạt"
            value={
              <span className="flex items-center gap-1">
                {streak} <Flame className={cn('h-5 w-5', streak > 0 ? 'text-warning' : 'text-muted-foreground')} />
              </span>
            }
            sub={streak ? 'ngày liên tiếp' : 'Bắt đầu từ hôm nay!'}
          />
          <Stat label="TB calo / ngày" value={fmtKcal(avgKcal)} sub={logged.length ? `quỹ TB ${fmtKcal(avgBudget)}` : 'chưa có dữ liệu'} />
          <Stat
            label="TB protein / ngày"
            value={`${fmtG(avgProtein)}g`}
            sub={`mục tiêu ${targets.protein}g`}
            tone={logged.length ? (avgProtein >= targets.protein ? 'good' : 'bad') : undefined}
          />
        </div>

        <Insight days={logged} proteinTarget={targets.protein} avgKcal={avgKcal} avgBudget={avgBudget} avgProtein={avgProtein} />

        <AdherenceTable days={days} today={today} />

        <ChartCard
          title="Calo mỗi ngày"
          desc="Quỹ ngày = mục tiêu + phần calo tập được cộng lại"
          legend={[
            { label: 'Đã ăn', className: 'bg-kcal' },
            { label: 'Quỹ ngày', className: 'border-t-2 border-dashed border-foreground', line: true },
          ]}
        >
          <KcalChart days={days} />
        </ChartCard>

        <ChartCard title="Protein mỗi ngày" desc={`Đường đứt: mục tiêu ${targets.protein}g`}>
          <ProteinChart days={days} target={targets.protein} />
        </ChartCard>

        <WeightCard />
      </div>
    </div>
  )
}

function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: string; tone?: 'good' | 'bad' }) {
  return (
    <Card className="p-3.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className={cn('num mt-0.5 text-2xl font-extrabold tracking-tight', tone === 'bad' && 'text-warning', tone === 'good' && 'text-success')}>
        {value}
      </div>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </Card>
  )
}

function Insight({
  days,
  proteinTarget,
  avgKcal,
  avgBudget,
  avgProtein,
}: {
  days: DaySummary[]
  proteinTarget: number
  avgKcal: number
  avgBudget: number
  avgProtein: number
}) {
  if (days.length < 2) return null
  const tips: string[] = []
  const pGap = proteinTarget - avgProtein
  if (pGap > 5) tips.push(`Thiếu trung bình ${fmtG(pGap)}g protein/ngày — thêm ~${Math.max(1, Math.round(pGap / 24))} muỗng whey hoặc ${Math.round((pGap / 31) * 100)}g ức gà.`)
  const kGap = avgKcal - avgBudget
  if (kGap < -avgBudget * 0.1) tips.push(`Đang ăn thiếu ~${fmtKcal(-kGap)} kcal/ngày so với quỹ — khó tăng cơ nếu kéo dài.`)
  if (kGap > avgBudget * 0.1) tips.push(`Đang ăn dư ~${fmtKcal(kGap)} kcal/ngày so với quỹ.`)
  if (!tips.length) tips.push('Tuần này bám mục tiêu tốt. Giữ nhịp! 💪')
  return (
    <Card className="border-primary/20 bg-primary/5 p-3.5 shadow-none">
      <ul className="space-y-1 text-sm">
        {tips.map((t) => (
          <li key={t}>💡 {t}</li>
        ))}
      </ul>
    </Card>
  )
}

function AdherenceTable({ days, today }: { days: DaySummary[]; today: string }) {
  return (
    <Card className="overflow-hidden p-0">
      <table className="num w-full table-fixed text-center text-xs">
        <caption className="sr-only">Đạt mục tiêu từng ngày</caption>
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="w-[70px] py-2 text-left pl-3 font-semibold" />
            {days.map((d) => (
              <th key={d.date} className={cn('py-2 font-semibold', d.date === today && 'text-primary')}>
                {dowShort(d.date)}
                <span className="block text-[10px] font-normal">{d.date.slice(8)}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <th scope="row" className="pl-3 text-left font-semibold">
              Calo
            </th>
            {days.map((d) => (
              <td key={d.date} className="py-2" title={d.adherence.logged ? `${fmtKcal(d.eaten.kcal)} / ${fmtKcal(d.budget)} kcal` : ''}>
                <Mark ok={d.adherence.kcalOk} logged={d.adherence.logged && d.date <= today} />
                {d.adherence.logged && <span className="block text-[10px] text-muted-foreground">{Math.round(d.adherence.kcalPct * 100)}%</span>}
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row" className="pl-3 text-left font-semibold">
              Protein
            </th>
            {days.map((d) => (
              <td key={d.date} className="py-2" title={d.adherence.logged ? `${fmtG(d.eaten.protein)} / ${d.targets.protein}g` : ''}>
                <Mark ok={d.adherence.proteinOk} logged={d.adherence.logged && d.date <= today} />
                {d.adherence.logged && <span className="block text-[10px] text-muted-foreground">{Math.round(d.eaten.protein)}g</span>}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Card>
  )
}

function Mark({ ok, logged }: { ok: boolean; logged: boolean }) {
  if (!logged) return <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" aria-label="Chưa có dữ liệu" />
  return ok ? (
    <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-success/15 text-success" aria-label="Đạt">
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  ) : (
    <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-destructive" aria-label="Chưa đạt">
      <X className="h-3.5 w-3.5" strokeWidth={3} />
    </span>
  )
}

function ChartCard({
  title,
  desc,
  legend,
  children,
}: {
  title: string
  desc: string
  legend?: { label: string; className: string; line?: boolean }[]
  children: React.ReactNode
}) {
  return (
    <Card className="p-4">
      <h3 className="font-bold">{title}</h3>
      <p className="text-xs text-muted-foreground">{desc}</p>
      {legend && (
        <ul className="mt-2 flex gap-4 text-xs text-muted-foreground">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-1.5">
              <span className={cn(l.line ? 'h-0 w-4' : 'h-2.5 w-2.5 rounded-sm', l.className)} aria-hidden />
              {l.label}
            </li>
          ))}
        </ul>
      )}
      <div className="mb-1 mt-3" />
      <div className="h-48">{children}</div>
    </Card>
  )
}

/** Làm tròn đỉnh trục lên bội số step (chừa ~8% khoảng trống). */
function niceMax(max: number, step: number) {
  return Math.max(step, Math.ceil((max * 1.08) / step) * step)
}

function useChartTheme() {
  return useCssColors('kcal', 'protein', 'muted-foreground', 'border', 'foreground', 'popover', 'card')
}

function ChartTooltip({ active, payload, label, unit }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string; unit: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="num rounded-xl border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}: <b className="text-foreground">{Math.round(p.value).toLocaleString('vi-VN')}{unit}</b>
        </p>
      ))}
    </div>
  )
}

function KcalChart({ days }: { days: DaySummary[] }) {
  const c = useChartTheme()
  const data = days.map((d) => ({ label: `${dowShort(d.date)} ${dayMonth(d.date)}`, short: dowShort(d.date), eaten: Math.round(d.eaten.kcal), budget: d.budget }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -4 }}>
        <CartesianGrid vertical={false} stroke={c.border} strokeDasharray="0" />
        <XAxis dataKey="short" tickLine={false} axisLine={false} tick={{ fill: c['muted-foreground'], fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: c['muted-foreground'], fontSize: 11 }} width={44} domain={[0, (max: number) => niceMax(max, 500)]} />
        <Tooltip
          cursor={{ fill: c.border, opacity: 0.5 }}
          content={({ active, payload }) => (
            <ChartTooltip active={active} payload={payload as never} label={payload?.[0]?.payload?.label} unit=" kcal" />
          )}
        />
        <Bar dataKey="eaten" name="Đã ăn" fill={c.kcal} radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Line dataKey="budget" name="Quỹ" stroke={c.foreground} strokeWidth={2} strokeDasharray="4 4" dot={false} type="step" activeDot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function ProteinChart({ days, target }: { days: DaySummary[]; target: number }) {
  const c = useChartTheme()
  const data = days.map((d) => ({ label: `${dowShort(d.date)} ${dayMonth(d.date)}`, short: dowShort(d.date), protein: Math.round(d.eaten.protein) }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -4 }}>
        <CartesianGrid vertical={false} stroke={c.border} />
        <XAxis dataKey="short" tickLine={false} axisLine={false} tick={{ fill: c['muted-foreground'], fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: c['muted-foreground'], fontSize: 11 }} width={44} domain={[0, (max: number) => niceMax(Math.max(max, target), 20)]} />
        <Tooltip
          cursor={{ fill: c.border, opacity: 0.5 }}
          content={({ active, payload }) => <ChartTooltip active={active} payload={payload as never} label={payload?.[0]?.payload?.label} unit="g" />}
        />
        <ReferenceLine y={target} stroke={c.foreground} strokeWidth={2} strokeDasharray="4 4" ifOverflow="extendDomain" />
        <Bar dataKey="protein" name="Protein" fill={c.protein} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

import { useMemo, useState } from 'react'
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { dayMonth, todayKey } from '@/lib/date'
import { useCssColors } from '@/lib/useCssColor'
import { cn } from '@/lib/utils'
import { weeklySummaries, type WeekSummary } from '@/lib/weight'
import { activitiesForDate, logsForDate, summarizeDay } from '@/store/derive'
import { useTargets } from '@/store/hooks'
import { useAppStore } from '@/store/useAppStore'

const vi = (n: number, d = 0) => n.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d })

/**
 * Cân nặng theo từng tuần (không chỉ tuần đang xem) + biểu đồ cân chồng với kcal trung bình tuần.
 * Hai biểu đồ xếp chồng, cùng trục thời gian và tooltip đồng bộ — mỗi biểu đồ chỉ 1 trục Y (quy ước UI của app).
 */
export function WeightWeeks() {
  const weightLogs = useAppStore((s) => s.weightLogs)
  const foodLogs = useAppStore((s) => s.foodLogs)
  const activityLogs = useAppStore((s) => s.activityLogs)
  const profile = useAppStore((s) => s.profile)
  const targets = useTargets()
  const today = todayKey()
  const [weeks, setWeeks] = useState(8)

  const all = useMemo(
    () =>
      weeklySummaries({
        weightLogs,
        foodLogs,
        today,
        weeks,
        budgetOf: (d) => summarizeDay(d, logsForDate(foodLogs, d), activitiesForDate(activityLogs, d), profile, targets).budget,
      }),
    [weightLogs, foodLogs, activityLogs, profile, targets, today, weeks],
  )
  // Bỏ các tuần trống ở đầu (trước khi có dữ liệu) cho bảng gọn
  const firstData = all.findIndex((w) => w.weightAvg !== null || w.avgKcal !== null)
  const data = firstData < 0 ? [] : all.slice(firstData)
  const weeksWithWeight = data.filter((w) => w.weightAvg !== null).length
  const weeksWithKcal = data.filter((w) => w.avgKcal !== null).length
  if (weeksWithWeight === 0 && weeksWithKcal === 0) return null

  return (
    <Card className="p-4">
      <h3 className="font-bold">Cân nặng &amp; calo theo tuần</h3>
      <p className="text-xs text-muted-foreground">
        Trung bình mỗi tuần (T2–CN). Calo TB chỉ tính ngày đã log đủ (≥ 600 kcal), chưa tính hôm nay.
      </p>

      {weeksWithWeight >= 2 || weeksWithKcal >= 2 ? <WeekCharts data={data} /> : <p className="mt-3 text-xs text-muted-foreground">Cần dữ liệu ít nhất 2 tuần để vẽ biểu đồ.</p>}

      <div className="-mx-4 mt-3 overflow-x-auto px-4">
        <table className="num w-full min-w-[420px] text-center text-xs">
          <caption className="sr-only">Cân nặng và calo trung bình theo tuần</caption>
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="py-1.5 pr-2 text-left font-semibold">Tuần</th>
              <th className="py-1.5 font-semibold">Cân TB</th>
              <th className="py-1.5 font-semibold">So tuần trước</th>
              <th className="py-1.5 font-semibold">Calo TB</th>
              <th className="py-1.5 font-semibold">Protein TB</th>
              <th className="py-1.5 pl-1 font-semibold">Ngày log</th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((w) => (
              <WeekRow key={w.start} w={w} current={w.start <= today && today <= w.end} goal={profile.goal} />
            ))}
          </tbody>
        </table>
      </div>

      {weeks < 26 && (
        <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => setWeeks(26)}>
          Xem 26 tuần
        </Button>
      )}
    </Card>
  )
}

function WeekRow({ w, current, goal }: { w: WeekSummary; current: boolean; goal: 'cut' | 'maintain' | 'bulk' }) {
  const d = w.weightDelta
  const good = d === null ? null : goal === 'bulk' ? d > 0 && d <= 0.5 : goal === 'cut' ? d < 0 : Math.abs(d) <= 0.3
  return (
    <tr className={cn('border-b last:border-0', current && 'font-semibold')}>
      <th scope="row" className="py-2 pr-2 text-left font-medium">
        {current ? 'Tuần này' : `${dayMonth(w.start)}–${dayMonth(w.end)}`}
      </th>
      <td>{w.weightAvg !== null ? `${vi(w.weightAvg, 1)} kg` : '–'}</td>
      <td className={cn(good === null ? 'text-muted-foreground' : good ? 'text-success' : 'text-warning')}>
        {d === null ? '–' : `${d > 0 ? '+' : d < 0 ? '−' : ''}${vi(Math.abs(d), 1)} kg`}
      </td>
      <td>{w.avgKcal !== null ? vi(w.avgKcal) : '–'}</td>
      <td>{w.avgProtein !== null ? `${w.avgProtein}g` : '–'}</td>
      <td className="pl-1 text-muted-foreground">{w.loggedDays}/7</td>
    </tr>
  )
}

function WeekCharts({ data }: { data: WeekSummary[] }) {
  const c = useCssColors('primary', 'kcal', 'foreground', 'muted-foreground', 'border')
  const rows = data.map((w) => ({ ...w, label: dayMonth(w.start) }))
  const tick = { fill: c['muted-foreground'], fontSize: 11 }
  const margin = { top: 8, right: 4, bottom: 0, left: -4 }
  return (
    <div className="mt-3">
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-primary" aria-hidden /> Cân TB tuần
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-kcal" aria-hidden /> Calo TB / ngày
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-0 w-4 border-t-2 border-dashed border-foreground" aria-hidden /> Quỹ calo TB
        </li>
      </ul>

      <div className="mt-2 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} syncId="weight-weeks" margin={margin}>
            <CartesianGrid vertical={false} stroke={c.border} />
            <XAxis dataKey="label" hide />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={tick}
              width={44}
              domain={[(min: number) => Math.floor((min - 0.3) * 2) / 2, (max: number) => Math.ceil((max + 0.3) * 2) / 2]}
              tickFormatter={(v: number) => vi(v, 1)}
            />
            <Tooltip
              content={({ active, payload }) => {
                const p = payload?.[0]?.payload as (WeekSummary & { label: string }) | undefined
                if (!active || !p) return null
                return (
                  <div className="num rounded-xl border bg-popover px-3 py-2 text-xs shadow-lg">
                    <p className="font-semibold">Tuần {dayMonth(p.start)}–{dayMonth(p.end)}</p>
                    <p className="text-muted-foreground">
                      Cân TB: <b className="text-foreground">{p.weightAvg !== null ? `${vi(p.weightAvg, 1)} kg` : 'chưa cân'}</b>
                    </p>
                    {p.weightDelta !== null && (
                      <p className="text-muted-foreground">
                        So tuần trước: <b className="text-foreground">{p.weightDelta > 0 ? '+' : ''}{vi(p.weightDelta, 1)} kg</b>
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      Calo TB: <b className="text-foreground">{p.avgKcal !== null ? `${vi(p.avgKcal)} kcal` : 'chưa log'}</b>
                    </p>
                  </div>
                )
              }}
            />
            <Line dataKey="weightAvg" name="Cân TB" stroke={c.primary} strokeWidth={2} dot={{ r: 3, fill: c.primary }} connectNulls type="monotone" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} syncId="weight-weeks" margin={margin}>
            <CartesianGrid vertical={false} stroke={c.border} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={tick} minTickGap={12} />
            <YAxis tickLine={false} axisLine={false} tick={tick} width={44} domain={[0, (max: number) => Math.max(500, Math.ceil((max * 1.1) / 500) * 500)]} />
            <Tooltip content={() => null} cursor={false} />
            <Bar dataKey="avgKcal" name="Calo TB" fill={c.kcal} radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Line dataKey="avgBudget" name="Quỹ TB" stroke={c.foreground} strokeWidth={2} strokeDasharray="4 4" dot={false} type="step" activeDot={false} connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

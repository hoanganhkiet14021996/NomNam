import { useMemo, useState } from 'react'
import { CartesianGrid, ComposedChart, Line, ResponsiveContainer, Scatter, Tooltip, XAxis, YAxis } from 'recharts'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { NumberField } from '@/components/NumberField'
import { dayMonth, fromKey, todayKey } from '@/lib/date'
import { useCssColors } from '@/lib/useCssColor'
import { cn } from '@/lib/utils'
import { weightTrend } from '@/store/derive'
import { useAppStore } from '@/store/useAppStore'

/** Cân nặng: nhập nhanh hôm nay + biểu đồ trung bình 7 ngày (lọc dao động do nước). */
export function WeightCard() {
  const weightLogs = useAppStore((s) => s.weightLogs)
  const profileKg = useAppStore((s) => s.profile.weightKg)
  const goal = useAppStore((s) => s.profile.goal)
  const setWeight = useAppStore((s) => s.setWeight)
  const today = todayKey()
  const trend = useMemo(() => weightTrend(weightLogs), [weightLogs])
  const todayEntry = trend.find((t) => t.date === today)
  const [kg, setKg] = useState(todayEntry?.kg ?? trend.at(-1)?.kg ?? profileKg)
  const c = useCssColors('primary', 'muted-foreground', 'border')

  const recent = trend.slice(-30)
  const last = trend.at(-1)
  // So trung bình hiện tại với trung bình ~7 ngày trước
  const weekAgo = last ? [...trend].reverse().find((t) => (fromKey(last.date).getTime() - fromKey(t.date).getTime()) / 864e5 >= 7) : undefined
  const delta = last && weekAgo ? Math.round((last.avg - weekAgo.avg) * 10) / 10 : null
  const deltaGood = delta === null ? null : goal === 'bulk' ? delta > 0 && delta <= 0.5 : goal === 'cut' ? delta < 0 : Math.abs(delta) <= 0.3

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">Cân nặng</h3>
          <p className="text-xs text-muted-foreground">Cân buổi sáng, sau khi đi vệ sinh, trước khi ăn</p>
        </div>
        {last && (
          <div className="text-right">
            <p className="num text-2xl font-extrabold">{last.avg.toLocaleString('vi-VN')} kg</p>
            {delta !== null && (
              <p className={cn('num text-xs font-semibold', deltaGood ? 'text-success' : 'text-warning')}>
                {delta > 0 ? '+' : ''}
                {delta.toLocaleString('vi-VN')} kg / 7 ngày
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <NumberField value={kg} onChange={setKg} step={0.1} min={30} max={250} decimals={1} suffix="kg" ariaLabel="Cân nặng hôm nay" className="flex-1" />
        <Button
          size="lg"
          onClick={() => {
            setWeight(today, kg)
            toast.success(`Đã lưu ${kg.toLocaleString('vi-VN')} kg cho hôm nay`)
          }}
        >
          {todayEntry ? 'Cập nhật' : 'Lưu'}
        </Button>
      </div>

      {recent.length >= 2 ? (
        <>
          <ul className="mt-4 flex gap-4 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/50" aria-hidden /> Cân hằng ngày
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 rounded bg-primary" aria-hidden /> Trung bình 7 ngày
            </li>
          </ul>
          <div className="mt-2 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={recent.map((t) => ({ ...t, label: dayMonth(t.date) }))} margin={{ top: 8, right: 4, bottom: 0, left: -4 }}>
                <CartesianGrid vertical={false} stroke={c.border} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: c['muted-foreground'], fontSize: 11 }} minTickGap={16} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: c['muted-foreground'], fontSize: 11 }}
                  width={44}
                  domain={[(min: number) => Math.floor(min - 0.5), (max: number) => Math.ceil(max + 0.5)]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    const p = payload?.[0]?.payload as (typeof recent)[number] & { label: string } | undefined
                    if (!active || !p) return null
                    return (
                      <div className="num rounded-xl border bg-popover px-3 py-2 text-xs shadow-lg">
                        <p className="font-semibold">{p.label}</p>
                        <p className="text-muted-foreground">
                          Cân: <b className="text-foreground">{p.kg} kg</b>
                        </p>
                        <p className="text-muted-foreground">
                          TB 7 ngày: <b className="text-foreground">{p.avg} kg</b>
                        </p>
                      </div>
                    )
                  }}
                />
                <Scatter dataKey="kg" fill={c['muted-foreground']} fillOpacity={0.5} />
                <Line dataKey="avg" stroke={c.primary} strokeWidth={2} dot={false} type="monotone" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          Cân ít nhất 2 ngày để thấy xu hướng.{' '}
          {goal === 'bulk' ? 'Lean bulk tốt: tăng ~0,25–0,5 kg/tuần.' : goal === 'cut' ? 'Giảm mỡ tốt: giảm ~0,5–1% cân nặng/tuần.' : ''}
        </p>
      )}
    </Card>
  )
}

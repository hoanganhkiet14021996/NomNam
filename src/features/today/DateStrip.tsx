import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { addDays, dayMonth, dowShort, todayKey, weekKeys } from '@/lib/date'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import { activitiesForDate, logsForDate, summarizeDay } from '@/store/derive'
import { useTargets } from '@/store/hooks'
import { useUi } from '@/store/ui'

/** Dải 7 ngày của tuần: chấm xanh = đạt cả calo & protein, vàng = đạt 1 trong 2, xám = có log nhưng chưa đạt. */
export function DateStrip() {
  const date = useUi((s) => s.date)
  const setDate = useUi((s) => s.setDate)
  const foodLogs = useAppStore((s) => s.foodLogs)
  const activityLogs = useAppStore((s) => s.activityLogs)
  const profile = useAppStore((s) => s.profile)
  const targets = useTargets()
  const today = todayKey()

  const days = useMemo(
    () =>
      weekKeys(date).map((d) => ({
        date: d,
        ...summarizeDay(d, logsForDate(foodLogs, d), activitiesForDate(activityLogs, d), profile, targets).adherence,
      })),
    [date, foodLogs, activityLogs, profile, targets],
  )

  return (
    <div className="flex items-center gap-1 px-2">
      <Button variant="ghost" size="icon-sm" aria-label="Tuần trước" onClick={() => setDate(addDays(date, -7))}>
        <ChevronLeft />
      </Button>
      <div className="grid flex-1 grid-cols-7 gap-1">
        {days.map((d) => {
          const active = d.date === date
          const isToday = d.date === today
          const future = d.date > today
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => setDate(d.date)}
              disabled={future}
              aria-pressed={active}
              aria-label={`${dowShort(d.date)} ${dayMonth(d.date)}`}
              className={cn(
                'relative flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-xs transition-colors disabled:opacity-35',
                active ? 'text-primary-foreground' : 'hover:bg-accent',
              )}
            >
              {active && (
                <motion.span
                  layoutId="date-pill"
                  className="absolute inset-0 rounded-xl bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className={cn('relative font-medium', !active && 'text-muted-foreground')}>{dowShort(d.date)}</span>
              <span className={cn('num relative text-sm font-bold', isToday && !active && 'text-primary')}>
                {Number(d.date.slice(8))}
              </span>
              <span
                className={cn(
                  'relative h-1.5 w-1.5 rounded-full',
                  !d.logged && 'bg-transparent',
                  d.logged && d.hit && (active ? 'bg-primary-foreground' : 'bg-success-fill'),
                  d.logged && !d.hit && (d.kcalOk || d.proteinOk) && 'bg-warning-fill',
                  d.logged && !d.kcalOk && !d.proteinOk && (active ? 'bg-primary-foreground/50' : 'bg-muted-foreground/40'),
                )}
              />
            </button>
          )
        })}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Tuần sau"
        disabled={weekKeys(date)[6] >= today}
        onClick={() => {
          const next = addDays(date, 7)
          setDate(next > today ? today : next)
        }}
      >
        <ChevronRight />
      </Button>
    </div>
  )
}

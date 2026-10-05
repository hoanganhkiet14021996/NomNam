import { motion } from 'motion/react'
import { ChevronRight, Copy, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { addDays, friendlyDay, todayKey } from '@/lib/date'
import { fmtKcal } from '@/lib/nutrition'
import { MEALS, logsForDate } from '@/store/derive'
import { useDay } from '@/store/hooks'
import { useAppStore } from '@/store/useAppStore'
import { useUi } from '@/store/ui'
import { DateStrip } from './DateStrip'
import { MealSection } from './MealSection'
import { SummaryCard } from './SummaryCard'

export function TodayView() {
  const date = useUi((s) => s.date)
  const setDate = useUi((s) => s.setDate)
  const setTab = useUi((s) => s.setTab)
  const openAdd = useUi((s) => s.openAdd)
  const day = useDay(date)
  const foodLogs = useAppStore((s) => s.foodLogs)
  const copyDay = useAppStore((s) => s.copyDay)
  const today = todayKey()
  const yesterdayCount = logsForDate(foodLogs, addDays(date, -1)).length

  return (
    <div className="space-y-4">
      <PageHeader
        subtitle={date === today ? greeting() : 'Nhật ký'}
        title={friendlyDay(date)}
        right={
          date !== today && (
            <Button variant="soft" size="sm" onClick={() => setDate(today)}>
              Về hôm nay
            </Button>
          )
        }
      />
      <DateStrip />

      <div className="space-y-4 px-4">
        <SummaryCard day={day} />

        {day.logs.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="flex flex-col items-center gap-3 border-dashed p-5 text-center shadow-none">
              <p className="text-sm text-muted-foreground">
                Chưa có món nào {date === today ? 'hôm nay' : 'ngày này'}. Bấm <b className="text-foreground">+</b> để thêm, hoặc:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {yesterdayCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const n = copyDay(addDays(date, -1), date)
                      toast.success(`Đã chép ${n} món từ hôm trước`)
                    }}
                  >
                    <Copy /> Chép cả ngày hôm trước ({yesterdayCount} món)
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => openAdd({ view: 'ai' })}>
                  <Sparkles /> Mô tả bữa ăn bằng AI
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {MEALS.map((m) => (
          <MealSection key={m.id} meal={m.id} date={date} logs={day.logs.filter((l) => l.meal === m.id)} />
        ))}

        <Card className="p-0">
          <button
            type="button"
            onClick={() => setTab('activity')}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/60"
          >
            <span className="text-lg" aria-hidden>
              🏃
            </span>
            <span className="flex-1">
              <span className="block font-bold">Vận động</span>
              <span className="block text-xs text-muted-foreground">
                {day.activities.length
                  ? day.activities.map((a) => `${a.name} ${a.minutes}'`).join(' · ')
                  : 'Chưa ghi hoạt động nào'}
              </span>
            </span>
            {day.exerciseKcal > 0 && (
              <span className="num text-sm font-bold text-primary">−{fmtKcal(day.exerciseKcal)}</span>
            )}
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </Card>
      </div>
    </div>
  )
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 11) return 'Chào buổi sáng'
  if (h < 14) return 'Chào buổi trưa'
  if (h < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

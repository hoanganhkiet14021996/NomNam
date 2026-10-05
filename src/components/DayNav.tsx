import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addDays, friendlyDay, todayKey } from '@/lib/date'
import { useUi } from '@/store/ui'

/** ‹ Hôm nay › — chuyển ngày gọn cho các tab phụ. */
export function DayNav() {
  const date = useUi((s) => s.date)
  const setDate = useUi((s) => s.setDate)
  const today = todayKey()
  return (
    <div className="flex items-center gap-1 rounded-xl bg-muted p-0.5">
      <Button variant="ghost" size="icon-sm" aria-label="Ngày trước" onClick={() => setDate(addDays(date, -1))}>
        <ChevronLeft />
      </Button>
      <span className="min-w-[72px] text-center text-sm font-semibold">{friendlyDay(date)}</span>
      <Button variant="ghost" size="icon-sm" aria-label="Ngày sau" disabled={date >= today} onClick={() => setDate(addDays(date, 1))}>
        <ChevronRight />
      </Button>
    </div>
  )
}

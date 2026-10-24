import { useState } from 'react'
import { Scale } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { NumberField } from '@/components/NumberField'
import { todayKey } from '@/lib/date'
import { daysSinceLastWeigh, needsWeighReminder, weighIns } from '@/lib/weight'
import { useSettings } from '@/store/settings'
import { useAppStore } from '@/store/useAppStore'

/** Nhắc cân khi ≥ 2 ngày chưa cân (chỉ hiện ở hôm nay); nhập nhanh tại chỗ, "Để sau" ẩn tới hết hôm nay. */
export function WeightReminder() {
  const weightLogs = useAppStore((s) => s.weightLogs)
  const profileKg = useAppStore((s) => s.profile.weightKg)
  const setWeight = useAppStore((s) => s.setWeight)
  const snoozedOn = useSettings((s) => s.weighRemindSnoozedOn)
  const snooze = useSettings((s) => s.snoozeWeighRemind)
  const today = todayKey()
  const lastKg = weighIns(weightLogs).at(-1)?.kg ?? profileKg
  const [kg, setKg] = useState(lastKg)

  if (snoozedOn === today || !needsWeighReminder(weightLogs, today)) return null
  const since = daysSinceLastWeigh(weightLogs, today)

  return (
    <Card className="space-y-3 border-primary/25 bg-primary/5 p-4 shadow-none">
      <div className="flex items-start gap-3">
        <Scale className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="font-bold">{since === null ? 'Bạn chưa cân lần nào' : `Đã ${since} ngày chưa cân`}</p>
          <p className="text-xs text-muted-foreground">Cân buổi sáng, sau khi đi vệ sinh, trước khi ăn. Cân đều mỗi ngày giúp app đánh giá mục tiêu kcal chính xác hơn.</p>
        </div>
      </div>
      <div className="flex gap-2">
        <NumberField value={kg} onChange={setKg} step={0.1} min={30} max={250} decimals={1} suffix="kg" ariaLabel="Cân nặng hôm nay" className="flex-1" />
        <Button
          size="lg"
          onClick={() => {
            setWeight(today, kg)
            toast.success(`Đã lưu ${kg.toLocaleString('vi-VN')} kg cho hôm nay`)
          }}
        >
          Lưu
        </Button>
      </div>
      <button type="button" onClick={() => snooze(today)} className="text-xs font-semibold text-muted-foreground underline-offset-2 hover:underline">
        Để sau
      </button>
    </Card>
  )
}

import { CalorieRing } from '@/components/CalorieRing'
import { MacroBar } from '@/components/MacroBar'
import { Card } from '@/components/ui/card'
import { fmtKcal } from '@/lib/nutrition'
import type { DaySummary } from '@/store/derive'
import { useAppStore } from '@/store/useAppStore'

export function SummaryCard({ day }: { day: DaySummary }) {
  const eatBack = useAppStore((s) => s.profile.exerciseEatBackPct)
  const bonus = day.budget - day.targets.kcal

  return (
    <Card className="overflow-hidden p-4">
      <div className="flex items-center gap-4">
        <CalorieRing eaten={day.eaten.kcal} budget={day.budget} />
        <dl className="num flex-1 space-y-2 text-sm">
          <Row label="Mục tiêu" value={fmtKcal(day.targets.kcal)} />
          <Row label="Đã ăn" value={`− ${fmtKcal(day.eaten.kcal)}`} />
          <Row
            label={`Tập (${eatBack}%)`}
            value={`+ ${fmtKcal(bonus)}`}
            hint={day.exerciseKcal > 0 ? `đốt ${fmtKcal(day.exerciseKcal)}` : undefined}
          />
          <div className="border-t pt-2">
            <Row label="Quỹ ngày" value={fmtKcal(day.budget)} strong />
          </div>
        </dl>
      </div>

      <div className="mt-5 space-y-3.5">
        <MacroBar macro="protein" value={day.eaten.protein} target={day.targets.protein} emphasis />
        <div className="grid grid-cols-3 gap-3">
          <MacroBar macro="carbs" value={day.eaten.carbs} target={day.targets.carbs} />
          <MacroBar macro="fat" value={day.eaten.fat} target={day.targets.fat} />
          <MacroBar macro="fiber" value={day.eaten.fiber} target={day.targets.fiber} />
        </div>
      </div>
    </Card>
  )
}

function Row({ label, value, hint, strong }: { label: string; value: string; hint?: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className={strong ? 'font-semibold' : 'text-muted-foreground'}>
        {label}
        {hint && <span className="block text-[11px] leading-tight text-muted-foreground/80">{hint}</span>}
      </dt>
      <dd className={strong ? 'text-base font-extrabold' : 'font-semibold'}>{value}</dd>
    </div>
  )
}

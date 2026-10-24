import { useMemo } from 'react'
import { Info, Scale, TrendingDown, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { addDays, dayMonth, nowIso, todayKey } from '@/lib/date'
import { GOAL_LABEL } from '@/lib/nutrition'
import { adviseCalories, ADVICE_MIN_SPAN_DAYS } from '@/lib/weight'
import { useTargets } from '@/store/hooks'
import { useSettings } from '@/store/settings'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

const vi = (n: number, d = 0) => n.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d })
const signed = (n: number, d = 1) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${vi(Math.abs(n), d)}`

/**
 * Gợi ý chỉnh kcal theo xu hướng cân thật (3 tuần). `compact` (tab Hôm nay): chỉ hiện khi có gợi ý cần quyết định.
 * Không tự đổi gì — người dùng bấm Áp dụng (có Hoàn tác) hoặc Bỏ qua (ẩn 7 ngày).
 */
export function WeightAdvice({ compact = false }: { compact?: boolean }) {
  const weightLogs = useAppStore((s) => s.weightLogs)
  const foodLogs = useAppStore((s) => s.foodLogs)
  const profile = useAppStore((s) => s.profile)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const targets = useTargets()
  const snoozeUntil = useSettings((s) => s.adviceSnoozeUntil)
  const snoozeAdvice = useSettings((s) => s.snoozeAdvice)
  const today = todayKey()

  const advice = useMemo(
    () =>
      adviseCalories({
        weightLogs,
        foodLogs,
        goal: profile.goal,
        weightKg: profile.weightKg,
        targetKcal: targets.kcal,
        adjustedAt: profile.overrides?.adjustedAt,
        today,
      }),
    [weightLogs, foodLogs, profile.goal, profile.weightKg, profile.overrides?.adjustedAt, targets.kcal, today],
  )

  const snoozed = snoozeUntil >= today
  const actionable = advice.kind === 'raise' || advice.kind === 'lower'
  if (compact && (!actionable || snoozed)) return null

  // ── Chưa đủ dữ liệu ─────────────────────────────────
  if (advice.kind === 'collecting') {
    return (
      <Card className="flex gap-3 p-4 shadow-none">
        <Scale className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <div className="min-w-0 space-y-1 text-sm">
          <p className="font-bold">Đang thu thập dữ liệu để đánh giá mục tiêu kcal</p>
          <p className="text-xs text-muted-foreground">
            Cân nặng dao động 1–2 kg theo nước và muối, nên app chỉ đánh giá khi có xu hướng ≥ {ADVICE_MIN_SPAN_DAYS} ngày. Còn thiếu:
          </p>
          <ul className="list-disc pl-5 text-xs">
            {advice.missing.length ? advice.missing.map((m) => <li key={m}>{m}</li>) : <li>chưa đủ điểm cân để vẽ xu hướng</li>}
          </ul>
          {profile.overrides?.adjustedAt && (
            <p className="text-xs text-muted-foreground">Đã chỉnh kcal ngày {dayMonth(profile.overrides.adjustedAt.slice(0, 10))}; chỉ tính dữ liệu từ sau ngày đó.</p>
          )}
        </div>
      </Card>
    )
  }

  const rateText = `${signed(advice.rate[0])} … ${signed(advice.rate[1])} kg/tuần`
  const ateText =
    advice.avgKcal !== null && advice.tdee !== null
      ? `Bạn ăn TB ${vi(advice.avgKcal)} kcal/ngày (${advice.loggedDays} ngày log) và cân đổi ${signed(advice.slope ?? 0)} kg/tuần → cơ thể đốt khoảng ${vi(advice.tdee)} kcal/ngày.`
      : ''

  // ── Đúng hướng ──────────────────────────────────────
  if (advice.kind === 'ok') {
    return (
      <Card className="flex gap-3 border-success/30 bg-success/5 p-4 shadow-none">
        <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden />
        <div className="min-w-0 space-y-1 text-sm">
          <p className="font-bold">Cân nặng đúng hướng ✓</p>
          <p className="text-xs">
            {GOAL_LABEL[profile.goal]}: xu hướng <b className="num">{signed(advice.slope ?? 0)} kg/tuần</b> (mục tiêu {rateText}). Mục tiêu {vi(targets.kcal)} kcal đang hợp lý.
          </p>
          {ateText && <p className="text-xs text-muted-foreground">{ateText}</p>}
        </div>
      </Card>
    )
  }

  // ── Có gợi ý chỉnh ──────────────────────────────────
  if (snoozed) {
    return (
      <Card className="flex items-center gap-3 p-3 shadow-none">
        <Info className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <p className="flex-1 text-xs text-muted-foreground">Đã ẩn gợi ý chỉnh kcal tới {dayMonth(snoozeUntil)}.</p>
        <Button variant="ghost" size="sm" onClick={() => snoozeAdvice('')}>
          Xem lại
        </Button>
      </Card>
    )
  }

  const up = advice.kind === 'raise'
  const Icon = up ? TrendingUp : TrendingDown
  const apply = () => {
    const prev = profile.overrides
    updateProfile({ overrides: { ...prev, kcal: advice.newKcal!, adjustedAt: nowIso() } })
    toast.success(`Đã đổi mục tiêu thành ${vi(advice.newKcal!)} kcal`, {
      description: 'App sẽ đánh giá lại sau ~10 ngày theo dữ liệu mới.',
      action: { label: 'Hoàn tác', onClick: () => updateProfile({ overrides: prev }) },
    })
  }
  return (
    <Card className="space-y-3 border-warning/40 bg-warning/5 p-4 shadow-none">
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
        <div className="min-w-0 space-y-1">
          <p className="font-bold">
            Gợi ý: {up ? 'tăng' : 'giảm'} mục tiêu ~{vi(Math.abs(advice.delta))} kcal/ngày{' '}
            <span className="num whitespace-nowrap font-semibold text-muted-foreground">
              ({vi(targets.kcal)} → {vi(advice.newKcal!)})
            </span>
          </p>
          <p className="text-xs">
            {GOAL_LABEL[profile.goal]} cần cân đổi {rateText}, nhưng xu hướng 3 tuần là <b className="num">{signed(advice.slope ?? 0)} kg/tuần</b>.
          </p>
          {ateText && <p className="text-xs text-muted-foreground">{ateText}</p>}
          {up && (advice.slope ?? 0) < advice.rate[0] && (
            <p className={cn('text-xs text-muted-foreground')}>
              Nếu nghi mình log thiếu (dầu ăn khi xào, đồ uống, ăn vặt), hãy kiểm tra trước — log đủ thì tăng kcal mới đúng.
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="flex-1" onClick={apply}>
          Áp dụng
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => snoozeAdvice(addDays(today, 7))}>
          Bỏ qua 7 ngày
        </Button>
      </div>
    </Card>
  )
}

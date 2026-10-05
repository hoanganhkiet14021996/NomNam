import { motion } from 'motion/react'
import { AnimatedNumber } from './AnimatedNumber'
import { cn } from '@/lib/utils'

/** Vòng tiến độ calo: hiển thị "còn lại", đổi màu cảnh báo khi vượt quỹ. */
export function CalorieRing({
  eaten,
  budget,
  size = 168,
  stroke = 14,
}: {
  eaten: number
  budget: number
  size?: number
  stroke?: number
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = budget > 0 ? eaten / budget : 0
  const over = pct > 1.1
  const remaining = Math.round(budget - eaten)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn(over ? 'stroke-destructive' : 'stroke-kcal')}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.min(pct, 1)) }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {remaining >= 0 ? 'Còn lại' : 'Vượt'}
        </span>
        <AnimatedNumber
          value={Math.abs(remaining)}
          className={cn('num text-4xl font-extrabold tracking-tight', remaining < 0 && 'text-destructive')}
        />
        <span className="text-xs font-medium text-muted-foreground">kcal</span>
      </div>
    </div>
  )
}

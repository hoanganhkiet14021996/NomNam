import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fmtG } from '@/lib/nutrition'

export type MacroKey = 'protein' | 'carbs' | 'fat' | 'fiber'

const MACRO_META: Record<MacroKey, { label: string; short: string; bar: string; text: string }> = {
  protein: { label: 'Protein', short: 'P', bar: 'bg-protein', text: 'text-protein' },
  carbs: { label: 'Carbs', short: 'C', bar: 'bg-carbs', text: 'text-carbs' },
  fat: { label: 'Fat', short: 'F', bar: 'bg-fat', text: 'text-fat' },
  fiber: { label: 'Chất xơ', short: 'Xơ', bar: 'bg-fiber', text: 'text-fiber' },
}

/** Thanh tiến độ 1 macro. `emphasis` = to hơn (dùng cho protein — mục tiêu chính). */
export function MacroBar({
  macro,
  value,
  target,
  emphasis = false,
}: {
  macro: MacroKey
  value: number
  target: number
  emphasis?: boolean
}) {
  const meta = MACRO_META[macro]
  const pct = target > 0 ? value / target : 0
  const done = Math.round(value) >= target && target > 0
  const left = Math.max(0, target - value)

  return (
    <div className={cn('min-w-0', emphasis ? 'space-y-2' : 'space-y-1')}>
      <div className={cn(emphasis ? 'flex items-baseline justify-between gap-2' : 'space-y-0.5')}>
        <span className={cn('flex items-center gap-1 whitespace-nowrap font-semibold', emphasis ? 'text-sm' : 'text-xs')}>
          <span className={cn('inline-block h-2 w-2 shrink-0 rounded-full', meta.bar)} />
          {meta.label}
          {done && <Check className={cn('h-3.5 w-3.5', meta.text)} strokeWidth={3} aria-label="Đã đạt" />}
        </span>
        <span className={cn('num block whitespace-nowrap text-muted-foreground', emphasis ? 'text-sm' : 'text-xs')}>
          <span className="font-bold text-foreground">{fmtG(value)}</span> / {fmtG(target)}g
          {emphasis && !done && <span className="ml-1.5 text-xs">· còn {fmtG(left)}g</span>}
        </span>
      </div>
      <div
        className={cn('overflow-hidden rounded-full bg-muted', emphasis ? 'h-3' : 'h-2')}
        role="progressbar"
        aria-label={meta.label}
        aria-valuenow={Math.round(value)}
        aria-valuemax={target}
      >
        <motion.div
          className={cn('h-full rounded-full', meta.bar, pct > 1.25 && macro !== 'protein' && macro !== 'fiber' && 'opacity-60')}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 1) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

/** Dòng macro nhỏ gọn: "P 30 · C 45 · F 12 · Xơ 3" */
export function MacroInline({
  protein,
  carbs,
  fat,
  fiber,
  className,
}: {
  protein: number
  carbs: number
  fat: number
  fiber?: number
  className?: string
}) {
  return (
    <span className={cn('num flex flex-wrap gap-x-2 text-xs text-muted-foreground', className)}>
      <span>
        <b className="font-semibold text-protein">P</b> {fmtG(protein)}
      </span>
      <span>
        <b className="font-semibold text-carbs">C</b> {fmtG(carbs)}
      </span>
      <span>
        <b className="font-semibold text-fat">F</b> {fmtG(fat)}
      </span>
      {fiber !== undefined && (
        <span>
          <b className="font-semibold text-fiber">Xơ</b> {fmtG(fiber)}
        </span>
      )}
    </span>
  )
}

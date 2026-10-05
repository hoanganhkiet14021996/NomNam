import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Ô số có nút −/+ hai bên, cho phép gõ trực tiếp.
 * Khi đang gõ giữ chuỗi nháp (cho phép rỗng / "1,"), giá trị hợp lệ mới đẩy ra ngoài.
 */
export function NumberField({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 100000,
  suffix,
  className,
  inputClassName,
  ariaLabel,
  decimals = 0,
}: {
  value: number
  onChange: (v: number) => void
  step?: number
  min?: number
  max?: number
  suffix?: string
  className?: string
  inputClassName?: string
  ariaLabel: string
  decimals?: number
}) {
  const [draft, setDraft] = useState<string | null>(null)

  const clamp = (v: number) => {
    const f = 10 ** decimals
    return Math.min(max, Math.max(min, Math.round(v * f) / f))
  }
  const bump = (delta: number) => {
    setDraft(null)
    onChange(clamp(value + delta))
  }

  return (
    <div className={cn('flex h-12 items-center rounded-xl border border-input bg-card', className)}>
      <button
        type="button"
        aria-label={`Giảm ${ariaLabel}`}
        className="flex h-full w-12 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:scale-90"
        onClick={() => bump(-step)}
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="flex min-w-0 flex-1 items-baseline justify-center gap-1">
        <input
          inputMode={decimals ? 'decimal' : 'numeric'}
          aria-label={ariaLabel}
          value={draft ?? String(value).replace('.', ',')}
          placeholder="0"
          onFocus={(e) => {
            // Ô đang là 0 → để trống cho gõ luôn (iOS thường bỏ qua select() nên sẽ thành "025")
            setDraft(value === 0 ? '' : String(value).replace('.', ','))
            e.currentTarget.select()
          }}
          onChange={(e) => {
            const t = e.target.value.replace(/[^\d.,]/g, '').replace(/^0+(?=\d)/, '')
            setDraft(t)
            const v = Number(t.replace(',', '.'))
            if (t !== '' && Number.isFinite(v)) onChange(clamp(v))
          }}
          onBlur={() => setDraft(null)}
          className={cn('num w-full min-w-0 bg-transparent text-center text-lg font-bold outline-none', inputClassName)}
        />
        {suffix && <span className="shrink-0 pr-1 text-sm text-muted-foreground">{suffix}</span>}
      </div>
      <button
        type="button"
        aria-label={`Tăng ${ariaLabel}`}
        className="flex h-full w-12 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:scale-90"
        onClick={() => bump(step)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

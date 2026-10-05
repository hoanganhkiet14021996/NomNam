import { useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { NumberField } from '@/components/NumberField'
import { MacroInline } from '@/components/MacroBar'
import { fmtG, fmtKcal, scaleNutrients } from '@/lib/nutrition'
import { cn } from '@/lib/utils'
import { MEAL_LABEL } from '@/store/derive'
import type { Food, MealType, Nutrients } from '@/types'

export interface PortionResult extends Nutrients {
  grams: number
  servingLabel: string | null
}

/** Chọn khẩu phần: chip khẩu phần chuẩn × số lượng, hoặc nhập gram tự do. Dinh dưỡng cập nhật trực tiếp. */
export function PortionPicker({
  food,
  meal,
  initialGrams,
  onBack,
  onAdd,
}: {
  food: Food
  meal: MealType
  initialGrams?: number
  onBack: () => void
  onAdd: (r: PortionResult) => void
}) {
  const servings = food.servings
  const presetIdx = initialGrams ? servings.findIndex((s) => s.grams === initialGrams) : 0
  const [mode, setMode] = useState<'serving' | 'gram'>(initialGrams && presetIdx < 0 ? 'gram' : 'serving')
  const [idx, setIdx] = useState(Math.max(0, presetIdx))
  const [qty, setQty] = useState(1)
  const [grams, setGrams] = useState(initialGrams ?? food.defaultGrams)

  const serving = servings[idx]
  const totalGrams = mode === 'serving' && serving ? serving.grams * qty : grams
  const n = useMemo(() => scaleNutrients(food.per100, totalGrams), [food, totalGrams])
  const label = mode === 'serving' && serving ? (qty === 1 ? serving.label : `${fmtG(qty)} × ${serving.label}`) : null

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col gap-4 px-4 pb-6 pt-1"
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Quay lại">
          <ArrowLeft />
        </Button>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-2xl" aria-hidden>
          {food.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold leading-tight">{food.name}</h2>
          <p className="num text-xs text-muted-foreground">
            100g: {fmtKcal(food.per100.kcal)} kcal · P {fmtG(food.per100.protein)}g
          </p>
        </div>
      </div>

      {/* Kết quả */}
      <div className="flex items-end justify-between rounded-2xl bg-muted/60 px-4 py-3">
        <div>
          <div className="num text-3xl font-extrabold tracking-tight">
            {fmtKcal(n.kcal)} <span className="text-sm font-semibold text-muted-foreground">kcal</span>
          </div>
          <MacroInline {...n} className="mt-0.5 text-[13px]" />
        </div>
        <div className="num text-right text-sm font-semibold text-muted-foreground">{fmtG(totalGrams)}g</div>
      </div>

      {/* Khẩu phần */}
      <div className="flex flex-wrap gap-2">
        {servings.map((s, i) => (
          <Chip
            key={s.label + s.grams}
            active={mode === 'serving' && i === idx}
            onClick={() => {
              setMode('serving')
              setIdx(i)
              setQty(1)
            }}
          >
            {s.label}
            {!/^\d+g$/.test(s.label) && <span className="ml-1 opacity-60">{s.grams}g</span>}
          </Chip>
        ))}
        <Chip
          active={mode === 'gram'}
          onClick={() => {
            setMode('gram')
            setGrams(totalGrams)
          }}
        >
          Tự nhập gram
        </Chip>
      </div>

      {mode === 'serving' ? (
        <div className="flex items-center gap-3">
          <span className="w-20 text-sm font-semibold text-muted-foreground">Số lượng</span>
          <NumberField value={qty} onChange={setQty} step={0.5} min={0.5} max={50} decimals={1} ariaLabel="Số lượng" className="flex-1" />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="w-20 text-sm font-semibold text-muted-foreground">Khối lượng</span>
          <NumberField value={grams} onChange={setGrams} step={10} min={1} max={5000} suffix="g" ariaLabel="Khối lượng" className="flex-1" />
        </div>
      )}

      <Button size="lg" onClick={() => onAdd({ ...n, grams: totalGrams, servingLabel: label })} disabled={totalGrams <= 0}>
        Thêm vào {MEAL_LABEL[meal].toLowerCase()}
      </Button>
    </motion.div>
  )
}

export function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-semibold transition-colors active:scale-95',
        active ? 'border-primary bg-primary text-primary-foreground' : 'bg-card hover:bg-accent',
        className,
      )}
    >
      {children}
    </button>
  )
}

import { motion } from 'motion/react'
import { Check, HelpCircle, History, X } from 'lucide-react'
import { MacroInline } from '@/components/MacroBar'
import { NumberField } from '@/components/NumberField'
import { Switch } from '@/components/ui/switch'
import { answerQuestion, chooseFood, COOKING_LABEL, reviewNutrients, ROLE_LABEL, usualSuggestion, type ReviewItem, type UsualPortion } from '@/lib/ai/match'
import { fmtKcal } from '@/lib/nutrition'
import { cn } from '@/lib/utils'
import type { Food } from '@/types'

/** Một thành phần trên màn "Kiểm tra lại" của AI. */
export function AiReviewItem({
  item,
  foods,
  usual,
  onChange,
  onRemove,
}: {
  item: ReviewItem
  foods: readonly Food[]
  usual: Record<string, UsualPortion>
  onChange: (next: ReviewItem) => void
  onRemove: () => void
}) {
  const n = reviewNutrients(item)
  const usualGrams = usualSuggestion(item, usual)
  const cooking = COOKING_LABEL[item.cooking]
  const pendingQuestion = item.question && !item.answer

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className={cn('space-y-2.5 rounded-2xl border bg-card p-3', pendingQuestion && 'border-warning/60')}
    >
      <div className="flex items-start gap-2">
        <span className="text-xl" aria-hidden>
          {item.emoji}
        </span>
        <div className="min-w-0 flex-1">
          {item.food ? (
            <p className="text-sm font-semibold leading-snug">{item.name}</p>
          ) : (
            <input
              value={item.name}
              aria-label="Tên món"
              onChange={(e) => onChange({ ...item, name: e.target.value })}
              className="w-full bg-transparent text-sm font-semibold outline-none"
            />
          )}
          <p className="text-[11px] text-muted-foreground">
            {ROLE_LABEL[item.role]}
            {item.kind && item.kind.toLowerCase() !== item.name.toLowerCase() ? ` · ${item.kind}` : ''}
            {cooking ? ` · ${cooking}` : ''}
          </p>
          <MacroInline {...n} />
        </div>
        <div className="text-right">
          <div className="num text-sm font-bold">{fmtKcal(n.kcal)} kcal</div>
          {item.food ? (
            <div className="text-[10px] font-semibold text-success">✓ theo bảng món</div>
          ) : (
            <div className="text-[10px] font-semibold text-warning">{item.confidence === 'low' ? 'ước lượng thô' : 'AI ước lượng'}</div>
          )}
        </div>
        <button type="button" aria-label={`Bỏ ${item.name}`} onClick={onRemove} className="text-muted-foreground hover:text-destructive">
          <X className="h-4 w-4" />
        </button>
      </div>

      {item.question && (
        <div className={cn('space-y-1.5 rounded-xl px-2.5 py-2', pendingQuestion ? 'bg-warning/10' : 'bg-muted')}>
          <p className="flex items-center gap-1 text-xs font-semibold">
            <HelpCircle className="h-3.5 w-3.5 text-warning" aria-hidden /> {item.question.text}
          </p>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={item.question.text}>
            {item.question.options.map((o) => (
              <Chip key={o.label} active={item.answer === o.label} onClick={() => onChange(answerQuestion(item, o, foods))}>
                {o.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {(item.candidates.length > 0 || item.food) && (
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-muted-foreground">Món trong bảng</p>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Chọn món cho ${item.name}`}>
            {item.candidates.map((c) => (
              <Chip key={c.id} active={item.food?.id === c.id} onClick={() => onChange(chooseFood(item, c))}>
                {c.emoji} {c.name}
              </Chip>
            ))}
            <Chip active={!item.food} onClick={() => onChange(chooseFood(item, null))}>
              ✨ AI ước lượng
            </Chip>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <NumberField
          value={item.grams}
          onChange={(g) => onChange({ ...item, grams: g })}
          step={10}
          min={1}
          max={5000}
          suffix="g"
          ariaLabel={`Khối lượng ${item.name}`}
          className="h-10 flex-1"
        />
        {usualGrams !== null && (
          <button
            type="button"
            onClick={() => onChange({ ...item, grams: usualGrams })}
            className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"
          >
            <History className="h-3.5 w-3.5" aria-hidden /> Phần quen <span className="num">{usualGrams}g</span>
          </button>
        )}
      </div>

      {!item.food && (
        <label className="flex items-center justify-between gap-3 rounded-xl bg-muted px-2.5 py-2">
          <span className="text-xs">
            <span className="font-semibold">Lưu thành món riêng</span>
            <span className="block text-[11px] text-muted-foreground">Món chưa có trong bảng → được ghi vào "Món chờ bổ sung" để research.</span>
          </span>
          <Switch checked={item.saveCustom} onCheckedChange={(v) => onChange({ ...item, saveCustom: v })} aria-label="Lưu thành món riêng" />
        </label>
      )}
    </motion.li>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'flex max-w-full items-center gap-1 truncate rounded-full border px-2.5 py-1 text-xs font-medium transition',
        active ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-foreground hover:border-primary/60',
      )}
    >
      {active && <Check className="h-3 w-3 shrink-0" aria-hidden />}
      <span className="truncate">{children}</span>
    </button>
  )
}

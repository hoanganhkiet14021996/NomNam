import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NumberField } from '@/components/NumberField'
import { MEAL_LABEL } from '@/store/derive'
import type { MealType, Nutrients } from '@/types'

/** Nhập thẳng kcal/macro (đồ ăn ngoài có nhãn dinh dưỡng, món không có trong danh sách). */
export function QuickAdd({
  meal,
  onBack,
  onAdd,
}: {
  meal: MealType
  onBack: () => void
  onAdd: (name: string, n: Nutrients) => void
}) {
  const [name, setName] = useState('')
  const [n, setN] = useState<Nutrients>({ kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })
  const fromMacros = Math.round(n.protein * 4 + n.carbs * 4 + n.fat * 9)
  const kcal = n.kcal || fromMacros
  const set = (k: keyof Nutrients) => (v: number) => setN((s) => ({ ...s, [k]: v }))

  return (
    <div className="space-y-4 px-4 pb-6 pt-1">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Quay lại">
          <ArrowLeft />
        </Button>
        <h2 className="text-base font-bold">Nhập nhanh</h2>
      </div>
      <Input placeholder="Tên món (không bắt buộc)" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Kcal" hint={!n.kcal && fromMacros ? `≈ ${fromMacros} từ macro` : undefined}>
          <NumberField value={n.kcal} onChange={set('kcal')} step={10} ariaLabel="Kcal" className="h-11" />
        </Field>
        <Field label="Protein (g)">
          <NumberField value={n.protein} onChange={set('protein')} step={1} decimals={1} ariaLabel="Protein" className="h-11" />
        </Field>
        <Field label="Carbs (g)">
          <NumberField value={n.carbs} onChange={set('carbs')} step={1} decimals={1} ariaLabel="Carbs" className="h-11" />
        </Field>
        <Field label="Fat (g)">
          <NumberField value={n.fat} onChange={set('fat')} step={1} decimals={1} ariaLabel="Fat" className="h-11" />
        </Field>
        <Field label="Chất xơ (g)">
          <NumberField value={n.fiber} onChange={set('fiber')} step={1} decimals={1} ariaLabel="Chất xơ" className="h-11" />
        </Field>
      </div>
      <Button
        size="lg"
        className="w-full"
        disabled={kcal <= 0}
        onClick={() => onAdd(name.trim() || 'Nhập nhanh', { ...n, kcal })}
      >
        Thêm {kcal > 0 ? `${kcal} kcal ` : ''}vào {MEAL_LABEL[meal].toLowerCase()}
      </Button>
    </div>
  )
}

// div, không dùng <label>: <label> bọc NumberField sẽ gắn vào nút "−" đầu tiên → bấm nhãn làm giảm giá trị.
// Control bên trong tự mang aria-label.
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <span className="flex items-baseline justify-between text-xs font-semibold text-muted-foreground">
        {label}
        {hint && <span className="font-normal text-primary">{hint}</span>}
      </span>
      {children}
    </div>
  )
}

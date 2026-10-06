import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NumberField } from '@/components/NumberField'
import { useAppStore } from '@/store/useAppStore'
import type { Food, Nutrients } from '@/types'
import { Field } from './QuickAdd'

const EMOJIS = ['🍽️', '🍚', '🍜', '🥩', '🍗', '🐟', '🥚', '🥗', '🥛', '🍞', '🍌', '💪', '🍫', '🥤']

/** Tạo món riêng. Nhập theo 1 khẩu phần (giống nhãn dinh dưỡng), app tự quy ra trên 100g. */
export function CustomFoodForm({
  initialName = '',
  onBack,
  onCreated,
}: {
  initialName?: string
  onBack: () => void
  onCreated: (f: Food) => void
}) {
  const addCustomFood = useAppStore((s) => s.addCustomFood)
  const [name, setName] = useState(initialName)
  const [emoji, setEmoji] = useState('🍽️')
  const [servingLabel, setServingLabel] = useState('1 phần')
  const [servingGrams, setServingGrams] = useState(100)
  const [n, setN] = useState<Nutrients>({ kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })
  const set = (k: keyof Nutrients) => (v: number) => setN((s) => ({ ...s, [k]: v }))
  const valid = name.trim() && servingGrams > 0 && n.kcal > 0

  const submit = () => {
    const r = 100 / servingGrams
    const food = addCustomFood({
      name: name.trim(),
      emoji,
      category: 'dish',
      per100: { kcal: n.kcal * r, protein: n.protein * r, carbs: n.carbs * r, fat: n.fat * r, fiber: n.fiber * r },
      servings: [{ label: servingLabel.trim() || '1 phần', grams: servingGrams }, ...(servingGrams !== 100 ? [{ label: '100g', grams: 100 }] : [])],
      defaultGrams: servingGrams,
      aliases: [],
    })
    onCreated(food)
  }

  return (
    <div className="space-y-4 px-4 pb-6 pt-1">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Quay lại">
          <ArrowLeft />
        </Button>
        <h2 className="text-base font-bold">Tạo món của tôi</h2>
      </div>
      <Input placeholder="Tên món (vd: Cơm gà nhà làm)" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <div className="scrollbar-none -mx-4 flex gap-1.5 overflow-x-auto px-4">
        {EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setEmoji(e)}
            aria-pressed={emoji === e}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition ${emoji === e ? 'bg-primary/15 ring-2 ring-primary' : 'bg-muted'}`}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Khẩu phần">
          <Input value={servingLabel} onChange={(e) => setServingLabel(e.target.value)} aria-label="Khẩu phần" />
        </Field>
        <Field label="Nặng (g)">
          <NumberField value={servingGrams} onChange={setServingGrams} step={10} min={1} ariaLabel="Gram mỗi phần" className="h-11" />
        </Field>
      </div>
      <p className="text-xs text-muted-foreground">Dinh dưỡng cho 1 khẩu phần ở trên:</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Kcal">
          <NumberField value={n.kcal} onChange={set('kcal')} step={10} ariaLabel="Kcal" className="h-11" />
        </Field>
        <Field label="Protein (g)">
          <NumberField value={n.protein} onChange={set('protein')} decimals={1} ariaLabel="Protein" className="h-11" />
        </Field>
        <Field label="Carbs (g)">
          <NumberField value={n.carbs} onChange={set('carbs')} decimals={1} ariaLabel="Carbs" className="h-11" />
        </Field>
        <Field label="Fat (g)">
          <NumberField value={n.fat} onChange={set('fat')} decimals={1} ariaLabel="Fat" className="h-11" />
        </Field>
        <Field label="Chất xơ (g)">
          <NumberField value={n.fiber} onChange={set('fiber')} decimals={1} ariaLabel="Chất xơ" className="h-11" />
        </Field>
      </div>
      <Button size="lg" className="w-full" disabled={!valid} onClick={submit}>
        Lưu món
      </Button>
    </div>
  )
}

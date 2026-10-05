import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Segmented } from '@/components/ui/segmented'
import { NumberField } from '@/components/NumberField'
import { MacroInline } from '@/components/MacroBar'
import { fmtKcal, multiplyNutrients, pickNutrients } from '@/lib/nutrition'
import { MEALS } from '@/store/derive'
import { useAppStore } from '@/store/useAppStore'
import { useUi } from '@/store/ui'
import type { FoodLog, MealType, Nutrients } from '@/types'

/** Sửa 1 dòng nhật ký: đổi gram (dinh dưỡng scale theo), đổi bữa, hoặc xoá (có hoàn tác). */
export function EditLogSheet() {
  const id = useUi((s) => s.editLogId)
  const editLog = useUi((s) => s.editLog)
  const log = useAppStore((s) => (id ? s.foodLogs[id] : undefined))
  // Giữ bản cuối để nội dung không biến mất khi sheet đang trượt xuống
  const [last, setLast] = useState<FoodLog | undefined>(log)
  if (log && log !== last) setLast(log)

  return (
    <Drawer open={!!id && !!log} onOpenChange={(o) => !o && editLog(null)}>
      <DrawerContent title="Sửa món">{last && <EditForm key={last.id} log={last} onDone={() => editLog(null)} />}</DrawerContent>
    </Drawer>
  )
}

function EditForm({ log, onDone }: { log: FoodLog; onDone: () => void }) {
  const update = useAppStore((s) => s.updateFoodLog)
  const remove = useAppStore((s) => s.removeFoodLog)
  const restore = useAppStore((s) => s.restoreFoodLog)
  const [meal, setMeal] = useState<MealType>(log.meal)
  const [grams, setGrams] = useState(log.grams)
  const byGram = log.grams > 0
  const [manual, setManual] = useState<Nutrients>(pickNutrients(log))

  const preview = byGram ? multiplyNutrients(pickNutrients(log), grams / log.grams) : manual

  const save = () => {
    update(log.id, { meal, grams: byGram ? grams : 0, servingLabel: byGram && grams !== log.grams ? null : log.servingLabel, ...preview })
    onDone()
  }

  const del = () => {
    remove(log.id)
    onDone()
    toast(`Đã xoá ${log.name}`, { action: { label: 'Hoàn tác', onClick: () => restore(log.id) } })
  }

  return (
    <div className="space-y-4 overflow-y-auto px-4 pb-6 pt-3">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-2xl" aria-hidden>
          {log.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold">{log.name}</h2>
          <MacroInline {...preview} />
        </div>
        <div className="text-right">
          <div className="num text-2xl font-extrabold">{fmtKcal(preview.kcal)}</div>
          <div className="text-xs text-muted-foreground">kcal</div>
        </div>
      </div>

      <Segmented<MealType>
        value={meal}
        onChange={setMeal}
        size="sm"
        options={MEALS.map((m) => ({ value: m.id, label: m.short }))}
      />

      {byGram ? (
        <NumberField value={grams} onChange={setGrams} step={10} min={1} max={5000} suffix="g" ariaLabel="Khối lượng" />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {(['kcal', 'protein', 'carbs', 'fat', 'fiber'] as const).map((k) => (
            <label key={k} className="space-y-1">
              <span className="text-xs font-semibold text-muted-foreground">{LABEL[k]}</span>
              <NumberField
                value={Math.round(manual[k] * 10) / 10}
                onChange={(v) => setManual((m) => ({ ...m, [k]: v }))}
                step={k === 'kcal' ? 10 : 1}
                decimals={k === 'kcal' ? 0 : 1}
                ariaLabel={LABEL[k]}
                className="h-11"
              />
            </label>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button variant="outline" size="lg" className="text-destructive" onClick={del} aria-label="Xoá món">
          <Trash2 />
        </Button>
        <Button size="lg" className="flex-1" onClick={save}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )
}

const LABEL = { kcal: 'Kcal', protein: 'Protein (g)', carbs: 'Carbs (g)', fat: 'Fat (g)', fiber: 'Chất xơ (g)' }

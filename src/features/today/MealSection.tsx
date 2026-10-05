import { AnimatePresence, motion } from 'motion/react'
import { Bookmark, Copy, MoreHorizontal, Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { MacroInline } from '@/components/MacroBar'
import { addDays } from '@/lib/date'
import { fmtG, fmtKcal, pickNutrients, sumNutrients } from '@/lib/nutrition'
import { cn } from '@/lib/utils'
import { MEALS, portionText } from '@/store/derive'
import { useAppStore } from '@/store/useAppStore'
import { useUi } from '@/store/ui'
import type { FoodLog, MealType } from '@/types'

export function MealSection({ meal, logs, date }: { meal: MealType; logs: FoodLog[]; date: string }) {
  const info = MEALS.find((m) => m.id === meal)!
  const openAdd = useUi((s) => s.openAdd)
  const editLog = useUi((s) => s.editLog)
  const copyDay = useAppStore((s) => s.copyDay)
  const saveMeal = useAppStore((s) => s.saveMeal)
  const [menu, setMenu] = useState(false)
  const total = sumNutrients(logs.map(pickNutrients))

  const copyYesterday = () => {
    setMenu(false)
    const n = copyDay(addDays(date, -1), date, meal)
    if (n) toast.success(`Đã chép ${n} món từ ${info.label.toLowerCase()} hôm trước`)
    else toast(`Hôm trước không có ${info.label.toLowerCase()}`)
  }

  const [naming, setNaming] = useState<string | null>(null)

  const saveCombo = (name: string) => {
    setNaming(null)
    saveMeal(
      name,
      logs.map((l) => ({
        ...pickNutrients(l),
        name: l.name,
        emoji: l.emoji,
        foodId: l.foodId,
        grams: l.grams,
        servingLabel: l.servingLabel,
      })),
    )
    toast.success(`Đã lưu "${name}"`, { description: 'Thêm lại cả bữa ở tab "Bữa mẫu" khi bấm +' })
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 px-4 pb-2 pt-3">
        <span className="text-lg" aria-hidden>
          {info.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-tight">{info.label}</h3>
          {logs.length > 0 && (
            <p className="num text-xs text-muted-foreground">
              <b className="text-foreground">{fmtKcal(total.kcal)}</b> kcal · <b className="text-protein">{fmtG(total.protein)}g</b>{' '}
              protein
            </p>
          )}
        </div>
        <div className="relative">
          <Button variant="ghost" size="icon-sm" aria-label="Tuỳ chọn bữa" onClick={() => setMenu((v) => !v)}>
            <MoreHorizontal />
          </Button>
          <AnimatePresence>
            {menu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-9 z-20 w-56 overflow-hidden rounded-xl border bg-popover p-1 shadow-lg"
                >
                  <MenuItem icon={<Copy />} onClick={copyYesterday}>
                    Chép từ hôm trước
                  </MenuItem>
                  <MenuItem
                    icon={<Bookmark />}
                    onClick={() => {
                      setMenu(false)
                      setNaming(`${info.short} ${date.slice(8)}/${date.slice(5, 7)}`)
                    }}
                    disabled={!logs.length}
                  >
                    Lưu thành bữa mẫu
                  </MenuItem>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <Button variant="soft" size="icon-sm" aria-label={`Thêm vào ${info.label}`} onClick={() => openAdd({ meal })}>
          <Plus />
        </Button>
      </div>

      {logs.length > 0 && (
        <ul className="divide-y border-t">
          <AnimatePresence initial={false}>
            {logs.map((l) => (
              <motion.li
                key={l.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  type="button"
                  onClick={() => editLog(l.id)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-lg" aria-hidden>
                    {l.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {l.name}
                      {l.source === 'ai' && (
                        <span className="ml-1.5 rounded bg-primary/10 px-1 py-px text-[10px] font-bold text-primary">AI</span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {portionText(l)}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="num block text-sm font-bold">{fmtKcal(l.kcal)}</span>
                    <MacroInline protein={l.protein} carbs={l.carbs} fat={l.fat} className="justify-end gap-x-1.5 text-[10px]" />
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <Drawer open={naming !== null} onOpenChange={(o) => !o && setNaming(null)}>
        <DrawerContent title="Lưu thành bữa mẫu">
          <form
            className="space-y-3 px-4 pb-6 pt-3"
            onSubmit={(e) => {
              e.preventDefault()
              if (naming?.trim()) saveCombo(naming.trim())
            }}
          >
            <h2 className="text-base font-bold">Lưu thành bữa mẫu</h2>
            <p className="text-sm text-muted-foreground">
              {logs.length} món · {fmtKcal(total.kcal)} kcal · {fmtG(total.protein)}g protein. Lần sau thêm cả bữa bằng 1 chạm.
            </p>
            <Input value={naming ?? ''} onChange={(e) => setNaming(e.target.value)} placeholder='VD: "Sáng trước gym"' autoFocus aria-label="Tên bữa mẫu" />
            <Button type="submit" size="lg" className="w-full" disabled={!naming?.trim()}>
              Lưu
            </Button>
          </form>
        </DrawerContent>
      </Drawer>
    </Card>
  )
}

function MenuItem({
  icon,
  children,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-muted-foreground',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

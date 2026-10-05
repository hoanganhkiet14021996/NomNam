import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Copy, Plus, Search, Sparkles, Trash2, X, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Segmented } from '@/components/ui/segmented'
import { MacroInline } from '@/components/MacroBar'
import { addDays } from '@/lib/date'
import { fmtG, fmtKcal, pickNutrients, scaleNutrients, sumNutrients } from '@/lib/nutrition'
import { searchFoods } from '@/lib/search'
import { cn } from '@/lib/utils'
import { MEALS, MEAL_LABEL, frequentItems, portionText, recentItems } from '@/store/derive'
import { useAllFoods } from '@/store/hooks'
import { useAppStore, type NewFoodLog } from '@/store/useAppStore'
import { useUi } from '@/store/ui'
import type { Food, FoodLog, MealType, Nutrients } from '@/types'
import { CustomFoodForm } from './CustomFoodForm'
import { PortionPicker, type PortionResult } from './PortionPicker'
import { QuickAdd } from './QuickAdd'

const AiLogView = lazy(() => import('@/features/ai/AiLogView').then((m) => ({ default: m.AiLogView })))

type ListTab ='recent' | 'frequent' | 'meals' | 'mine'
type Screen =
  | { kind: 'list' }
  | { kind: 'portion'; food: Food; initialGrams?: number }
  | { kind: 'custom'; name?: string }

export function AddSheet() {
  const open = useUi((s) => s.addOpen)
  const close = useUi((s) => s.closeAdd)
  return (
    <Drawer open={open} onOpenChange={(o) => !o && close()}>
      <DrawerContent title="Thêm món ăn" className="h-[92dvh]">
        {open && <AddSheetBody />}
      </DrawerContent>
    </Drawer>
  )
}

function AddSheetBody() {
  const date = useUi((s) => s.date)
  const meal = useUi((s) => s.addMeal)
  const setMeal = useUi((s) => s.setAddMeal)
  const view = useUi((s) => s.addView)
  const setView = useUi((s) => s.setAddView)
  const close = useUi((s) => s.closeAdd)
  const addFoodLogs = useAppStore((s) => s.addFoodLogs)
  const removeFoodLog = useAppStore((s) => s.removeFoodLog)
  const foodLogs = useAppStore((s) => s.foodLogs)

  const [screen, setScreen] = useState<Screen>({ kind: 'list' })
  const [added, setAdded] = useState<string[]>([])

  /** Ghi log + phản hồi ngay; sheet vẫn mở để thêm tiếp (multi-add). */
  const log = (items: Omit<NewFoodLog, 'date' | 'meal'>[]) => {
    const ids = addFoodLogs(items.map((it) => ({ ...it, date, meal })))
    setAdded((a) => [...a, ...ids])
    navigator.vibrate?.(10)
    const label = items.length === 1 ? items[0].name : `${items.length} món`
    toast.success(`Đã thêm ${label}`, {
      description: `${fmtKcal(sumNutrients(items.map(pickNutrients)).kcal)} kcal · ${MEAL_LABEL[meal]}`,
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          ids.forEach(removeFoodLog)
          setAdded((a) => a.filter((x) => !ids.includes(x)))
        },
      },
    })
    setScreen({ kind: 'list' })
  }

  const addedTotal = useMemo(
    () => sumNutrients(added.map((id) => foodLogs[id]).filter((l) => l && !l.deletedAt).map(pickNutrients)),
    [added, foodLogs],
  )
  const addedCount = added.filter((id) => foodLogs[id] && !foodLogs[id].deletedAt).length

  const back = () => {
    setScreen({ kind: 'list' })
    setView('search')
  }

  let body: React.ReactNode
  if (view === 'quick') {
    body = (
      <QuickAdd
        meal={meal}
        onBack={back}
        onAdd={(name, n) => {
          log([{ ...n, name, emoji: '⚡', foodId: null, grams: 0, servingLabel: null, source: 'quick' }])
          setView('search')
        }}
      />
    )
  } else if (view === 'ai') {
    body = (
      <Suspense fallback={<div className="mx-4 h-40 animate-pulse rounded-2xl bg-muted" />}>
        <AiLogView
          meal={meal}
          onBack={back}
          onConfirm={(items) => {
            log(items.map((it) => ({ ...it, foodId: null, servingLabel: null, source: 'ai' as const })))
            setView('search')
          }}
        />
      </Suspense>
    )
  } else if (screen.kind === 'portion') {
    body = (
      <PortionPicker
        food={screen.food}
        meal={meal}
        initialGrams={screen.initialGrams}
        onBack={() => setScreen({ kind: 'list' })}
        onAdd={(r) => log([foodToLog(screen.food, r)])}
      />
    )
  } else if (screen.kind === 'custom') {
    body = (
      <CustomFoodForm
        initialName={screen.name}
        onBack={() => setScreen({ kind: 'list' })}
        onCreated={(food) => {
          toast.success(`Đã lưu món "${food.name}"`)
          setScreen({ kind: 'portion', food })
        }}
      />
    )
  } else {
    body = <ListScreen meal={meal} date={date} onPick={(food, initialGrams) => setScreen({ kind: 'portion', food, initialGrams })} onLog={log} onCustom={(name) => setScreen({ kind: 'custom', name })} />
  }

  return (
    <>
      <div className="flex items-center gap-2 px-4 pb-2 pt-2">
        <Segmented<MealType>
          value={meal}
          onChange={setMeal}
          size="sm"
          className="flex-1"
          options={MEALS.map((m) => ({ value: m.id, label: m.short }))}
        />
        <Button variant="ghost" size="icon-sm" onClick={close} aria-label="Đóng">
          <X />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={view + screen.kind} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            {body}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {addedCount > 0 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="flex items-center gap-3 border-t bg-card px-4 py-3 pb-safe"
          >
            <div className="flex-1">
              <p className="num text-sm font-bold">
                Đã thêm {addedCount} món · {fmtKcal(addedTotal.kcal)} kcal
              </p>
              <MacroInline {...addedTotal} />
            </div>
            <Button onClick={close}>Xong</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ListScreen({
  meal,
  date,
  onPick,
  onLog,
  onCustom,
}: {
  meal: MealType
  date: string
  onPick: (food: Food, initialGrams?: number) => void
  onLog: (items: Omit<NewFoodLog, 'date' | 'meal'>[]) => void
  onCustom: (name?: string) => void
}) {
  const setView = useUi((s) => s.setAddView)
  const foods = useAllFoods()
  const foodLogs = useAppStore((s) => s.foodLogs)
  const savedMeals = useAppStore((s) => s.savedMeals)
  const customFoods = useAppStore((s) => s.customFoods)
  const removeSavedMeal = useAppStore((s) => s.removeSavedMeal)
  const restoreSavedMeal = useAppStore((s) => s.restoreSavedMeal)
  const removeCustomFood = useAppStore((s) => s.removeCustomFood)
  const restoreCustomFood = useAppStore((s) => s.restoreCustomFood)
  const copyDay = useAppStore((s) => s.copyDay)
  const [q, setQ] = useState('')
  const recents = useMemo(() => recentItems(foodLogs), [foodLogs])
  const frequent = useMemo(() => frequentItems(foodLogs, date, meal), [foodLogs, date, meal])
  const [tab, setTab] = useState<ListTab>(() => (Object.keys(foodLogs).length ? 'recent' : 'frequent'))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Chỉ tự focus trên máy có chuột (trên điện thoại bàn phím bật lên sẽ che danh sách)
    if (matchMedia('(pointer: fine)').matches) inputRef.current?.focus()
  }, [])

  const results = useMemo(() => searchFoods(q, foods), [q, foods])
  const foodById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods])

  /** Món gần đây → mở chọn khẩu phần (nếu là món DB) hoặc thêm lại y hệt. */
  const reLog = (l: FoodLog, instant: boolean) => {
    const food = l.foodId ? foodById.get(l.foodId) : undefined
    if (food && !instant) return onPick(food, l.grams || undefined)
    onLog([{ ...pickNutrients(l), name: l.name, emoji: l.emoji, foodId: l.foodId, grams: l.grams, servingLabel: l.servingLabel, source: l.source }])
  }

  const meals = Object.values(savedMeals).filter((m) => !m.deletedAt)
  const mine = Object.values(customFoods).filter((f) => !f.deletedAt)
  const popular = useMemo(() => POPULAR.map((id) => foodById.get(id)).filter((f): f is Food => !!f), [foodById])

  return (
    <div className="space-y-3 pb-6">
      <div className="sticky top-0 z-10 space-y-3 bg-background px-4 pb-2 pt-1">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm món: uc ga, pho, trung…"
            aria-label="Tìm món ăn"
            enterKeyHint="search"
            className="h-12 w-full rounded-2xl border bg-card pl-10 pr-10 text-base outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
          />
          {q && (
            <button type="button" onClick={() => setQ('')} aria-label="Xoá tìm kiếm" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {!q && (
          <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4">
            <ActionChip icon={<Sparkles />} onClick={() => setView('ai')} highlight>
              AI: ảnh / mô tả
            </ActionChip>
            <ActionChip icon={<Zap />} onClick={() => setView('quick')}>
              Nhập nhanh
            </ActionChip>
            <ActionChip
              icon={<Copy />}
              onClick={() => {
                const n = copyDay(addDays(date, -1), date, meal)
                if (n) toast.success(`Đã chép ${n} món từ ${MEAL_LABEL[meal].toLowerCase()} hôm trước`)
                else toast(`Hôm trước không có ${MEAL_LABEL[meal].toLowerCase()}`)
              }}
            >
              Chép hôm trước
            </ActionChip>
            <ActionChip icon={<Plus />} onClick={() => onCustom()}>
              Tạo món
            </ActionChip>
          </div>
        )}
      </div>

      {q ? (
        <div className="px-4">
          {results.length > 0 ? (
            <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
              {results.map((f) => (
                <FoodRow key={f.id} food={f} onClick={() => onPick(f)} onQuick={() => onLog([foodToLog(f, defaultPortion(f))])} />
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">Không tìm thấy "{q}"</p>
          )}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => onCustom(q)}>
              <Plus /> Tạo "{q.length > 12 ? q.slice(0, 12) + '…' : q}"
            </Button>
            <Button variant="soft" onClick={() => setView('ai')}>
              <Sparkles /> Hỏi AI
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          <Segmented<ListTab>
            value={tab}
            onChange={setTab}
            size="sm"
            options={[
              { value: 'recent', label: 'Gần đây' },
              { value: 'frequent', label: 'Hay ăn' },
              { value: 'meals', label: `Bữa mẫu${meals.length ? ` (${meals.length})` : ''}` },
              { value: 'mine', label: 'Của tôi' },
            ]}
          />

          {tab === 'recent' &&
            (recents.length ? (
              <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
                {recents.map((l) => (
                  <LogRow key={l.id} log={l} onClick={() => reLog(l, false)} onQuick={() => reLog(l, true)} />
                ))}
              </ul>
            ) : (
              <Empty text="Món bạn đã ăn sẽ hiện ở đây để thêm lại bằng 1 chạm." />
            ))}

          {tab === 'frequent' &&
            (frequent.length ? (
              <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
                {frequent.map((l) => (
                  <LogRow key={l.id} log={l} onClick={() => reLog(l, false)} onQuick={() => reLog(l, true)} />
                ))}
              </ul>
            ) : (
              <>
                <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Món phổ biến</p>
                <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
                  {popular.map((f) => (
                    <FoodRow key={f.id} food={f} onClick={() => onPick(f)} onQuick={() => onLog([foodToLog(f, defaultPortion(f))])} />
                  ))}
                </ul>
              </>
            ))}

          {tab === 'meals' &&
            (meals.length ? (
              <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
                {meals.map((m) => {
                  const t = sumNutrients(m.items.map(pickNutrients))
                  return (
                    <li key={m.id} className="flex items-center gap-3 px-3 py-2.5">
                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() =>
                          onLog(m.items.map((it) => ({ ...it, source: 'meal' as const })))
                        }
                      >
                        <span className="block truncate text-sm font-semibold">{m.name}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {m.items.map((i) => i.name).join(', ')}
                        </span>
                        <span className="num text-xs">
                          <b>{fmtKcal(t.kcal)}</b> kcal · <b className="text-protein">{fmtG(t.protein)}g</b> P
                        </span>
                      </button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Xoá bữa mẫu ${m.name}`}
                        onClick={() => {
                          removeSavedMeal(m.id)
                          toast(`Đã xoá bữa mẫu "${m.name}"`, { action: { label: 'Hoàn tác', onClick: () => restoreSavedMeal(m.id) } })
                        }}
                      >
                        <Trash2 className="text-muted-foreground" />
                      </Button>
                      <QuickBtn label={`Thêm ${m.name}`} onClick={() => onLog(m.items.map((it) => ({ ...it, source: 'meal' as const })))} />
                    </li>
                  )
                })}
              </ul>
            ) : (
              <Empty text='Ăn xong một bữa hay lặp lại? Ở màn Hôm nay bấm "⋯" trên bữa đó → "Lưu thành bữa mẫu", lần sau thêm cả bữa bằng 1 chạm.' />
            ))}

          {tab === 'mine' && (
            <>
              {mine.length > 0 && (
                <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
                  {mine.map((f) => (
                    <FoodRow
                      key={f.id}
                      food={f}
                      onClick={() => onPick(f)}
                      onQuick={() => onLog([foodToLog(f, defaultPortion(f))])}
                      onDelete={() => {
                        removeCustomFood(f.id)
                        toast(`Đã xoá "${f.name}"`, { action: { label: 'Hoàn tác', onClick: () => restoreCustomFood(f.id) } })
                      }}
                    />
                  ))}
                </ul>
              )}
              <Button variant="outline" className="w-full" onClick={() => onCustom()}>
                <Plus /> Tạo món mới
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const POPULAR = ['com-trang', 'uc-ga-chin', 'trung-ga', 'whey', 'pho-bo', 'banh-mi-thit', 'bo-nac-song', 'chuoi', 'sua-tuoi-kd', 'khoai-lang', 'com-tam-suon', 'yen-mach']

function defaultPortion(f: Food): PortionResult {
  const s = f.servings.find((x) => x.grams === f.defaultGrams)
  return { ...scaleNutrients(f.per100, f.defaultGrams), grams: f.defaultGrams, servingLabel: s?.label ?? null }
}

function foodToLog(f: Food, r: PortionResult): Omit<NewFoodLog, 'date' | 'meal'> {
  const n: Nutrients = pickNutrients(r)
  return { ...n, name: f.name, emoji: f.emoji, foodId: f.id, grams: r.grams, servingLabel: r.servingLabel, source: f.custom ? 'custom' : 'db' }
}

function FoodRow({ food, onClick, onQuick, onDelete }: { food: Food; onClick: () => void; onQuick: () => void; onDelete?: () => void }) {
  const p = defaultPortion(food)
  return (
    <li className="flex items-center gap-3 px-3 py-2">
      <button type="button" onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl" aria-hidden>
          {food.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{food.name}</span>
          <span className="num block truncate text-xs text-muted-foreground">
            {p.servingLabel && !/^\d+g$/.test(p.servingLabel) ? `${p.servingLabel} (${p.grams}g)` : `${p.grams}g`} · {fmtKcal(p.kcal)} kcal ·{' '}
            <span className="text-protein">P {fmtG(p.protein)}g</span>
          </span>
        </span>
      </button>
      {onDelete && (
        <Button variant="ghost" size="icon-sm" aria-label={`Xoá ${food.name}`} onClick={onDelete}>
          <Trash2 className="text-muted-foreground" />
        </Button>
      )}
      <QuickBtn label={`Thêm nhanh ${food.name}`} onClick={onQuick} />
    </li>
  )
}

function LogRow({ log, onClick, onQuick }: { log: FoodLog; onClick: () => void; onQuick: () => void }) {
  return (
    <li className="flex items-center gap-3 px-3 py-2">
      <button type="button" onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl" aria-hidden>
          {log.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{log.name}</span>
          <span className="num block truncate text-xs text-muted-foreground">
            {portionText(log)} · {fmtKcal(log.kcal)} kcal · <span className="text-protein">P {fmtG(log.protein)}g</span>
          </span>
        </span>
      </button>
      <QuickBtn label={`Thêm lại ${log.name}`} onClick={onQuick} />
    </li>
  )
}

function QuickBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <Plus className="h-5 w-5" strokeWidth={2.5} />
    </motion.button>
  )
}

function ActionChip({
  icon,
  children,
  onClick,
  highlight,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  onClick: () => void
  highlight?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors active:scale-95 [&_svg]:h-4 [&_svg]:w-4',
        highlight ? 'border-primary/30 bg-primary/10 text-primary' : 'bg-card hover:bg-accent',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">{text}</p>
}

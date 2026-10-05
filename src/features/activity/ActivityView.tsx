import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Flame, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { DayNav } from '@/components/DayNav'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { Switch } from '@/components/ui/switch'
import { NumberField } from '@/components/NumberField'
import { AnimatedNumber } from '@/components/AnimatedNumber'
import { ACTIVITIES, INTENSITY_LABEL, OTHER_ACTIVITY, type ActivityPreset } from '@/data/activities'
import { activityKcal } from '@/lib/met'
import { fmtKcal } from '@/lib/nutrition'
import { useDay } from '@/store/hooks'
import { useAppStore } from '@/store/useAppStore'
import { useUi } from '@/store/ui'
import type { Intensity } from '@/types'
import { Chip } from '@/features/add/PortionPicker'

type Picked = ActivityPreset | typeof OTHER_ACTIVITY

export function ActivityView() {
  const date = useUi((s) => s.date)
  const day = useDay(date)
  const profile = useAppStore((s) => s.profile)
  const removeActivity = useAppStore((s) => s.removeActivity)
  const restoreActivity = useAppStore((s) => s.restoreActivity)
  const [picked, setPicked] = useState<Picked | null>(null)
  const bonus = day.budget - day.targets.kcal

  return (
    <div className="space-y-4">
      <PageHeader title="Vận động" subtitle="Calo đốt thêm" right={<DayNav />} />
      <div className="space-y-4 px-4">
        <Card className="flex items-center gap-4 p-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-protein/10 text-protein">
            <Flame className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Đã đốt</p>
            <p className="num text-3xl font-extrabold tracking-tight">
              <AnimatedNumber value={day.exerciseKcal} /> <span className="text-sm font-semibold text-muted-foreground">kcal</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Được ăn thêm</p>
            <p className="num text-lg font-bold text-primary">+{fmtKcal(bonus)}</p>
            <p className="text-[11px] text-muted-foreground">({profile.exerciseEatBackPct}% calo tập)</p>
          </div>
        </Card>

        <div>
          <h2 className="mb-2 px-1 text-sm font-bold">Thêm hoạt động</h2>
          <div className="grid grid-cols-3 gap-2">
            {[...ACTIVITIES, OTHER_ACTIVITY].map((a) => (
              <motion.button
                key={a.id}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => setPicked(a)}
                className="flex flex-col items-center gap-1 rounded-2xl border bg-card px-2 py-3 shadow-soft transition-colors hover:border-primary/40"
              >
                <span className="text-2xl" aria-hidden>
                  {a.emoji}
                </span>
                <span className="text-center text-xs font-semibold leading-tight">{a.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {day.activities.length > 0 && (
          <div>
            <h2 className="mb-2 px-1 text-sm font-bold">Đã ghi</h2>
            <Card className="overflow-hidden">
              <ul className="divide-y">
                <AnimatePresence initial={false}>
                  {day.activities.map((a) => (
                    <motion.li
                      key={a.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span className="text-xl" aria-hidden>
                        {a.emoji}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{a.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.minutes > 0 && `${a.minutes} phút · `}
                          {a.manual ? 'tự nhập' : `${INTENSITY_LABEL[a.intensity]} · MET ${a.met}`}
                        </p>
                      </div>
                      <span className="num text-sm font-bold">{fmtKcal(a.kcal)} kcal</span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Xoá ${a.name}`}
                        onClick={() => {
                          removeActivity(a.id)
                          toast(`Đã xoá ${a.name}`, { action: { label: 'Hoàn tác', onClick: () => restoreActivity(a.id) } })
                        }}
                      >
                        <Trash2 className="text-muted-foreground" />
                      </Button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </Card>
          </div>
        )}

        <p className="px-1 text-xs leading-relaxed text-muted-foreground">
          Calo = (MET − 1) × {profile.weightKg} kg × giờ, theo Compendium of Physical Activities. Trừ 1 MET vì phần nghỉ ngơi đã có trong
          mục tiêu. Chỉ {profile.exerciseEatBackPct}% được cộng lại vào quỹ ăn để bù sai số ước lượng (chỉnh ở tab Mục tiêu).
        </p>
      </div>

      <Drawer open={!!picked} onOpenChange={(o) => !o && setPicked(null)}>
        <DrawerContent title="Thêm hoạt động">{picked && <ActivityForm key={picked.id} preset={picked} onDone={() => setPicked(null)} />}</DrawerContent>
      </Drawer>
    </div>
  )
}

const DURATIONS = [30, 45, 60, 90, 120]

function ActivityForm({ preset, onDone }: { preset: Picked; onDone: () => void }) {
  const date = useUi((s) => s.date)
  const weightKg = useAppStore((s) => s.profile.weightKg)
  const addActivity = useAppStore((s) => s.addActivity)
  const isOther = !('met' in preset)
  const [intensity, setIntensity] = useState<Intensity>('moderate')
  const [minutes, setMinutes] = useState(60)
  const [manual, setManual] = useState(isOther)
  const [manualKcal, setManualKcal] = useState(300)
  const [name, setName] = useState(isOther ? '' : preset.name)

  const met = isOther ? 0 : preset.met[intensity]
  const kcal = manual ? manualKcal : activityKcal(met, weightKg, minutes)

  const save = () => {
    addActivity({
      date,
      activityId: preset.id,
      name: name.trim() || preset.name,
      emoji: preset.emoji,
      minutes,
      intensity,
      met: manual ? 0 : met,
      kcal,
      manual,
    })
    toast.success(`Đã thêm ${name.trim() || preset.name} · ${fmtKcal(kcal)} kcal`)
    onDone()
  }

  return (
    <div className="space-y-4 overflow-y-auto px-4 pb-6 pt-3">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-2xl" aria-hidden>
          {preset.emoji}
        </span>
        <div className="flex-1">
          {isOther ? (
            <Input placeholder="Tên hoạt động" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          ) : (
            <h2 className="text-lg font-bold">{preset.name}</h2>
          )}
        </div>
        <div className="text-right">
          <div className="num text-3xl font-extrabold text-protein">
            <AnimatedNumber value={kcal} />
          </div>
          <div className="text-xs text-muted-foreground">kcal</div>
        </div>
      </div>

      {!isOther && !manual && (
        <div className="space-y-2">
          <Segmented<Intensity>
            value={intensity}
            onChange={setIntensity}
            options={(['light', 'moderate', 'vigorous'] as const).map((i) => ({ value: i, label: INTENSITY_LABEL[i] }))}
          />
          <p className="text-center text-xs text-muted-foreground">
            {preset.hint[intensity]} · MET {met}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-semibold">Thời gian</p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <Chip key={d} active={minutes === d} onClick={() => setMinutes(d)}>
              {d >= 60 ? `${d / 60}${d % 60 ? '.5' : ''} giờ` : `${d} phút`}
            </Chip>
          ))}
        </div>
        <NumberField value={minutes} onChange={setMinutes} step={5} min={1} max={600} suffix="phút" ariaLabel="Số phút" />
      </div>

      {!isOther && (
        <label className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
          <span className="text-sm">
            <span className="font-semibold">Tự nhập kcal</span>
            <span className="block text-xs text-muted-foreground">Dùng số từ đồng hồ / máy tập</span>
          </span>
          <Switch checked={manual} onCheckedChange={setManual} />
        </label>
      )}
      {manual && <NumberField value={manualKcal} onChange={setManualKcal} step={10} min={0} max={5000} suffix="kcal" ariaLabel="Kcal" />}

      <Button size="lg" className="w-full" onClick={save} disabled={kcal <= 0 || (isOther && !name.trim())}>
        Lưu hoạt động
      </Button>
    </div>
  )
}

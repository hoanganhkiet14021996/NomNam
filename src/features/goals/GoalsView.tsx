import { useRef, useState } from 'react'
import { Download, Eye, EyeOff, Monitor, Moon, RotateCcw, Sun, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { Switch } from '@/components/ui/switch'
import { NumberField } from '@/components/NumberField'
import { exportFoodCSV, exportJSON, importJSON } from '@/lib/export'
import { calcAutoTargets, calcBMR, calcBaseTDEE, fmtKcal, GOAL_FACTOR, GOAL_LABEL } from '@/lib/nutrition'
import { DEFAULT_GEMINI_MODEL, useSettings } from '@/store/settings'
import { useTargets } from '@/store/hooks'
import { useAppStore } from '@/store/useAppStore'
import type { ThemePref } from '@/types'
import { AccountCard } from './AccountCard'
import { ProfileForm } from './ProfileForm'

export function GoalsView() {
  const profile = useAppStore((s) => s.profile)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const targets = useTargets()
  const auto = calcAutoTargets(profile)
  const overridden = Object.keys(profile.overrides ?? {}).length > 0

  return (
    <div className="space-y-4">
      <PageHeader title="Mục tiêu" subtitle="Hồ sơ & cài đặt" />
      <div className="space-y-4 px-4">
        {/* Mục tiêu hằng ngày */}
        <Card className="overflow-hidden">
          <div className="bg-primary px-4 py-4 text-primary-foreground">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Mục tiêu mỗi ngày · {GOAL_LABEL[profile.goal]}</p>
            <p className="num text-4xl font-extrabold tracking-tight">
              {fmtKcal(targets.kcal)} <span className="text-base font-semibold opacity-80">kcal</span>
            </p>
            <div className="num mt-3 grid grid-cols-4 gap-2 text-center">
              {(
                [
                  ['Protein', targets.protein],
                  ['Carbs', targets.carbs],
                  ['Fat', targets.fat],
                  ['Xơ', targets.fiber],
                ] as const
              ).map(([l, v]) => (
                <div key={l} className="rounded-xl bg-white/15 py-1.5">
                  <p className="text-[10px] font-semibold uppercase opacity-80">{l}</p>
                  <p className="text-base font-bold">{v}g</p>
                </div>
              ))}
            </div>
          </div>
          <dl className="num space-y-1 px-4 py-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <dt>BMR (Mifflin-St Jeor)</dt>
              <dd>{fmtKcal(calcBMR(profile))} kcal</dd>
            </div>
            <div className="flex justify-between">
              <dt>TDEE nền (× {profile.neat}, chưa gồm tập)</dt>
              <dd>{fmtKcal(calcBaseTDEE(profile))} kcal</dd>
            </div>
            <div className="flex justify-between">
              <dt>
                {GOAL_LABEL[profile.goal]} (× {GOAL_FACTOR[profile.goal]})
              </dt>
              <dd>{fmtKcal(auto.kcal)} kcal</dd>
            </div>
            <div className="flex justify-between">
              <dt>Fat 25% kcal · Xơ 14g/1000 kcal · Carbs phần còn lại</dt>
            </div>
          </dl>
          <OverrideEditor />
          {overridden && (
            <p className="border-t px-4 py-2 text-xs text-warning">Đang dùng mục tiêu tự đặt (gợi ý tự tính: {fmtKcal(auto.kcal)} kcal, {auto.protein}g protein).</p>
          )}
        </Card>

        <Section title="Hồ sơ">
          <Card className="p-4">
            <ProfileForm value={profile} onChange={updateProfile} />
          </Card>
        </Section>

        <Section title="Calo tập được ăn lại">
          <Card className="space-y-2 p-4">
            <Segmented
              value={String(profile.exerciseEatBackPct)}
              onChange={(v) => updateProfile({ exerciseEatBackPct: Number(v) })}
              options={['0', '25', '50', '75', '100'].map((v) => ({ value: v, label: `${v}%` }))}
            />
            <p className="text-xs text-muted-foreground">
              Đốt 400 kcal khi tập → được ăn thêm {Math.round(400 * (profile.exerciseEatBackPct / 100))} kcal. 50% là mức an toàn vì máy đo/công
              thức thường ước lượng cao.
            </p>
          </Card>
        </Section>

        <Section title="Tài khoản & đồng bộ">
          <AccountCard />
        </Section>

        <Section title="AI (Gemini)">
          <GeminiSettings />
        </Section>

        <Section title="Giao diện">
          <ThemeSettings />
        </Section>

        <Section title="Dữ liệu">
          <DataSettings />
        </Section>

        <p className="pb-4 text-center text-xs text-muted-foreground">NomNam v0.2 · Dữ liệu dinh dưỡng mang tính tham khảo</p>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-sm font-bold">{title}</h2>
      {children}
    </section>
  )
}

function OverrideEditor() {
  const profile = useAppStore((s) => s.profile)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const targets = useTargets()
  const [open, setOpen] = useState(Object.keys(profile.overrides ?? {}).length > 0)
  const set = (k: 'kcal' | 'protein' | 'fat' | 'fiber') => (v: number) => updateProfile({ overrides: { ...profile.overrides, [k]: v } })

  return (
    <div className="border-t px-4 py-3">
      <label className="flex items-center justify-between gap-3">
        <span className="text-sm">
          <span className="font-semibold">Tự đặt mục tiêu</span>
          <span className="block text-xs text-muted-foreground">Ví dụ theo chỉ định của PT / coach</span>
        </span>
        <Switch
          checked={open}
          onCheckedChange={(v) => {
            setOpen(v)
            if (!v) updateProfile({ overrides: {} })
          }}
        />
      </label>
      {open && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ['kcal', 'Kcal', 50],
                ['protein', 'Protein (g)', 5],
                ['fat', 'Fat (g)', 5],
                ['fiber', 'Xơ (g)', 1],
              ] as const
            ).map(([k, label, step]) => (
              <label key={k} className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                <NumberField value={targets[k]} onChange={set(k)} step={step} ariaLabel={label} className="h-11" />
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Carbs tự tính từ phần calo còn lại ({targets.carbs}g).</p>
          <Button variant="ghost" size="sm" onClick={() => updateProfile({ overrides: {} })}>
            <RotateCcw /> Về số tự tính
          </Button>
        </div>
      )}
    </div>
  )
}

function GeminiSettings() {
  const { geminiKey, geminiModel, setGemini } = useSettings()
  const [key, setKey] = useState(geminiKey)
  const [model, setModel] = useState(geminiModel)
  const [show, setShow] = useState(false)
  const dirty = key !== geminiKey || model !== geminiModel
  return (
    <Card className="space-y-3 p-4">
      <p className="text-sm text-muted-foreground">
        Dùng cho "Ghi bằng AI" (ảnh / mô tả). Lấy key miễn phí tại{' '}
        <a className="font-semibold text-primary underline" href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
          aistudio.google.com/apikey
        </a>
        . Key chỉ lưu trên thiết bị này.
      </p>
      <div className="relative">
        <Input type={show ? 'text' : 'password'} placeholder="Gemini API key (AIza…)" value={key} onChange={(e) => setKey(e.target.value)} className="pr-11" />
        <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Ẩn key' : 'Hiện key'} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <Input placeholder={DEFAULT_GEMINI_MODEL} value={model} onChange={(e) => setModel(e.target.value)} aria-label="Tên model" />
      <Button
        className="w-full"
        disabled={!dirty}
        onClick={() => {
          setGemini(key, model || DEFAULT_GEMINI_MODEL)
          toast.success('Đã lưu cài đặt AI')
        }}
      >
        Lưu
      </Button>
    </Card>
  )
}

function ThemeSettings() {
  const theme = useSettings((s) => s.theme)
  const setTheme = useSettings((s) => s.setTheme)
  return (
    <Card className="p-4">
      <Segmented<ThemePref>
        value={theme}
        onChange={setTheme}
        options={[
          { value: 'light', label: <span className="flex items-center justify-center gap-1.5"><Sun className="h-4 w-4" /> Sáng</span> },
          { value: 'dark', label: <span className="flex items-center justify-center gap-1.5"><Moon className="h-4 w-4" /> Tối</span> },
          { value: 'system', label: <span className="flex items-center justify-center gap-1.5"><Monitor className="h-4 w-4" /> Tự động</span> },
        ]}
      />
    </Card>
  )
}

function DataSettings() {
  const fileRef = useRef<HTMLInputElement>(null)
  return (
    <Card className="grid grid-cols-2 gap-2 p-4">
      <Button variant="outline" onClick={exportFoodCSV}>
        <Download /> Xuất CSV
      </Button>
      <Button variant="outline" onClick={exportJSON}>
        <Download /> Sao lưu JSON
      </Button>
      <Button variant="ghost" className="col-span-2" onClick={() => fileRef.current?.click()}>
        <Upload /> Khôi phục từ file sao lưu
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={async (e) => {
          const f = e.target.files?.[0]
          e.target.value = ''
          if (!f) return
          try {
            const n = await importJSON(f)
            toast.success(`Đã khôi phục ${n} bản ghi`)
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'File không hợp lệ')
          }
        }}
      />
    </Card>
  )
}

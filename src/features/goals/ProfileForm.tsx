import { NumberField } from '@/components/NumberField'
import { Segmented } from '@/components/ui/segmented'
import { DEFAULT_PROTEIN_PER_KG, GOAL_LABEL, NEAT_LEVELS } from '@/lib/nutrition'
import { cn } from '@/lib/utils'
import type { Goal, Profile, Sex } from '@/types'

const GOAL_HINT: Record<Goal, string> = {
  cut: 'Ăn ~82% TDEE, protein cao để giữ cơ',
  maintain: 'Ăn bằng TDEE (recomp)',
  bulk: 'Lean bulk: ăn ~110% TDEE, tăng 0,25–0,5 kg/tuần',
}

/** Form hồ sơ dùng chung cho onboarding và tab Mục tiêu. */
export function ProfileForm({ value, onChange }: { value: Profile; onChange: (patch: Partial<Profile>) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Mục tiêu</Label>
        <Segmented<Goal>
          value={value.goal}
          onChange={(goal) => onChange({ goal, proteinPerKg: DEFAULT_PROTEIN_PER_KG[goal] })}
          options={(['cut', 'maintain', 'bulk'] as const).map((g) => ({ value: g, label: GOAL_LABEL[g] }))}
        />
        <p className="text-xs text-muted-foreground">{GOAL_HINT[value.goal]}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Giới tính</Label>
          <Segmented<Sex>
            value={value.sex}
            onChange={(sex) => onChange({ sex })}
            options={[
              { value: 'male', label: 'Nam' },
              { value: 'female', label: 'Nữ' },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Tuổi</Label>
          <NumberField value={value.age} onChange={(age) => onChange({ age })} min={12} max={90} ariaLabel="Tuổi" className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label>Chiều cao</Label>
          <NumberField value={value.heightCm} onChange={(heightCm) => onChange({ heightCm })} min={120} max={230} suffix="cm" ariaLabel="Chiều cao" className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label>Cân nặng</Label>
          <NumberField
            value={value.weightKg}
            onChange={(weightKg) => onChange({ weightKg })}
            step={0.5}
            decimals={1}
            min={30}
            max={250}
            suffix="kg"
            ariaLabel="Cân nặng"
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Mức đi lại hằng ngày (không tính buổi tập)</Label>
        <div className="grid gap-2">
          {NEAT_LEVELS.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => onChange({ neat: l.value })}
              aria-pressed={value.neat === l.value}
              className={cn(
                'flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors',
                value.neat === l.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card hover:bg-accent',
              )}
            >
              <span>
                <span className="block text-sm font-semibold">{l.label}</span>
                <span className="block text-xs text-muted-foreground">{l.hint}</span>
              </span>
              <span className="num text-xs text-muted-foreground">×{l.value}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Buổi tập (gym, đá banh…) ghi ở tab Vận động để không bị tính 2 lần.</p>
      </div>

      <div className="space-y-1.5">
        <Label>Protein mỗi kg cân nặng</Label>
        <NumberField
          value={value.proteinPerKg}
          onChange={(proteinPerKg) => onChange({ proteinPerKg })}
          step={0.1}
          decimals={1}
          min={1.2}
          max={3.3}
          suffix="g/kg"
          ariaLabel="Protein mỗi kg"
          className="h-11"
        />
        <p className="text-xs text-muted-foreground">
          = {Math.round(value.proteinPerKg * value.weightKg)}g/ngày. Người tập tạ: 1,6–2,2 g/kg.
        </p>
      </div>
    </div>
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold">{children}</p>
}

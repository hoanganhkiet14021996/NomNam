import { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DEFAULT_PROFILE } from '@/data/defaults'
import { calcTargets, fmtKcal } from '@/lib/nutrition'
import { supabase } from '@/lib/supabase'
import { useAppStore } from '@/store/useAppStore'
import type { Profile } from '@/types'
import { LoginForm } from '@/features/goals/AccountCard'
import { ProfileForm } from '@/features/goals/ProfileForm'

export function Onboarding() {
  const updateProfile = useAppStore((s) => s.updateProfile)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const [p, setP] = useState<Profile>(DEFAULT_PROFILE)
  const [login, setLogin] = useState(false)
  const t = calcTargets(p)

  return (
    <div className="mx-auto min-h-dvh max-w-lg space-y-5 px-4 pb-10 pt-[max(env(safe-area-inset-top),2rem)]">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <img src={`${import.meta.env.BASE_URL}brand/logo.svg`} alt="Logo NomNam" width={64} height={64} className="h-16 w-16 rounded-2xl shadow-lg shadow-primary/30" />
        <h1 className="text-3xl font-extrabold tracking-tight">NomNam</h1>
        <p className="text-muted-foreground">Log bữa ăn trong vài giây, bám sát calo & protein mỗi ngày để đạt mục tiêu fitness.</p>
      </motion.div>

      {supabase && (
        <Card className="p-4">
          {login ? (
            <LoginForm compact />
          ) : (
            <button type="button" className="w-full text-left text-sm" onClick={() => setLogin(true)}>
              Đã dùng trên máy khác? <span className="font-semibold text-primary underline">Đăng nhập để tải dữ liệu</span>
            </button>
          )}
        </Card>
      )}

      <Card className="p-4">
        <h2 className="mb-3 font-bold">Thông tin của bạn</h2>
        <ProfileForm value={p} onChange={(patch) => setP((s) => ({ ...s, ...patch }))} />
      </Card>

      <Card className="sticky bottom-4 space-y-3 p-4 shadow-lg">
        <div className="num flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mục tiêu mỗi ngày</p>
            <p className="text-3xl font-extrabold tracking-tight">
              {fmtKcal(t.kcal)} <span className="text-sm font-semibold text-muted-foreground">kcal</span>
            </p>
          </div>
          <div className="text-right text-sm">
            <p>
              <b className="text-protein">{t.protein}g</b> protein
            </p>
            <p className="text-xs text-muted-foreground">
              C {t.carbs}g · F {t.fat}g · Xơ {t.fiber}g
            </p>
          </div>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            const { updatedAt: _u, ...rest } = p
            updateProfile(rest)
            completeOnboarding()
          }}
        >
          Bắt đầu
        </Button>
      </Card>
    </div>
  )
}

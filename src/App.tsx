import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Toaster } from 'sonner'
import { BottomNav } from '@/components/BottomNav'
import { startSync } from '@/lib/sync'
import { todayKey } from '@/lib/date'
import { applyTheme, useSettings } from '@/store/settings'
import { useAppStore, useHydrated } from '@/store/useAppStore'
import { useUi } from '@/store/ui'
import { ActivityView } from '@/features/activity/ActivityView'
import { AddSheet } from '@/features/add/AddSheet'
import { GoalsView } from '@/features/goals/GoalsView'
import { Onboarding } from '@/features/onboarding/Onboarding'
import { EditLogSheet } from '@/features/today/EditLogSheet'
import { TodayView } from '@/features/today/TodayView'

// Tab Tuần dùng thư viện biểu đồ (nặng) → tải khi mở
const WeekView = lazy(() => import('@/features/week/WeekView').then((m) => ({ default: m.WeekView })))

const VIEWS = { today: TodayView, week: WeekView, activity: ActivityView, goals: GoalsView }

export default function App() {
  const hydrated = useHydrated()
  const onboarded = useAppStore((s) => s.onboarded)
  const tab = useUi((s) => s.tab)
  const theme = useSettings((s) => s.theme)

  useEffect(() => {
    startSync()
  }, [])

  // Theo dõi theme hệ thống khi chọn "Tự động"
  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  // Mở lại app sau nửa đêm → nhảy về ngày mới
  useEffect(() => {
    let last = todayKey()
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      const now = todayKey()
      if (now !== last) {
        if (useUi.getState().date === last) useUi.getState().setDate(now)
        last = now
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-2xl bg-primary/30" />
      </div>
    )
  }

  const View = VIEWS[tab]

  return (
    <>
      {onboarded ? (
        <div className="mx-auto min-h-dvh max-w-lg pb-28">
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              <Suspense fallback={<div className="mx-4 mt-20 h-40 animate-pulse rounded-2xl bg-muted" />}>
                <View />
              </Suspense>
            </motion.main>
          </AnimatePresence>
          <BottomNav />
          <AddSheet />
          <EditLogSheet />
        </div>
      ) : (
        <Onboarding />
      )}
      <Toaster
        position="top-center"
        richColors
        closeButton
        theme={theme}
        toastOptions={{ duration: 3500, className: 'font-sans' }}
      />
    </>
  )
}

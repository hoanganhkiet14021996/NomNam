import { motion } from 'motion/react'
import { BarChart3, Dumbbell, Home, Plus, Target } from 'lucide-react'
import { useUi, type Tab } from '@/store/ui'
import { cn } from '@/lib/utils'

const ITEMS: { tab: Tab; label: string; icon: typeof Home }[] = [
  { tab: 'today', label: 'Hôm nay', icon: Home },
  { tab: 'week', label: 'Tuần', icon: BarChart3 },
  { tab: 'activity', label: 'Vận động', icon: Dumbbell },
  { tab: 'goals', label: 'Mục tiêu', icon: Target },
]

export function BottomNav() {
  const tab = useUi((s) => s.tab)
  const setTab = useUi((s) => s.setTab)
  const openAdd = useUi((s) => s.openAdd)

  const renderItem = (it: (typeof ITEMS)[number]) => {
    const active = tab === it.tab
    const Icon = it.icon
    return (
      <button
        key={it.tab}
        type="button"
        onClick={() => setTab(it.tab)}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors',
          active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        )}
      >
        {active && (
          <motion.span
            layoutId="nav-pill"
            className="absolute top-1 h-8 w-14 rounded-full bg-primary/10"
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          />
        )}
        <Icon className="relative h-5 w-5 mt-1.5" strokeWidth={active ? 2.5 : 2} />
        <span className="relative">{it.label}</span>
      </button>
    )
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/85 backdrop-blur-xl pb-safe">
      <div className="mx-auto flex max-w-lg items-end px-2">
        {ITEMS.slice(0, 2).map(renderItem)}
        <div className="flex flex-1 justify-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => openAdd()}
            aria-label="Thêm món ăn"
            className="-mt-6 mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </motion.button>
        </div>
        {ITEMS.slice(2).map(renderItem)}
      </div>
    </nav>
  )
}

import { SyncBadge } from '@/features/goals/SyncBadge'

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 px-4 pb-3 pt-[max(env(safe-area-inset-top),1rem)]">
      <div className="min-w-0">
        {subtitle && <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{subtitle}</p>}
        <h1 className="truncate text-2xl font-extrabold tracking-tight">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {right}
        <SyncBadge />
      </div>
    </header>
  )
}

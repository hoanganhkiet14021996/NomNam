import { AlertCircle, Cloud, CloudOff, Loader2 } from 'lucide-react'
import { useSync } from '@/lib/sync'
import { useAppStore } from '@/store/useAppStore'
import { useUi } from '@/store/ui'
import { cn } from '@/lib/utils'

/** Chấm trạng thái đồng bộ nhỏ ở góc header. Bấm để mở phần Tài khoản. */
export function SyncBadge() {
  const status = useSync((s) => s.status)
  const pending = useAppStore((s) => Object.keys(s.outbox).length)
  const setTab = useUi((s) => s.setTab)
  if (status === 'disabled' || status === 'signed-out') return null

  const map = {
    idle: { icon: Cloud, cls: 'text-success', label: pending ? `${pending} thay đổi chờ đồng bộ` : 'Đã đồng bộ' },
    syncing: { icon: Loader2, cls: 'text-muted-foreground animate-spin', label: 'Đang đồng bộ' },
    offline: { icon: CloudOff, cls: 'text-muted-foreground', label: 'Ngoại tuyến — dữ liệu vẫn lưu trên máy' },
    error: { icon: AlertCircle, cls: 'text-destructive', label: 'Lỗi đồng bộ' },
  } as const
  const { icon: Icon, cls, label } = map[status]

  return (
    <button
      type="button"
      onClick={() => setTab('goals')}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
    >
      <Icon className={cn('h-4 w-4', cls)} />
    </button>
  )
}

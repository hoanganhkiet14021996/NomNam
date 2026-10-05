import { useState } from 'react'
import { Cloud, Loader2, LogOut, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { Segmented } from '@/components/ui/segmented'
import { PIN_LENGTH, displayName, signInWithPin, signOut, signUpWithPin, validatePin, validateUsername } from '@/lib/auth'
import { syncNow, useSync } from '@/lib/sync'
import { timeHHMM } from '@/lib/date'
import { useAppStore } from '@/store/useAppStore'

export function AccountCard() {
  const { session, status, lastSyncedAt, error } = useSync()
  const pending = useAppStore((s) => Object.keys(s.outbox).length)

  if (!supabase) {
    return (
      <Card className="p-4">
        <h3 className="font-bold">Đồng bộ</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Chưa cấu hình Supabase (.env). Dữ liệu đang lưu trên trình duyệt của máy này.
        </p>
      </Card>
    )
  }

  if (!session) return <LoginForm />

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Cloud className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{displayName(session.user)}</p>
          <p className="text-xs text-muted-foreground">
            {status === 'syncing'
              ? 'Đang đồng bộ…'
              : status === 'offline'
                ? 'Ngoại tuyến — sẽ tự đồng bộ khi có mạng'
                : status === 'error'
                  ? `Lỗi: ${error}`
                  : lastSyncedAt
                    ? `Đồng bộ lúc ${timeHHMM(lastSyncedAt)}${pending ? ` · ${pending} thay đổi chờ` : ''}`
                    : 'Đã đăng nhập'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => void syncNow()} disabled={status === 'syncing'}>
          {status === 'syncing' ? <Loader2 className="animate-spin" /> : <RefreshCw />} Đồng bộ ngay
        </Button>
        <Button
          variant="ghost"
          onClick={async () => {
            await signOut()
            toast('Đã đăng xuất. Dữ liệu vẫn còn trên máy này.')
          }}
        >
          <LogOut /> Đăng xuất
        </Button>
      </div>
    </Card>
  )
}

export function LoginForm({ compact }: { compact?: boolean }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const invalid = validateUsername(username) ?? validatePin(pin)

  const submit = async () => {
    setBusy(true)
    try {
      if (mode === 'login') await signInWithPin(username, pin)
      else await signUpWithPin(username, pin)
      toast.success(mode === 'login' ? 'Đăng nhập thành công, đang đồng bộ…' : 'Đã tạo tài khoản, đang đồng bộ…')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không đăng nhập được')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className={compact ? 'space-y-3 border-0 p-0 shadow-none' : 'space-y-3 p-4'}>
      {!compact && (
        <div>
          <h3 className="font-bold">Đồng bộ điện thoại ↔ máy tính</h3>
          <p className="text-sm text-muted-foreground">Đăng nhập bằng tên + mã PIN. Dữ liệu hiện có trên máy sẽ được đưa lên.</p>
        </div>
      )}
      <Segmented
        value={mode}
        onChange={setMode}
        size="sm"
        options={[
          { value: 'login', label: 'Đăng nhập' },
          { value: 'signup', label: 'Tạo tài khoản' },
        ]}
      />
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault()
          void submit()
        }}
      >
        <Input
          placeholder="Tên đăng nhập (vd: kiet)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          aria-label="Tên đăng nhập"
        />
        <Input
          type="password"
          inputMode="numeric"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          placeholder={`Mã PIN ${PIN_LENGTH} số`}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH))}
          className="num tracking-[0.4em]"
          aria-label="Mã PIN"
        />
        {mode === 'signup' && <p className="text-xs text-muted-foreground">Nhớ kỹ PIN — chưa có chức năng lấy lại.</p>}
        <Button type="submit" className="w-full" disabled={busy || !!invalid}>
          {busy && <Loader2 className="animate-spin" />} {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
        </Button>
      </form>
    </Card>
  )
}

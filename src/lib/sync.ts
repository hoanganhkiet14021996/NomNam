import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { TABLES, useAppStore, type TableName } from '@/store/useAppStore'

/**
 * Local-first sync:
 *  - Mọi thay đổi ghi vào store (IndexedDB) + outbox ngay → UI tức thì, offline vẫn chạy.
 *  - Khi online & đã đăng nhập: kéo bản mới từ Supabase (pull) rồi đẩy outbox (push).
 *  - Xung đột: bản có updatedAt mới hơn thắng (last-write-wins). Xoá = soft delete (deletedAt).
 */

export type SyncStatus = 'disabled' | 'signed-out' | 'idle' | 'syncing' | 'offline' | 'error'

interface SyncState {
  status: SyncStatus
  session: Session | null
  lastSyncedAt: string | null
  error: string | null
}

export const useSync = create<SyncState>(() => ({
  status: supabase ? 'signed-out' : 'disabled',
  session: null,
  lastSyncedAt: null,
  error: null,
}))

const TIMESTAMP_COLS = new Set(['created_at', 'updated_at', 'deleted_at'])
const PAGE = 1000
/** Lùi mốc pull một chút để không sót bản ghi do lệch đồng hồ giữa các thiết bị. */
const PULL_MARGIN_MS = 10 * 60 * 1000

const snake = (k: string) => k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)
const camel = (k: string) => k.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase())

function toRow(obj: object, userId: string): Record<string, unknown> {
  const row: Record<string, unknown> = { user_id: userId }
  for (const [k, v] of Object.entries(obj)) {
    if (k === 'custom') continue
    row[snake(k)] = v
  }
  return row
}

function fromRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(row)) {
    if (k === 'user_id') continue
    // Postgres trả "…+00:00", client lưu "…Z" → chuẩn hoá để so sánh chuỗi đúng
    out[camel(k)] = TIMESTAMP_COLS.has(k) && typeof v === 'string' ? new Date(v).toISOString() : v
  }
  return out
}

function currentUserId(): string | null {
  return useSync.getState().session?.user.id ?? null
}

async function pull(userId: string) {
  const sb = supabase!
  const { lastPulledAt } = useAppStore.getState()
  const since = lastPulledAt ? new Date(new Date(lastPulledAt).getTime() - PULL_MARGIN_MS).toISOString() : null
  const startedAt = new Date().toISOString()

  const { data: prof, error: profErr } = await sb.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (profErr) throw profErr
  if (prof) {
    const { id: _id, ...rest } = fromRow(prof)
    useAppStore.getState()._merge('profiles', [rest])
  }

  for (const table of Object.keys(TABLES) as (keyof typeof TABLES)[]) {
    for (let from = 0; ; from += PAGE) {
      let q = sb.from(table).select('*').order('updated_at').range(from, from + PAGE - 1)
      if (since) q = q.gt('updated_at', since)
      const { data, error } = await q
      if (error) throw error
      const rows = data.map((r) => {
        const o = fromRow(r)
        if (table === 'custom_foods') o.custom = true
        return o
      })
      useAppStore.getState()._merge(table, rows)
      if (data.length < PAGE) break
    }
  }
  useAppStore.getState()._setSyncMeta({ lastPulledAt: startedAt })
}

async function push(userId: string) {
  const sb = supabase!
  const state = useAppStore.getState()
  const keys = Object.keys(state.outbox)
  if (!keys.length) return

  const byTable = new Map<TableName, string[]>()
  for (const k of keys) {
    const [table, id] = k.split(':') as [TableName, string]
    byTable.set(table, [...(byTable.get(table) ?? []), id])
  }

  for (const [table, ids] of byTable) {
    const sent: { key: string; updatedAt: string }[] = []
    let rows: Record<string, unknown>[]
    if (table === 'profiles') {
      const { profile } = state
      const { user_id: _u, ...row } = toRow(profile, userId)
      rows = [{ ...row, id: userId }]
      sent.push({ key: 'profiles:me', updatedAt: profile.updatedAt })
    } else {
      const col = state[TABLES[table]] as Record<string, { id: string; updatedAt: string }>
      const records = ids.map((id) => col[id]).filter(Boolean)
      rows = records.map((r) => toRow(r, userId))
      for (const r of records) sent.push({ key: `${table}:${r.id}`, updatedAt: r.updatedAt })
      // id trong outbox nhưng không còn bản ghi → bỏ
      const missing = ids.filter((id) => !col[id]).map((id) => `${table}:${id}`)
      if (missing.length) useAppStore.getState()._clearOutbox(missing)
    }
    if (!rows.length) continue
    const { error } = await sb.from(table).upsert(rows, { onConflict: 'id' })
    if (error) throw error

    // Chỉ xoá khỏi outbox nếu bản ghi không bị sửa tiếp trong lúc đang gửi
    const now = useAppStore.getState()
    const done = sent
      .filter(({ key, updatedAt }) => {
        if (key === 'profiles:me') return now.profile.updatedAt === updatedAt
        const [t, id] = key.split(':') as [keyof typeof TABLES, string]
        return (now[TABLES[t]] as Record<string, { updatedAt: string }>)[id]?.updatedAt === updatedAt
      })
      .map((s) => s.key)
    useAppStore.getState()._clearOutbox(done)
  }
}

let running: Promise<void> | null = null
let again = false

/** Chạy 1 vòng pull → push. Gọi chồng nhau sẽ được gộp. */
export function syncNow(): Promise<void> {
  if (!supabase) return Promise.resolve()
  if (running) {
    again = true
    return running
  }
  running = (async () => {
    do {
      again = false
      const userId = currentUserId()
      if (!userId) {
        useSync.setState({ status: 'signed-out' })
        return
      }
      if (!navigator.onLine) {
        useSync.setState({ status: 'offline' })
        return
      }
      useSync.setState({ status: 'syncing', error: null })
      try {
        await pull(userId)
        await push(userId)
        useSync.setState({ status: 'idle', lastSyncedAt: new Date().toISOString() })
      } catch (e) {
        console.error('[sync]', e)
        useSync.setState({ status: 'error', error: e instanceof Error ? e.message : String(e) })
        return
      }
    } while (again)
  })().finally(() => {
    running = null
  })
  return running
}

/** Khi đăng nhập: gắn dữ liệu local với user, đổi user thì xoá dữ liệu cũ. */
function onSignedIn(session: Session) {
  const s = useAppStore.getState()
  if (s.ownerId === null) {
    // Lần đầu đăng nhập trên máy này → đẩy toàn bộ dữ liệu local lên (pull trước, bản mới hơn thắng)
    s._setSyncMeta({ ownerId: session.user.id })
    s._enqueueAll()
  } else if (s.ownerId !== session.user.id) {
    s._resetData()
    useAppStore.getState()._setSyncMeta({ ownerId: session.user.id, lastPulledAt: null })
  }
}

let started = false

export function startSync() {
  if (!supabase || started) return
  started = true

  supabase.auth.onAuthStateChange((event, session) => {
    const prev = useSync.getState().session
    useSync.setState({ session, status: session ? 'idle' : 'signed-out' })
    if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && prev?.user.id !== session.user.id) {
      onSignedIn(session)
      // Tránh gọi Supabase ngay trong callback auth (có thể deadlock) → đẩy sang tick sau
      setTimeout(() => void syncNow(), 0)
    }
  })

  // Có thay đổi mới trong outbox → đẩy lên sau 1.5s (gộp nhiều thao tác liên tiếp)
  let timer: ReturnType<typeof setTimeout> | undefined
  useAppStore.subscribe((state, prev) => {
    if (state.outbox !== prev.outbox && Object.keys(state.outbox).length) {
      clearTimeout(timer)
      timer = setTimeout(() => void syncNow(), 1500)
    }
  })

  window.addEventListener('online', () => void syncNow())
  window.addEventListener('offline', () => useSync.setState({ status: 'offline' }))
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void syncNow()
  })
  setInterval(() => void syncNow(), 5 * 60 * 1000)
}

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim()
// Key mới của Supabase là "publishable" (sb_publishable_…); vẫn nhận tên cũ ANON_KEY. Vite chỉ đọc biến VITE_*.
const anonKey = (
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
)?.trim()

function isHttpUrl(s: string | undefined): s is string {
  try {
    return !!s && /^https?:$/.test(new URL(s).protocol)
  } catch {
    return false
  }
}

function init(): SupabaseClient | null {
  if (!isHttpUrl(url) || !anonKey || anonKey.startsWith('your')) {
    if (url || anonKey) console.info('[supabase] .env chưa có URL/key hợp lệ → chạy chế độ chỉ lưu trên máy')
    return null
  }
  try {
    return createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  } catch (e) {
    console.error('[supabase] Không khởi tạo được client', e)
    return null
  }
}

/** null khi chưa cấu hình .env → app chạy chế độ chỉ lưu trên máy. */
export const supabase = init()

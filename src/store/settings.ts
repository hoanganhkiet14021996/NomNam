import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings, ThemePref } from '@/types'

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash'

interface SettingsState extends Settings {
  setTheme: (t: ThemePref) => void
  setGemini: (key: string, model?: string) => void
}

/** Cài đặt chỉ thuộc thiết bị này (không sync): theme, Gemini API key. */
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      geminiKey: '',
      geminiModel: DEFAULT_GEMINI_MODEL,
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      setGemini: (geminiKey, geminiModel) =>
        set((s) => ({ geminiKey: geminiKey.trim(), geminiModel: geminiModel?.trim() || s.geminiModel })),
    }),
    { name: 'calitrack-settings' }, // giữ tên khoá cũ để không mất cài đặt/Gemini key
  ),
)

export function applyTheme(theme: ThemePref) {
  try {
    localStorage.setItem('calitrack-theme', JSON.stringify(theme)) // khoá cũ, index.html đọc cùng tên
  } catch {
    // private mode
  }
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}

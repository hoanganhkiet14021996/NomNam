import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Palette, Settings, ThemePref } from '@/types'

export const DEFAULT_GEMINI_MODEL = 'gemini-3.6-flash'
/** Bí danh "Flash-Lite mới nhất" của Google — pool tải riêng, ít nghẽn hơn; nếu key không có thì bị bỏ qua. */
export const DEFAULT_GEMINI_FALLBACK = 'gemini-flash-lite-latest'

interface SettingsState extends Settings {
  setTheme: (t: ThemePref) => void
  setPalette: (p: Palette) => void
  setGemini: (key: string, model?: string, fallback?: string) => void
}

/** Cài đặt chỉ thuộc thiết bị này (không sync): theme, Gemini API key. */
export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      palette: 'nomnam',
      geminiKey: '',
      geminiModel: DEFAULT_GEMINI_MODEL,
      geminiFallbackModel: DEFAULT_GEMINI_FALLBACK,
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      setPalette: (palette) => {
        set({ palette })
        applyPalette(palette)
      },
      setGemini: (geminiKey, geminiModel, geminiFallbackModel) =>
        set((s) => ({
          geminiKey: geminiKey.trim(),
          geminiModel: geminiModel?.trim() || s.geminiModel,
          geminiFallbackModel: geminiFallbackModel === undefined ? s.geminiFallbackModel : geminiFallbackModel.trim(),
        })),
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

export function applyPalette(palette: Palette) {
  try {
    localStorage.setItem('calitrack-palette', JSON.stringify(palette)) // index.html đọc để tránh nháy màu
  } catch {
    // private mode
  }
  if (palette === 'nomnam') delete document.documentElement.dataset.palette
  else document.documentElement.dataset.palette = palette
}

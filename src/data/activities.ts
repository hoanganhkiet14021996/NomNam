import type { Intensity } from '@/types'

export interface ActivityPreset {
  id: string
  name: string
  emoji: string
  /** MET theo Compendium of Physical Activities (2011/2024) */
  met: Record<Intensity, number>
  hint: Record<Intensity, string>
}

export const INTENSITY_LABEL: Record<Intensity, string> = {
  light: 'Nhẹ',
  moderate: 'Vừa',
  vigorous: 'Mạnh',
}

export const ACTIVITIES: ActivityPreset[] = [
  {
    id: 'football',
    name: 'Đá banh',
    emoji: '⚽',
    met: { light: 5.0, moderate: 7.0, vigorous: 10.0 },
    hint: { light: 'Đá vui, đứng nhiều', moderate: 'Đá phủi, sân 5–7', vigorous: 'Thi đấu, chạy liên tục' },
  },
  {
    id: 'gym',
    name: 'Gym / tạ',
    emoji: '🏋️',
    met: { light: 3.5, moderate: 5.0, vigorous: 6.0 },
    hint: { light: 'Nghỉ dài giữa set', moderate: '8–15 rep, nhiều bài', vigorous: 'Nặng, nghỉ ngắn, superset' },
  },
  {
    id: 'running',
    name: 'Chạy bộ',
    emoji: '🏃',
    met: { light: 7.0, moderate: 9.8, vigorous: 11.5 },
    hint: { light: '~7–8 km/h', moderate: '~9–10 km/h', vigorous: '~11–12 km/h' },
  },
  {
    id: 'cycling',
    name: 'Đạp xe',
    emoji: '🚴',
    met: { light: 4.0, moderate: 6.8, vigorous: 10.0 },
    hint: { light: '< 16 km/h', moderate: '19–22 km/h', vigorous: '> 25 km/h' },
  },
  {
    id: 'swimming',
    name: 'Bơi',
    emoji: '🏊',
    met: { light: 5.8, moderate: 8.3, vigorous: 10.0 },
    hint: { light: 'Bơi thong thả', moderate: 'Bơi sải đều', vigorous: 'Bơi nhanh liên tục' },
  },
  {
    id: 'badminton',
    name: 'Cầu lông',
    emoji: '🏸',
    met: { light: 4.5, moderate: 5.5, vigorous: 7.0 },
    hint: { light: 'Đánh vui', moderate: 'Đánh đôi', vigorous: 'Thi đấu đơn' },
  },
  {
    id: 'pickleball',
    name: 'Pickleball',
    emoji: '🏓',
    met: { light: 3.5, moderate: 4.5, vigorous: 6.0 },
    hint: { light: 'Đánh vui', moderate: 'Đánh đôi', vigorous: 'Thi đấu' },
  },
  {
    id: 'tennis',
    name: 'Tennis',
    emoji: '🎾',
    met: { light: 5.0, moderate: 7.3, vigorous: 8.0 },
    hint: { light: 'Đánh đôi', moderate: 'Đánh đơn', vigorous: 'Thi đấu' },
  },
  {
    id: 'basketball',
    name: 'Bóng rổ',
    emoji: '🏀',
    met: { light: 4.5, moderate: 6.5, vigorous: 8.0 },
    hint: { light: 'Ném rổ', moderate: 'Đấu tập', vigorous: 'Thi đấu' },
  },
  {
    id: 'hiit',
    name: 'HIIT / Circuit',
    emoji: '🔥',
    met: { light: 4.3, moderate: 8.0, vigorous: 10.0 },
    hint: { light: 'Nhịp chậm', moderate: 'Circuit nhiều bài', vigorous: 'Tabata, sprint' },
  },
  {
    id: 'walking',
    name: 'Đi bộ',
    emoji: '🚶',
    met: { light: 3.0, moderate: 3.5, vigorous: 5.0 },
    hint: { light: '~4 km/h', moderate: '~5 km/h', vigorous: '~6.5 km/h, leo dốc' },
  },
  {
    id: 'yoga',
    name: 'Yoga / giãn cơ',
    emoji: '🧘',
    met: { light: 2.5, moderate: 3.0, vigorous: 4.0 },
    hint: { light: 'Giãn cơ', moderate: 'Hatha', vigorous: 'Power yoga' },
  },
]

export const OTHER_ACTIVITY = { id: 'other', name: 'Khác', emoji: '⏱️' }

export function findActivity(id: string): ActivityPreset | undefined {
  return ACTIVITIES.find((a) => a.id === id)
}

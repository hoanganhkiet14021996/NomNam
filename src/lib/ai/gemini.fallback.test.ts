import { beforeEach, describe, expect, it, vi } from 'vitest'

const calls: string[] = []
let behaviour: Record<string, 'ok' | 'overloaded' | '404'> = {}

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    models = {
      generateContent: async ({ model }: { model: string }) => {
        calls.push(model)
        const b = behaviour[model]
        if (b === 'overloaded') throw new Error('503 UNAVAILABLE: The model is overloaded')
        if (b === '404') throw new Error('404 models/x is not found')
        return { text: JSON.stringify({ dishName: 'Cơm', items: [] }) }
      },
    }
  },
}))

import { analyzeMeal } from './gemini'

describe('analyzeMeal chuyển model dự phòng', () => {
  beforeEach(() => {
    calls.length = 0
    vi.useFakeTimers()
  })

  const run = async (p: Promise<unknown>) => {
    const settled = p.then((v) => ({ v }), (e: Error) => ({ e }))
    await vi.runAllTimersAsync()
    return settled
  }

  it('model chính quá tải → thử lại rồi dùng dự phòng', async () => {
    behaviour = { main: 'overloaded', backup: 'ok' }
    const onFallback = vi.fn()
    const r = await run(analyzeMeal({ apiKey: 'k', model: 'main', fallbackModel: 'backup', text: 'cơm', onFallback }))
    expect('v' in r).toBe(true)
    expect(calls).toEqual(['main', 'main', 'main', 'backup'])
    expect(onFallback).toHaveBeenCalledWith('backup')
  })

  it('không có dự phòng → báo lỗi quá tải', async () => {
    behaviour = { main: 'overloaded' }
    const r = await run(analyzeMeal({ apiKey: 'k', model: 'main', text: 'cơm' }))
    expect('e' in r && r.e.message).toMatch(/quá tải/)
  })

  it('dự phòng không tồn tại (404) → báo lỗi của model chính', async () => {
    behaviour = { main: 'overloaded', backup: '404' }
    const r = await run(analyzeMeal({ apiKey: 'k', model: 'main', fallbackModel: 'backup', text: 'cơm' }))
    expect('e' in r && r.e.message).toMatch(/quá tải/)
  })
})

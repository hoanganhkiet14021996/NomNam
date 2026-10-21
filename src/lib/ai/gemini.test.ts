import { describe, expect, it } from 'vitest'
import { friendlyError, isSwitchable, pickGeminiModels, retryDelayMs, suggestedRetrySeconds } from './gemini'

const overloaded = new Error('{"error":{"code":503,"message":"The model is overloaded. Please try again later.","status":"UNAVAILABLE"}}')
const perMinute = new Error('429 RESOURCE_EXHAUSTED: Quota exceeded for metric generate_content_free_tier_requests, PerMinute. Please retry in 12.3s.')
const perDay = new Error('429 RESOURCE_EXHAUSTED: Quota exceeded for metric generate_content_free_tier_requests, PerDay. Please retry in 5s.')

describe('Gemini lỗi tạm thời', () => {
  it('quá tải 503 → thử lại, lùi dần', () => {
    const a = retryDelayMs(overloaded, 0)!
    const b = retryDelayMs(overloaded, 2)!
    expect(a).toBeGreaterThanOrEqual(1500)
    expect(b).toBeGreaterThan(a)
  })
  it('hết lượt/phút → chờ theo gợi ý; hết lượt/ngày → không thử lại', () => {
    expect(suggestedRetrySeconds(perMinute)).toBe(13)
    expect(retryDelayMs(perMinute, 0)).toBe(14000)
    expect(retryDelayMs(perDay, 0)).toBeNull()
  })
  it('lỗi khác không thử lại và thông báo dễ hiểu', () => {
    expect(retryDelayMs(new Error('API key not valid'), 0)).toBeNull()
    expect(friendlyError(overloaded)).toMatch(/quá tải/)
    expect(friendlyError(perMinute)).toMatch(/13 giây/)
    expect(friendlyError(perDay)).toMatch(/trong ngày/)
  })
})

describe('model dự phòng', () => {
  it('chỉ chuyển model khi lỗi tải/quota/404', () => {
    expect(isSwitchable(overloaded)).toBe(true)
    expect(isSwitchable(perDay)).toBe(true)
    expect(isSwitchable(new Error('404 model not found'))).toBe(true)
    expect(isSwitchable(new Error('API key not valid'))).toBe(false)
    expect(isSwitchable(new Error('Failed to fetch'))).toBe(false)
  })
  it('lọc danh sách model: chỉ Gemini viết được chữ', () => {
    const list = [
      { name: 'models/gemini-3.6-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-3.6-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-flash-lite-latest', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-embedding-001', supportedGenerationMethods: ['embedContent'] },
      { name: 'models/gemini-3.6-flash-preview-tts', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/imagen-4', supportedGenerationMethods: ['predict'] },
    ]
    expect(pickGeminiModels(list)).toEqual(['gemini-3.6-flash', 'gemini-flash-lite-latest'])
  })
})

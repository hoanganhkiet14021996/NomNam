import { describe, expect, it } from 'vitest'
import { displayName, normalizeUsername, usernameToEmail, validatePin, validateUsername } from './auth'

describe('đăng nhập tên + PIN', () => {
  it('chuẩn hoá tên: bỏ dấu, khoảng trắng, ký tự lạ', () => {
    expect(normalizeUsername('Kiệt Hoàng')).toBe('kiethoang')
    expect(normalizeUsername('  An_2!  ')).toBe('an_2')
    expect(usernameToEmail('Kiệt')).toBe('kiet@namnguyen27.app')
  })
  it('cùng tên gõ khác hoa/thường, có dấu hay không → cùng tài khoản', () => {
    expect(usernameToEmail('KIỆT')).toBe(usernameToEmail('kiet'))
  })
  it('kiểm tra tên', () => {
    expect(validateUsername('ab')).not.toBeNull()
    expect(validateUsername('kiet')).toBeNull()
  })
  it('PIN đúng 6 chữ số', () => {
    expect(validatePin('123456')).toBeNull()
    expect(validatePin('1234')).not.toBeNull()
    expect(validatePin('12345a')).not.toBeNull()
  })
  it('tên hiển thị', () => {
    expect(displayName({ email: 'kiet@namnguyen27.app', user_metadata: { username: 'Kiệt' } })).toBe('Kiệt')
    expect(displayName({ email: 'kiet@namnguyen27.app' })).toBe('kiet')
  })
})

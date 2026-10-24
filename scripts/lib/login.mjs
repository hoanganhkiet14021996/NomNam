// Đăng nhập Supabase bằng tên + PIN (giống app) cho các script chạy trên máy tính.
// PIN nhập ẩn trong terminal, không lưu ở đâu cả. Cần .env có VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY.
import { readFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { createClient } from '@supabase/supabase-js'

// Phải giống src/lib/auth.ts (đổi domain = hỏng đăng nhập)
const EMAIL_DOMAIN = 'namnguyen27.app'

function readEnv() {
  const env = { ...process.env }
  try {
    for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '')
    }
  } catch {
    // không có .env → dùng biến môi trường
  }
  return env
}

const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

const usernameToEmail = (raw) => `${normalize(raw).replace(/[^a-z0-9._-]/g, '')}@${EMAIL_DOMAIN}`

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    if (hidden) rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : '')
    rl.question(question, (answer) => {
      rl.close()
      if (hidden) process.stdout.write('\n')
      resolve(answer.trim())
    })
  })
}

/** Hỏi tên + PIN, đăng nhập, trả về { sb, user }. Thoát tiến trình nếu thất bại. */
export async function loginInteractive() {
  const env = readEnv()
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.error('Thiếu VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY trong .env')
    process.exit(1)
  }
  const sb = createClient(url, key, { auth: { persistSession: false } })
  const name = await ask('Tên đăng nhập NomNam: ')
  const pin = await ask('Mã PIN: ', true)
  const { data, error } = await sb.auth.signInWithPassword({ email: usernameToEmail(name), password: pin })
  if (error) {
    console.error('Đăng nhập thất bại:', error.message)
    process.exit(1)
  }
  return { sb, user: data.user }
}

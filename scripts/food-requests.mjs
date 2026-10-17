// Tải danh sách "Món chờ bổ sung" từ Supabase về file food-requests.json (không commit)
// để agent food-researcher research và thêm vào src/data/foods.vn.ts.
// Chạy: npm run food-requests  → nhập tên + PIN (giống trong app). PIN không lưu lại ở đâu.
import { readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { createClient } from '@supabase/supabase-js'

const OUT = 'food-requests.json'
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
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
const usernameToEmail = (raw) => `${normalize(raw).replace(/[^a-z0-9._-]/g, '')}@${EMAIL_DOMAIN}`

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    if (hidden) {
      // Ẩn ký tự khi gõ PIN
      rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : '')
    }
    rl.question(question, (answer) => {
      rl.close()
      if (hidden) process.stdout.write('\n')
      resolve(answer.trim())
    })
  })
}

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
const { error: authErr } = await sb.auth.signInWithPassword({ email: usernameToEmail(name), password: pin })
if (authErr) {
  console.error('Đăng nhập thất bại:', authErr.message)
  process.exit(1)
}

const { data, error } = await sb
  .from('food_requests')
  .select('id,name,name_key,emoji,role,kind,cooking,per100,grams,times_seen,updated_at')
  .eq('status', 'pending')
  .is('deleted_at', null)
  .order('times_seen', { ascending: false })
if (error) {
  console.error('Không đọc được bảng food_requests:', error.message, '\n→ Đã chạy SQL tạo bảng trong supabase_schema.sql chưa?')
  process.exit(1)
}

writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n')
console.log(`Đã lưu ${data.length} món chờ bổ sung vào ${OUT}`)
for (const r of data) console.log(`  ${r.emoji} ${r.name} (${r.kind || r.role}, ${r.cooking}) · ăn ${r.times_seen} lần`)
await sb.auth.signOut()

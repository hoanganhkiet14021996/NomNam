// Tải danh sách "Món chờ bổ sung" từ Supabase về file food-requests.json (không commit)
// để làm bổ sung vào src/data/foods/ (xem scripts/specs/requests.mjs).
// Chạy: node scripts/food-requests.mjs  (hoặc npm run food-requests) → nhập tên + PIN (giống trong app).
import { writeFileSync } from 'node:fs'
import { loginInteractive } from './lib/login.mjs'

const OUT = 'food-requests.json'
const { sb } = await loginInteractive()

const { data, error } = await sb
  .from('food_requests')
  .select('id,name,name_key,emoji,role,kind,cooking,per100,grams,times_seen,updated_at')
  .eq('status', 'pending')
  .is('deleted_at', null)
  .order('times_seen', { ascending: false })
if (error) {
  console.error('Không đọc được bảng food_requests:', error.message, '\n→ Đã chạy scripts/food_requests.sql trong Supabase chưa?')
  process.exit(1)
}

writeFileSync(OUT, JSON.stringify(data, null, 2) + '\n')
console.log(`Đã lưu ${data.length} món chờ bổ sung vào ${OUT}`)
for (const r of data) console.log(`  ${r.emoji} ${r.name} (${r.kind || r.role}, ${r.cooking}) · ăn ${r.times_seen} lần`)
await sb.auth.signOut()

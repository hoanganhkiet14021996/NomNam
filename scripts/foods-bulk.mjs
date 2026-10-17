// Nhập hàng loạt nguyên liệu vào bảng món từ các bộ dữ liệu chính thức — KHÔNG tốn token AI.
//
//   FOOD_DATA_DIR=<thư mục> node scripts/foods-bulk.mjs scripts/specs/meat.mjs [--dry]
//
// FOOD_DATA_DIR chứa:
//   cache.json   gộp USDA SR Legacy (src "SR"), USDA Foundation ("FD"), Matvaretabellen ("MV"):
//                [{ src, id, name(EN), kcal, p, c, f, fib }] trên 100g
//   vdd/all.json Bảng thành phần thực phẩm VN của Viện Dinh dưỡng
//                (API https://viendinhduong.vn/api/fe/foodNatunal/getPageFoodData?page=1&pageSize=1000)
//
// File spec liệt kê món cần nhập (AI/người chỉ chọn tên + nguồn, script tính số):
//   export const meta = { out: 'meat', exportName: 'MEAT_FOODS', title: '…' }
//   export default [{ id, name, emoji, cat, aliases, servings: [['1 miếng', 80]],
//                     usda: ['regex tên tiếng Anh trong SR/FD', …], mv: ['regex', …], vn: ['mã VDD' | 'regex tên Việt', …] }]
//
// Quy tắc chốt số (giống agent food-researcher): ≥ 3 nguồn → trung vị; 2 nguồn → trung bình; 1 nguồn → dùng nhưng độ tin
// cậy "thấp". Món lệch kcal > 35% giữa các nguồn (25–35%: vẫn ghi nhưng độ tin cậy "thấp"), hoặc lệch Atwater > 10% (món < 60 kcal: > 12 kcal) → KHÔNG ghi, in cảnh báo.
// Ghi đè (idempotent): src/data/foods/<out>.ts và docs/food-research/<out>.md.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const [specPath] = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const dry = process.argv.includes('--dry')
const dir = process.env.FOOD_DATA_DIR
if (!specPath || !dir) {
  console.error('Dùng: FOOD_DATA_DIR=<thư mục> node scripts/foods-bulk.mjs scripts/specs/<nhóm>.mjs [--dry]')
  process.exit(1)
}

const norm = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

// ── Nguồn dữ liệu ───────────────────────────────────────
const usda = JSON.parse(readFileSync(join(dir, 'cache.json'), 'utf8'))
const vdd = JSON.parse(readFileSync(join(dir, 'vdd/all.json'), 'utf8')).data.map((x) => {
  const g = (k) => x.nutrition.find((n) => n.key === k)?.value
  return { src: 'VN', id: x.code, name: x.name_vi, kcal: x.energy, p: g('protein'), c: g('carbohydrate-by-difference'), f: g('total-lipid-fat'), fib: undefined }
})

function pick(list, patterns, key, srcFilter) {
  const out = []
  for (const p of patterns ?? []) {
    const re = new RegExp(p, 'i')
    const exact = list.find((d) => (srcFilter ? srcFilter(d) : true) && String(d.id) === p)
    const hit = exact ?? list.find((d) => (srcFilter ? srcFilter(d) : true) && re.test(d[key] ?? d.name))
    if (hit) out.push(hit)
    else out.push({ missing: p })
  }
  return out
}

// ── Bảng món hiện có (tránh trùng) ──────────────────────
const root = resolve(import.meta.dirname, '..')
const tsFiles = ['src/data/foods.vn.ts', ...readdirSync(join(root, 'src/data/foods')).map((f) => `src/data/foods/${f}`)]
const existingIds = new Set()
const existingNames = new Map()
for (const f of tsFiles) {
  const txt = readFileSync(join(root, f), 'utf8')
  for (const m of txt.matchAll(/(?:food|dish)\(\s*'([^']+)',\s*'([^']+)'/g)) {
    existingIds.add(m[1])
    existingNames.set(norm(m[2]), m[1] + ' @ ' + f)
  }
}

const spec = await import(pathToFileURL(resolve(specPath)).href)
const { meta, default: entries } = spec
// Món của chính file đang sinh sẽ được ghi đè → không tính là "đã có"
const ownFile = `src/data/foods/${meta.out}.ts`
const ownTxt = readFileSync(join(root, ownFile), 'utf8')
const own = new Set([...ownTxt.matchAll(/(?:food|dish)\(\s*'([^']+)',\s*'([^']+)'/g)].map((m) => m[1]))
for (const id of own) existingIds.delete(id)
for (const [k, v] of existingNames) if (v.endsWith(ownFile)) existingNames.delete(k)

const med = (a) => {
  const s = [...a].sort((x, y) => x - y)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}
const r1 = (x) => Math.round(x * 10) / 10

const ok = []
const warn = []
const skipped = entries.filter((e) => e.skip)
const seenIds = new Set()
for (const e of entries) {
  if (e.skip) continue
  const problems = []
  if (existingIds.has(e.id)) problems.push(`id đã có: ${e.id}`)
  if (seenIds.has(e.id)) problems.push(`id lặp trong spec: ${e.id}`)
  seenIds.add(e.id)
  const dupName = existingNames.get(norm(e.name))
  if (dupName) problems.push(`tên trùng món đã có: ${dupName}`)

  const found = [
    ...pick(usda, e.usda, 'name', (d) => d.src === 'SR' || d.src === 'FD'),
    ...pick(usda, e.mv, 'name', (d) => d.src === 'MV'),
    ...pick(vdd, e.vn, 'name'),
  ]
  const missing = found.filter((x) => x.missing).map((x) => x.missing)
  const src = found.filter((x) => !x.missing && Number.isFinite(x.kcal) && Number.isFinite(x.p) && Number.isFinite(x.f))
  if (missing.length) problems.push(`không tìm thấy nguồn: ${missing.join(' ; ')}`)
  if (!src.length) {
    warn.push({ e, problems: [...problems, 'không có nguồn nào'] })
    continue
  }
  const agg = (k) => (src.length >= 3 ? med(src.map((s) => s[k] ?? 0)) : src.reduce((a, s) => a + (s[k] ?? 0), 0) / src.length)
  const kcal = Math.round(agg('kcal'))
  const p = r1(agg('p'))
  const f = r1(agg('f'))
  let c = r1(agg('c'))
  const fibSrc = src.filter((s) => Number.isFinite(s.fib))
  const fib = fibSrc.length ? r1(fibSrc.reduce((a, s) => a + s.fib, 0) / fibSrc.length) : (e.fiber ?? 0)
  if (!Number.isFinite(c)) c = 0
  const kc = src.map((s) => s.kcal)
  const spread = src.length > 1 ? (Math.max(...kc) - Math.min(...kc)) / Math.max(1, kcal) : 0
  const est = 4 * p + 4 * (c - fib) + 2 * fib + 9 * f
  const atwOff = kcal < 60 ? Math.abs(est - kcal) > 12 : Math.abs(est - kcal) / kcal > 0.1
  if (!e.alcohol && atwOff) problems.push(`lệch Atwater: kcal ${kcal} vs ước ${Math.round(est)}`)
  if (spread > 0.35) problems.push(`nguồn lệch ${(spread * 100).toFixed(0)}% kcal`)
  const nIndep = src.length
  const conf = nIndep >= 2 && spread <= 0.1 ? 'cao' : nIndep >= 2 && spread <= 0.25 ? 'trung bình' : nIndep >= 2 ? `thấp (nguồn lệch ${(spread * 100).toFixed(0)}%)` : 'thấp (1 nguồn)'
  const rec = { e, kcal, p, c, f, fib, src, spread, conf, nIndep }
  if (problems.length && !e.force) warn.push({ e, problems, rec })
  else ok.push(rec)
}

// ── Sinh file TS ────────────────────────────────────────
const q = (s) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
const lines = ok.map((r) => {
  const { e } = r
  const sv = (e.servings ?? []).map(([l, g]) => `s(${q(l)}, ${g})`).join(', ')
  const al = (e.aliases ?? []).map(q).join(', ')
  return `  food(${q(e.id)}, ${q(e.name)}, ${q(e.emoji ?? '🍖')}, ${q(e.cat ?? 'protein')}, [${r.kcal}, ${r.p}, ${r.c}, ${r.f}, ${r.fib}], [${sv}], [${al}]),`
})
const ts = `import type { Food } from '@/types'
import { food, s } from '../foodHelpers'

/** ${meta.title}. SINH TỰ ĐỘNG bởi scripts/foods-bulk.mjs từ scripts/specs/${meta.out}.mjs — sửa spec rồi chạy lại, đừng sửa tay. Nguồn từng món: docs/food-research/${meta.out}.md */
export const ${meta.exportName}: Food[] = [
${lines.join('\n')}
]
`

// ── Sinh log nguồn ──────────────────────────────────────
const srcCell = (s) => `${s.src === 'VN' ? 'Bảng VN' : s.src === 'MV' ? 'Matvaretabellen' : s.src === 'FD' ? 'USDA Foundation' : 'USDA SR'} ${s.id}: ${s.name.slice(0, 70)} (${Math.round(s.kcal)}/${r1(s.p)}/${r1(s.c ?? 0)}/${r1(s.f)})`
const md = `# ${meta.title}

Sinh tự động bởi \`scripts/foods-bulk.mjs\` (ngày ${new Date().toISOString().slice(0, 10)}). Số liệu trên 100g: kcal/P/C/F/xơ. ≥ 3 nguồn → trung vị, 2 nguồn → trung bình, 1 nguồn → độ tin cậy "thấp". Atwater đã kiểm bằng script (lệch ≤ 10%). Carb của Bảng VN và USDA đã gồm xơ.

| Món (id) | Số ghi | Nguồn | Lệch kcal | Độ tin cậy |
|---|---|---|---|---|
${ok.map((r) => `| ${r.e.name} (\`${r.e.id}\`) | ${r.kcal}/${r.p}/${r.c}/${r.f}/${r.fib} | ${r.src.map(srcCell).join('<br>')} | ${(r.spread * 100).toFixed(0)}% | ${r.conf} |`).join('\n')}
${skipped.length ? `\n## Món đã chủ động bỏ (số liệu nguồn đáng ngờ)\n\n${skipped.map((e) => `- **${e.name}** (\`${e.id}\`): ${e.skip}`).join('\n')}\n` : ''}
`

console.log(`✔ ${ok.length} món đạt, ⚠ ${warn.length} món bị loại / cần xem, ⏭ ${skipped.length} món đã chủ động bỏ (có lý do trong log)`)
const byConf = {}
for (const r of ok) byConf[r.conf] = (byConf[r.conf] ?? 0) + 1
console.log('  độ tin cậy:', JSON.stringify(byConf))
for (const w of warn) {
  console.log(`⚠ ${w.e.id}: ${w.problems.join(' | ')}`)
  if (w.rec) console.log(`    ${w.rec.src.map((s) => `${s.src} ${Math.round(s.kcal)}kcal "${s.name.slice(0, 50)}"`).join(' ; ')}`)
}
if (dry) process.exit(0)
writeFileSync(join(root, ownFile), ts)
writeFileSync(join(root, `docs/food-research/${meta.out}.md`), md)
console.log(`Đã ghi ${ownFile} và docs/food-research/${meta.out}.md`)

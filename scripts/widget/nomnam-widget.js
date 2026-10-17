// NomNam — widget màn hình chính iPhone (app Scriptable). Hướng dẫn cài: scripts/widget/README.md
// Giống thẻ tổng kết ở màn Hôm nay: calo đã ăn / còn lại, protein, carbs, fat, xơ — đã ăn, mục tiêu, còn thiếu.
// Công thức mục tiêu phải khớp src/lib/nutrition.ts (có test src/lib/widget.test.ts kiểm tra).

// ===== Cài đặt (sửa 2 dòng này) =====
const SUPABASE_URL = 'https://jaekhiuaybhsqtfsnuae.supabase.co'
const SUPABASE_KEY = 'DÁN_PUBLISHABLE_KEY_VÀO_ĐÂY' // VITE_SUPABASE_PUBLISHABLE_KEY trong .env (key sb_publishable_… vốn công khai)
const APP_URL = 'https://hoanganhkiet14021996.github.io/NomNam/' // bấm vào widget sẽ mở link này
const EMAIL_DOMAIN = 'namnguyen27.app' // phải khớp src/lib/auth.ts
const REFRESH_MINUTES = 15 // iOS có thể làm mới thưa hơn

// ===== Logic thuần (khớp app) =====
const GOAL_FACTOR = { cut: 0.82, maintain: 1, bulk: 1.1 }
const MIN_KCAL = 1200

function splitMacros(kcal, protein) {
  const fat = Math.round((kcal * 0.25) / 9)
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4))
  const fiber = Math.round((kcal / 1000) * 14)
  return { kcal, protein, carbs, fat, fiber }
}

/** p: hàng profiles (snake_case) → mục tiêu ngày, đã áp override (khớp calcTargets trong app). */
function calcTargets(p) {
  const bmrBase = 10 * p.weight_kg + 6.25 * p.height_cm - 5 * p.age
  const bmr = p.sex === 'male' ? bmrBase + 5 : bmrBase - 161
  const kcalAuto = Math.max(MIN_KCAL, Math.round(bmr * p.neat * GOAL_FACTOR[p.goal]))
  const o = p.overrides || {}
  const kcal = o.kcal ?? kcalAuto
  const protein = o.protein ?? Math.round(p.weight_kg * p.protein_per_kg)
  const split = splitMacros(kcal, protein)
  const fat = o.fat ?? split.fat
  const carbs = o.carbs ?? Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4))
  return { kcal, protein, carbs, fat, fiber: o.fiber ?? split.fiber }
}

function computeSummary(profile, foodRows, activityRows) {
  const targets = calcTargets(profile)
  const sum = (rows, k) => rows.reduce((s, r) => s + (Number(r[k]) || 0), 0)
  const exerciseKcal = sum(activityRows, 'kcal')
  const bonus = Math.round(exerciseKcal * ((profile.exercise_eat_back_pct ?? 50) / 100))
  const eaten = { kcal: sum(foodRows, 'kcal'), protein: sum(foodRows, 'protein'), carbs: sum(foodRows, 'carbs'), fat: sum(foodRows, 'fat'), fiber: sum(foodRows, 'fiber') }
  const budget = targets.kcal + bonus
  return {
    targets,
    eaten,
    exerciseKcal,
    eatBackPct: profile.exercise_eat_back_pct ?? 50,
    bonus,
    budget,
    remainingKcal: budget - eaten.kcal,
    // dương = còn thiếu, âm = đã vượt
    remaining: {
      protein: targets.protein - eaten.protein,
      carbs: targets.carbs - eaten.carbs,
      fat: targets.fat - eaten.fat,
      fiber: targets.fiber - eaten.fiber,
    },
  }
}

/** "Kiệt Hoàng" → "kiethoang@…" (khớp src/lib/auth.ts) */
function usernameToEmail(raw) {
  const u = String(raw)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^a-z0-9._-]/g, '')
  return `${u}@${EMAIL_DOMAIN}`
}

function localDateKey(d) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

// ===== Mạng =====
async function getJson(url, headers, body) {
  const req = new Request(url)
  req.headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...headers }
  if (body) {
    req.method = 'POST'
    req.body = JSON.stringify(body)
  }
  const json = await req.loadJSON()
  const code = req.response && req.response.statusCode
  if (code && code >= 400) throw new Error(json.error_description || json.msg || json.message || `Lỗi ${code}`)
  return json
}

async function loadToday(username, pin) {
  const auth = await getJson(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {}, { email: usernameToEmail(username), password: pin })
  const h = { Authorization: `Bearer ${auth.access_token}` }
  const date = localDateKey(new Date())
  const rest = `${SUPABASE_URL}/rest/v1`
  const [profiles, foods, acts] = await Promise.all([
    getJson(`${rest}/profiles?select=*&id=eq.${auth.user.id}`, h),
    getJson(`${rest}/food_logs?select=kcal,protein,carbs,fat,fiber&date=eq.${date}&deleted_at=is.null`, h),
    getJson(`${rest}/activity_logs?select=kcal&date=eq.${date}&deleted_at=is.null`, h),
  ])
  if (!profiles.length) throw new Error('Chưa có hồ sơ trên server — mở app NomNam và đăng nhập/đồng bộ trước')
  return computeSummary(profiles[0], foods, acts)
}

// ===== Đăng nhập (lưu trong Keychain của iPhone, chỉ nhập một lần trong app Scriptable) =====
async function askCredentials() {
  const a = new Alert()
  a.title = 'Đăng nhập NomNam'
  a.message = 'Tên và PIN 6 số như trong app. Được lưu trong Keychain của iPhone.'
  a.addTextField('Tên', Keychain.contains('nomnam-user') ? Keychain.get('nomnam-user') : '')
  a.addSecureTextField('PIN 6 số', '')
  a.addAction('Lưu')
  a.addCancelAction('Huỷ')
  if ((await a.presentAlert()) === -1) return null
  const user = a.textFieldValue(0).trim()
  const pin = a.textFieldValue(1).trim()
  if (!user || !/^\d{6}$/.test(pin)) return null
  Keychain.set('nomnam-user', user)
  Keychain.set('nomnam-pin', pin)
  return { user, pin }
}

async function getCredentials() {
  if (Keychain.contains('nomnam-user') && Keychain.contains('nomnam-pin')) {
    return { user: Keychain.get('nomnam-user'), pin: Keychain.get('nomnam-pin') }
  }
  return config.runsInWidget ? null : askCredentials()
}

// ===== Vẽ widget =====
// Màu chọn theo chế độ sáng/tối lúc vẽ (Color.dynamic không áp dụng được bên trong DrawContext)
const DARK = Device.isUsingDarkAppearance()
const pick = (light, dark) => new Color(DARK ? dark : light)
const C = {
  bg: pick('#FBF6EE', '#1C1412'),
  text: pick('#2A1815', '#F6E9D8'),
  sub: pick('#7A6660', '#BBA99C'),
  brand: pick('#6A201A', '#F6E9D8'),
  track: pick('#EADFD2', '#3A2B26'),
  warn: pick('#B45309', '#FBBF24'),
  ok: pick('#15803D', '#4ADE80'),
  protein: pick('#C2185B', '#F06292'),
  carbs: pick('#B45309', '#FBBF24'),
  fat: pick('#0369A1', '#38BDF8'),
  fiber: pick('#4D7C0F', '#A3E635'),
}

function addText(stack, text, size, color, weight) {
  const t = stack.addText(text)
  t.textColor = color
  t.font = weight === 'heavy' ? Font.heavySystemFont(size) : weight === 'bold' ? Font.boldSystemFont(size) : Font.systemFont(size)
  t.lineLimit = 1
  t.minimumScaleFactor = 0.7
  return t
}

function roundedPath(w, h) {
  const p = new Path()
  p.addRoundedRect(new Rect(0, 0, w, h), h / 2, h / 2)
  return p
}

function bar(pct, color, width, height) {
  const dc = new DrawContext()
  dc.size = new Size(width, height)
  dc.opaque = false
  dc.respectScreenScale = true
  dc.setFillColor(C.track)
  dc.addPath(roundedPath(width, height))
  dc.fillPath()
  if (pct > 0) {
    dc.setFillColor(color)
    dc.addPath(roundedPath(Math.max(height, Math.min(1, pct) * width), height))
    dc.fillPath()
  }
  return dc.getImage()
}

/** Vòng calo như CalorieRing trong app: số lớn ở giữa là calo còn lại (hoặc vượt). */
function ring(pct, color, size, over, remaining) {
  const dc = new DrawContext()
  dc.size = new Size(size, size)
  dc.opaque = false
  dc.respectScreenScale = true
  const line = size * 0.11
  const r = (size - line) / 2
  const c = size / 2
  dc.setLineWidth(line)
  dc.setStrokeColor(C.track)
  dc.strokeEllipse(new Rect(line / 2, line / 2, size - line, size - line))
  const p = Math.min(1, Math.max(0, pct))
  if (p > 0) {
    const steps = Math.max(2, Math.ceil(p * 120))
    const path = new Path()
    for (let i = 0; i <= steps; i++) {
      const a = -Math.PI / 2 + (i / steps) * p * 2 * Math.PI
      const pt = new Point(c + r * Math.cos(a), c + r * Math.sin(a))
      if (i === 0) path.move(pt)
      else path.addLine(pt)
    }
    dc.addPath(path)
    dc.setStrokeColor(color)
    dc.strokePath()
  }
  dc.setTextAlignedCenter()
  dc.setTextColor(C.sub)
  dc.setFont(Font.boldSystemFont(size * 0.095))
  dc.drawTextInRect(over ? 'VƯỢT' : 'CÒN LẠI', new Rect(0, c - size * 0.25, size, size * 0.13))
  dc.setTextColor(C.text)
  dc.setFont(Font.heavySystemFont(size * 0.2))
  dc.drawTextInRect(fmt(Math.abs(remaining)), new Rect(0, c - size * 0.13, size, size * 0.26))
  dc.setTextColor(C.sub)
  dc.setFont(Font.systemFont(size * 0.095))
  dc.drawTextInRect('kcal', new Rect(0, c + size * 0.12, size, size * 0.13))
  return dc.getImage()
}

/** "27 / 322g" + phần còn thiếu ("còn 295g" / "đạt ✓" / "vượt 12g"). good = true nếu vượt mục tiêu là tốt (đạm, xơ). */
function macroLine(m) {
  const left = m.target - m.eaten
  let note, noteColor
  if (left > 0.5) {
    note = `còn ${fmt(left)}g`
    noteColor = C.sub
  } else if (m.good) {
    note = 'đạt ✓'
    noteColor = C.ok
  } else {
    note = `vượt ${fmt(-left)}g`
    noteColor = C.warn
  }
  return { text: `${fmt(m.eaten)} / ${fmt(m.target)}g`, note, noteColor }
}

function addMacro(parent, m, width, big) {
  const l = macroLine(m)
  const s = parent.addStack()
  s.layoutVertically()
  const top = s.addStack()
  top.centerAlignContent()
  addText(top, m.label, big ? 12 : 11, m.color, 'bold')
  top.addSpacer()
  addText(top, l.text, big ? 12 : 10.5, C.text, 'bold')
  addText(top, ` · ${l.note}`, big ? 11 : 10, l.noteColor)
  s.addSpacer(2)
  const img = s.addImage(bar(m.target > 0 ? m.eaten / m.target : 0, m.color, width, big ? 8 : 6))
  img.imageSize = new Size(width, big ? 8 : 6)
  return s
}

function buildWidget(sum, family) {
  const w = new ListWidget()
  w.backgroundColor = C.bg
  w.url = APP_URL
  w.refreshAfterDate = new Date(Date.now() + REFRESH_MINUTES * 60 * 1000)
  const small = family === 'small'
  const large = family === 'large'
  w.setPadding(12, 14, 12, 14)

  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  const now = new Date()
  const head = w.addStack()
  head.centerAlignContent()
  addText(head, 'NomNam', 12, C.brand, 'heavy')
  head.addSpacer()
  addText(head, `${days[now.getDay()]} ${now.getDate()}/${now.getMonth() + 1}`, 11, C.sub)
  w.addSpacer(6)

  const over = sum.remainingKcal < 0
  const kcalColor = over ? C.warn : C.brand
  const kcalPct = sum.budget > 0 ? sum.eaten.kcal / sum.budget : 0
  const macros = [
    { label: 'Protein', eaten: sum.eaten.protein, target: sum.targets.protein, color: C.protein, good: true },
    { label: 'Carbs', eaten: sum.eaten.carbs, target: sum.targets.carbs, color: C.carbs, good: false },
    { label: 'Fat', eaten: sum.eaten.fat, target: sum.targets.fat, color: C.fat, good: false },
    { label: 'Chất xơ', eaten: sum.eaten.fiber, target: sum.targets.fiber, color: C.fiber, good: true },
  ]

  const ringSize = small ? 92 : large ? 120 : 104
  const ringImg = w.addStack()

  if (small) {
    // nhỏ: vòng calo + protein (mục tiêu chính)
    ringImg.centerAlignContent()
    ringImg.addSpacer()
    const img = ringImg.addImage(ring(kcalPct, kcalColor, ringSize, over, sum.remainingKcal))
    img.imageSize = new Size(ringSize, ringSize)
    ringImg.addSpacer()
    w.addSpacer(6)
    addMacro(w, macros[0], 125, false)
    return w
  }

  // vừa/lớn: vòng calo bên trái; bên phải đã ăn / mục tiêu / quỹ ngày (lớn) hoặc macro (vừa)
  ringImg.centerAlignContent()
  const img = ringImg.addImage(ring(kcalPct, kcalColor, ringSize, over, sum.remainingKcal))
  img.imageSize = new Size(ringSize, ringSize)
  ringImg.addSpacer(14)
  const right = ringImg.addStack()
  right.layoutVertically()
  if (large) {
    const row = (label, value, strong) => {
      const r = right.addStack()
      addText(r, label, 12, strong ? C.text : C.sub, strong ? 'bold' : undefined)
      r.addSpacer()
      addText(r, value, strong ? 14 : 12, C.text, 'bold')
      right.addSpacer(4)
    }
    row('Mục tiêu', fmt(sum.targets.kcal))
    row('Đã ăn', `− ${fmt(sum.eaten.kcal)}`)
    row(`Tập (${sum.eatBackPct}%)`, `+ ${fmt(sum.bonus)}`)
    row('Quỹ ngày', fmt(sum.budget), true)
  } else {
    macros.forEach((m, i) => {
      addMacro(right, m, 150, false)
      if (i < macros.length - 1) right.addSpacer(5)
    })
  }

  if (large) {
    w.addSpacer(12)
    macros.forEach((m, i) => {
      addMacro(w, m, 300, true)
      if (i < macros.length - 1) w.addSpacer(9)
    })
  }
  return w
}

function buildMessage(text) {
  const w = new ListWidget()
  w.backgroundColor = C.bg
  w.url = APP_URL
  addText(w, 'NomNam', 12, C.brand, 'heavy')
  w.addSpacer(6)
  const t = w.addText(text)
  t.textColor = C.sub
  t.font = Font.systemFont(12)
  w.refreshAfterDate = new Date(Date.now() + 5 * 60 * 1000)
  return w
}

async function main() {
  const family = config.widgetFamily || 'medium'
  let widget
  try {
    const cred = await getCredentials()
    if (!cred) widget = buildMessage('Chạy script này một lần trong app Scriptable để đăng nhập.')
    else widget = buildWidget(await loadToday(cred.user, cred.pin), family)
  } catch (e) {
    widget = buildMessage(`Không tải được: ${e.message || e}`)
  }
  if (config.runsInWidget) Script.setWidget(widget)
  else if (family === 'large') await widget.presentLarge()
  else await widget.presentMedium()
  Script.complete()
}

if (typeof Script !== 'undefined') await main()
else module.exports = { calcTargets, computeSummary, usernameToEmail, localDateKey, fmt }

import { z } from 'zod'
import { FOODS } from '@/data/foods.vn'
import { fmtG } from '@/lib/nutrition'
import type { CookingMethod, Food, FoodRole } from '@/types'

export const ROLES = ['carb', 'protein', 'veg', 'fat', 'sauce', 'drink', 'other'] as const satisfies readonly FoodRole[]
export const COOKING = ['raw', 'boiled', 'steamed', 'grilled', 'fried', 'stir_fried', 'braised', 'soup', 'other'] as const satisfies readonly CookingMethod[]

const OptionSchema = z.object({
  label: z.string().min(1),
  /** chọn đáp án này → đổi sang món này trong bảng (rỗng = giữ nguyên) */
  foodId: z.string().catch(''),
  /** chọn đáp án này → đổi gram (0 = giữ nguyên) */
  grams: z.coerce.number().min(0).max(5000).catch(0),
})
export type AiOption = z.infer<typeof OptionSchema>

const QuestionSchema = z.object({
  text: z.string().min(1),
  options: z.array(OptionSchema).min(2).max(4),
})
export type AiQuestion = z.infer<typeof QuestionSchema>

export const AiItemSchema = z.object({
  name: z.string().min(1),
  emoji: z.string().catch('🍽️'),
  role: z.enum(ROLES).catch('other'),
  /** loại cụ thể: "thịt heo ba chỉ", "cơm tấm", "bún tươi" */
  kind: z.string().catch(''),
  cooking: z.enum(COOKING).catch('other'),
  grams: z.coerce.number().min(0).max(5000),
  kcal: z.coerce.number().min(0).max(10000),
  protein: z.coerce.number().min(0).max(1000),
  carbs: z.coerce.number().min(0).max(2000),
  fat: z.coerce.number().min(0).max(1000),
  fiber: z.coerce.number().min(0).max(300).catch(0),
  /** id món trong bảng tham chiếu nếu khớp; rỗng nếu không có trong bảng */
  foodId: z.string().catch(''),
  /** tối đa 3 id món gần nhất trong bảng (để người dùng chọn lại) */
  candidates: z.array(z.string()).catch([]),
  confidence: z.enum(['high', 'medium', 'low']).catch('medium'),
  /** câu hỏi lại khi AI phân vân và đáp án làm lệch kcal đáng kể */
  question: QuestionSchema.nullish().catch(null),
})
export type AiItem = z.infer<typeof AiItemSchema>

const ResultSchema = z.object({
  dishName: z.string().catch(''),
  items: z.array(AiItemSchema),
  note: z.string().optional().catch(undefined),
})
export type AiResult = z.infer<typeof ResultSchema>

const n = { type: 'number' } as const
const s = { type: 'string' } as const
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    dishName: { ...s, description: 'Tên tổng của bữa/món, vd "Cơm tấm sườn bì chả"' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { ...s, description: 'Tên thành phần tiếng Việt, ngắn gọn' },
          emoji: { ...s, description: 'Một emoji minh hoạ' },
          role: { ...s, enum: [...ROLES], description: 'Vai trò: tinh bột/đạm/rau/chất béo/nước sốt/đồ uống/khác' },
          kind: { ...s, description: 'Loại cụ thể, vd "thịt heo ba chỉ", "ức gà", "cơm tấm", "bún tươi"' },
          cooking: { ...s, enum: [...COOKING], description: 'Cách nấu' },
          grams: { ...n, description: 'Khối lượng ăn được (gram, đã nấu chín), đồ uống tính ml' },
          kcal: n,
          protein: n,
          carbs: n,
          fat: n,
          fiber: n,
          foodId: { ...s, description: 'id món trong bảng tham chiếu nếu khớp đúng món; chuỗi rỗng nếu không có' },
          candidates: { type: 'array', items: s, description: 'Tối đa 3 id gần nhất trong bảng, khớp nhất đứng đầu' },
          confidence: { ...s, enum: ['high', 'medium', 'low'] },
          question: {
            type: 'object',
            description: 'CHỈ khi phân vân và đáp án làm lệch kcal ≥ 15%',
            properties: {
              text: { ...s, description: 'Câu hỏi ngắn, vd "Thịt này là?"' },
              options: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    label: { ...s, description: 'Đáp án ngắn, vd "Ba chỉ"' },
                    foodId: { ...s, description: 'id món trong bảng ứng với đáp án, rỗng nếu không đổi món' },
                    grams: { ...n, description: 'gram ứng với đáp án, 0 nếu không đổi gram' },
                  },
                  required: ['label', 'foodId', 'grams'],
                },
              },
            },
            required: ['text', 'options'],
          },
        },
        required: ['name', 'emoji', 'role', 'kind', 'cooking', 'grams', 'kcal', 'protein', 'carbs', 'fat', 'fiber', 'foodId', 'candidates', 'confidence'],
      },
    },
    note: { ...s, description: 'Ghi chú ngắn nếu có giả định quan trọng' },
  },
  required: ['dishName', 'items'],
}

/**
 * Bảng tham chiếu gửi kèm để AI chọn đúng id. Chỉ gửi id + tên + khẩu phần (không gửi số dinh dưỡng — app tự tính
 * từ bảng) để prompt gọn khi bảng có hàng trăm món. Món phức hợp ghi "(món)" để AI không tách nhỏ / cộng dầu lần nữa.
 */
export function buildReference(foods: readonly Food[]): string {
  return foods
    .map((f) => {
      const serving = f.servings[0] && f.servings[0].grams !== 100 ? ` · ${f.servings[0].label}=${fmtG(f.servings[0].grams)}g` : ''
      return `[${f.id}] ${f.name}${f.category === 'dish' ? ' (món)' : ''}${serving}`
    })
    .join('\n')
}

export interface PortionHint {
  name: string
  grams: number
}

const buildSystem = (foods: readonly Food[], hints: readonly PortionHint[]) => `Bạn là chuyên gia dinh dưỡng, chuyên nhận diện món ăn Việt Nam cho người tập gym.
Nhiệm vụ: tách bữa ăn thành TỪNG THÀNH PHẦN riêng (vd: cơm, sườn nướng, bì, chả trứng, đồ chua), cho biết vai trò, loại cụ thể, cách nấu và ước lượng gram ĐÃ NẤU của phần ăn.
Quy tắc:
- Việc quan trọng nhất: nhận diện ĐÚNG loại (thịt gì, phần nào, tinh bột gì) và ước lượng ĐÚNG gram. Dinh dưỡng app sẽ tự tính từ bảng tham chiếu.
- Khi thành phần khớp ĐÚNG một dòng trong bảng (dạng [id] Tên: …), điền foodId = id đó. Không chắc thì để foodId rỗng.
- candidates: tối đa 3 id trong bảng gần nhất với thành phần (kể cả khi foodId rỗng), khớp nhất đứng đầu.
- kcal/protein/carbs/fat/fiber: TỔNG cho phần ăn (không phải trên 100g), ước lượng theo USDA / Viện Dinh dưỡng (app sẽ thay bằng số của bảng khi khớp foodId).
- Món phức hợp có trong bảng (đánh dấu "món") thì giữ nguyên 1 thành phần, không tách nhỏ.
- Dầu mỡ ẩn: thành phần chiên/xào (cooking = fried / stir_fried) mà dòng khớp trong bảng là nguyên liệu (không phải "món" và không ghi chiên/xào) → thêm 1 thành phần riêng "Dầu ăn" (foodId "dau-an", role "fat"): xào ≈ 5–10g, chiên ≈ 10–15g mỗi phần.
- question: chỉ hỏi khi phân vân giữa các lựa chọn làm lệch kcal ≥ 15% (vd ba chỉ hay nạc, cơm trắng hay cơm chiên, ít hay nhiều cơm). 2–4 đáp án ngắn, mỗi đáp án kèm foodId và/hoặc grams tương ứng. Không hỏi thì bỏ trống question.
- "1 chén cơm" ≈ 150g, "1 tô phở" ≈ 500g, "1 quả trứng" ≈ 50g, "1 muỗng whey" ≈ 30g.${
  hints.length
    ? `\n- Khẩu phần quen của người dùng này (ưu tiên dùng khi ảnh không rõ kích thước): ${hints.map((h) => `${h.name} ≈ ${Math.round(h.grams)}g`).join('; ')}.`
    : ''
}
- Không chắc thì chọn ước lượng hợp lý nhất và đặt confidence = "low". Không bịa thành phần không có.
- Nếu ảnh/mô tả không phải đồ ăn, trả items rỗng và giải thích trong note.

Bảng món của app ([id] tên · khẩu phần thường gặp):
${buildReference(foods)}`

export interface AnalyzeInput {
  apiKey: string
  model: string
  text?: string
  image?: { base64: string; mimeType: string }
  /** Bảng món gửi kèm làm tham chiếu (gồm món riêng); mặc định là bảng có sẵn. */
  foods?: readonly Food[]
  /** Khẩu phần quen của người dùng (từ lịch sử log). */
  portionHints?: readonly PortionHint[]
  /** Model dự phòng: dùng khi model chính quá tải / hết lượt. */
  fallbackModel?: string
  onFallback?: (model: string) => void
}

/** Key giả chỉ dùng khi chạy `npm run dev` để thử giao diện AI mà không gọi Gemini. */
export const MOCK_API_KEY = 'mock-key-for-local-testing'

export async function analyzeMeal({ apiKey, model, text, image, foods = FOODS, portionHints = [], fallbackModel, onFallback }: AnalyzeInput): Promise<AiResult> {
  if (!apiKey) throw new Error('Chưa có Gemini API key. Vào tab Mục tiêu → AI để nhập key.')
  if (import.meta.env.DEV && apiKey === MOCK_API_KEY) {
    const { mockAnalyze } = await import('./mock')
    return parseResult(await mockAnalyze(text))
  }
  // SDK khá nặng → chỉ tải khi thực sự dùng AI
  const { GoogleGenAI } = await import('@google/genai')
  const ai = new GoogleGenAI({ apiKey })
  const parts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] = []
  if (image) parts.push({ inlineData: { data: image.base64, mimeType: image.mimeType } })
  parts.push({
    text: image
      ? `Phân tích bữa ăn trong ảnh.${text ? ` Thông tin thêm từ người dùng: ${text}` : ''}`
      : `Bữa ăn người dùng mô tả: ${text}`,
  })

  const models = [model, ...(fallbackModel && fallbackModel !== model ? [fallbackModel] : [])]
  let raw: string | undefined
  let firstError: unknown
  for (const [i, m] of models.entries()) {
    try {
      raw = await generateWithRetry(ai, m, parts, buildSystem(foods, portionHints))
      if (i > 0) onFallback?.(m)
      break
    } catch (e) {
      firstError ??= e
      // Chỉ chuyển sang model dự phòng khi lỗi là do tải/quota (mỗi model có pool riêng); lỗi key, mạng… thì dừng
      if (i === models.length - 1 || !isSwitchable(e)) throw new Error(friendlyError(i > 0 && /not found|404/i.test(errMsg(e)) ? firstError : e))
    }
  }
  if (!raw) throw new Error('AI không trả về kết quả. Thử lại nhé.')

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    throw new Error('AI trả về dữ liệu không đọc được. Thử lại nhé.')
  }
  return parseResult(json)
}

export function parseResult(json: unknown): AiResult {
  const parsed = ResultSchema.safeParse(json)
  if (!parsed.success) throw new Error('AI trả về dữ liệu sai định dạng. Thử lại nhé.')
  return parsed.data
}

const MAX_RETRIES = 2

type Part = { text: string } | { inlineData: { data: string; mimeType: string } }

async function generateWithRetry(ai: InstanceType<typeof import('@google/genai').GoogleGenAI>, model: string, parts: Part[], systemInstruction: string): Promise<string | undefined> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts }],
        config: { systemInstruction, responseMimeType: 'application/json', responseJsonSchema: RESPONSE_SCHEMA, temperature: 0.2 },
      })
      return res.text
    } catch (e) {
      const wait = attempt < MAX_RETRIES ? retryDelayMs(e, attempt) : null
      if (wait === null) throw e
      await new Promise((r) => setTimeout(r, wait))
    }
  }
}

/** Lỗi nên thử model khác: quá tải, hết lượt, hoặc model không tồn tại. */
export function isSwitchable(e: unknown): boolean {
  return /503|UNAVAILABLE|overloaded|high demand|\b500\b|INTERNAL|deadline|429|RESOURCE_EXHAUSTED|quota|not found|404/i.test(errMsg(e))
}

/** Lọc danh sách model của API: chỉ model Gemini viết được chữ từ ảnh/chữ (bỏ tts, ảnh, embedding, live…). */
export function pickGeminiModels(list: { name?: string; supportedGenerationMethods?: string[] }[]): string[] {
  const ids = list
    .filter((m) => m.name?.startsWith('models/gemini') && m.supportedGenerationMethods?.includes('generateContent'))
    .map((m) => m.name!.replace(/^models\//, ''))
    .filter((id) => !/tts|image|embedding|live|audio|robotics|computer-use|learnlm|aqa/i.test(id))
  return [...new Set(ids)].sort()
}

/** Hỏi Google xem key này dùng được những model nào. */
export async function listModels(apiKey: string): Promise<string[]> {
  if (!apiKey) throw new Error('Nhập Gemini API key trước.')
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=${encodeURIComponent(apiKey)}`)
  if (!res.ok) throw new Error(res.status === 400 || res.status === 403 ? 'Gemini API key không hợp lệ.' : `Không lấy được danh sách model (${res.status}).`)
  const json = (await res.json()) as { models?: { name?: string; supportedGenerationMethods?: string[] }[] }
  return pickGeminiModels(json.models ?? [])
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/** Số giây Gemini bảo chờ ("Please retry in 23.4s" / "retryDelay":"23s"), null nếu không có. */
export function suggestedRetrySeconds(e: unknown): number | null {
  const m = errMsg(e).match(/retry in ([\d.]+)s|"retryDelay":\s*"([\d.]+)s"/i)
  return m ? Math.ceil(Number(m[1] ?? m[2])) : null
}

/** Hết lượt theo NGÀY (không đáng thử lại) hay chỉ theo phút. */
function isDailyQuota(msg: string): boolean {
  return /PerDay|per day|daily/i.test(msg)
}

/** Lỗi tạm thời → trả số ms chờ rồi thử lại; null = không thử lại. Quá tải (503) lùi dần 1.5s, 3s, 6s; hết lượt/phút chờ theo gợi ý của Gemini nếu ≤ 20s. */
export function retryDelayMs(e: unknown, attempt: number): number | null {
  const msg = errMsg(e)
  if (/503|UNAVAILABLE|overloaded|high demand|\b500\b|INTERNAL|deadline/i.test(msg)) return 1500 * 2 ** attempt + Math.random() * 500
  if (/429|RESOURCE_EXHAUSTED|quota/i.test(msg) && !isDailyQuota(msg)) {
    const s = suggestedRetrySeconds(e)
    if (s !== null && s <= 20) return (s + 1) * 1000
  }
  return null
}

export function friendlyError(e: unknown): string {
  const msg = errMsg(e)
  if (/API key not valid|API_KEY_INVALID|PERMISSION_DENIED|401|403/i.test(msg)) return 'Gemini API key không hợp lệ.'
  if (/429|RESOURCE_EXHAUSTED|quota/i.test(msg)) {
    if (isDailyQuota(msg)) return 'Hết lượt gọi Gemini trong ngày (miễn phí). Lượt được làm mới vào khoảng 14:00 giờ Việt Nam.'
    const s = suggestedRetrySeconds(e)
    return s ? `Gửi hơi nhanh nên Gemini giới hạn theo phút. Chờ khoảng ${s} giây rồi thử lại.` : 'Gửi hơi nhanh nên Gemini giới hạn theo phút. Chờ ~1 phút rồi thử lại.'
  }
  if (/503|UNAVAILABLE|overloaded|high demand/i.test(msg)) return 'Gemini đang quá tải (không phải lỗi của bạn). Đã tự thử lại vài lần, bấm phân tích lại sau ít phút.'
  if (/not found|404/i.test(msg)) return 'Không tìm thấy model Gemini. Kiểm tra tên model trong tab Mục tiêu.'
  if (/fetch|network|Failed to fetch/i.test(msg)) return 'Mất kết nối mạng.'
  return `Lỗi AI: ${msg}`
}

/** Thu nhỏ ảnh còn ≤ maxSide px (JPEG) trước khi gửi → nhanh hơn, tốn ít quota hơn. */
export async function prepareImage(file: File, maxSide = 1024): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Không đọc được ảnh'))
      el.src = url
    })
    const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.width * scale)
    canvas.height = Math.round(img.height * scale)
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    return { base64: dataUrl.split(',')[1], mimeType: 'image/jpeg', previewUrl: dataUrl }
  } finally {
    URL.revokeObjectURL(url)
  }
}

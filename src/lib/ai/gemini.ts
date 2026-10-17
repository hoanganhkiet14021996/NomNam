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
}

/** Key giả chỉ dùng khi chạy `npm run dev` để thử giao diện AI mà không gọi Gemini. */
export const MOCK_API_KEY = 'mock-key-for-local-testing'

export async function analyzeMeal({ apiKey, model, text, image, foods = FOODS, portionHints = [] }: AnalyzeInput): Promise<AiResult> {
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

  let raw: string | undefined
  try {
    const res = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction: buildSystem(foods, portionHints),
        responseMimeType: 'application/json',
        responseJsonSchema: RESPONSE_SCHEMA,
        temperature: 0.2,
      },
    })
    raw = res.text
  } catch (e) {
    throw new Error(friendlyError(e))
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

function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e)
  if (/API key not valid|API_KEY_INVALID|PERMISSION_DENIED|401|403/i.test(msg)) return 'Gemini API key không hợp lệ.'
  if (/429|RESOURCE_EXHAUSTED|quota/i.test(msg)) return 'Hết lượt gọi Gemini miễn phí, thử lại sau ít phút.'
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

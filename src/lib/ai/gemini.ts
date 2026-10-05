import { z } from 'zod'
import { FOODS } from '@/data/foods.vn'
import { fmtG } from '@/lib/nutrition'

export const AiItemSchema = z.object({
  name: z.string().min(1),
  emoji: z.string().catch('🍽️'),
  grams: z.coerce.number().min(0).max(5000),
  kcal: z.coerce.number().min(0).max(10000),
  protein: z.coerce.number().min(0).max(1000),
  carbs: z.coerce.number().min(0).max(2000),
  fat: z.coerce.number().min(0).max(1000),
  fiber: z.coerce.number().min(0).max(300).catch(0),
  confidence: z.enum(['high', 'medium', 'low']).catch('medium'),
})
export type AiItem = z.infer<typeof AiItemSchema>

const ResultSchema = z.object({
  items: z.array(AiItemSchema),
  note: z.string().optional().catch(undefined),
})
export type AiResult = z.infer<typeof ResultSchema>

const n = { type: 'number' } as const
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Tên món tiếng Việt, ngắn gọn' },
          emoji: { type: 'string', description: 'Một emoji minh hoạ' },
          grams: { ...n, description: 'Khối lượng ăn được (gram), đồ uống tính ml' },
          kcal: n,
          protein: n,
          carbs: n,
          fat: n,
          fiber: n,
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
        },
        required: ['name', 'emoji', 'grams', 'kcal', 'protein', 'carbs', 'fat', 'fiber', 'confidence'],
      },
    },
    note: { type: 'string', description: 'Ghi chú ngắn nếu có giả định quan trọng' },
  },
  required: ['items'],
}

/** Bảng tham chiếu gửi kèm để AI ra số nhất quán với DB của app. */
const REFERENCE = FOODS.map((f) => {
  const p = f.per100
  const serving = f.servings[0] && f.servings[0].grams !== 100 ? `; ${f.servings[0].label}=${f.servings[0].grams}g` : ''
  return `${f.name}: ${Math.round(p.kcal)}kcal P${fmtG(p.protein)} C${fmtG(p.carbs)} F${fmtG(p.fat)} X${fmtG(p.fiber)}/100g${serving}`
}).join('\n')

const SYSTEM = `Bạn là chuyên gia dinh dưỡng, chuyên ước lượng món ăn Việt Nam cho người tập gym.
Nhiệm vụ: tách bữa ăn thành TỪNG MÓN/THÀNH PHẦN riêng (vd: cơm, thịt kho, canh, rau), ước lượng gram và dinh dưỡng của phần ăn đó.
Quy tắc:
- Số liệu là TỔNG cho phần ăn (không phải trên 100g). protein/carbs/fat/fiber tính bằng gram.
- Ưu tiên dùng bảng tham chiếu bên dưới khi món có trong bảng; món khác dùng hiểu biết chuẩn (USDA, Viện Dinh dưỡng).
- Tính cả dầu mỡ khi chiên/xào, nước sốt, nước lèo nếu có ăn/húp.
- "1 chén cơm" ≈ 150g, "1 tô phở" ≈ 500g, "1 quả trứng" ≈ 50g, "1 muỗng whey" ≈ 30g.
- Nếu không chắc, chọn ước lượng hợp lý nhất và đặt confidence = "low". Không bịa món không có.
- Nếu ảnh/mô tả không phải đồ ăn, trả items rỗng và giải thích trong note.

Bảng tham chiếu (trên 100g):
${REFERENCE}`

export interface AnalyzeInput {
  apiKey: string
  model: string
  text?: string
  image?: { base64: string; mimeType: string }
}

export async function analyzeMeal({ apiKey, model, text, image }: AnalyzeInput): Promise<AiResult> {
  if (!apiKey) throw new Error('Chưa có Gemini API key. Vào tab Mục tiêu → AI để nhập key.')
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
        systemInstruction: SYSTEM,
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

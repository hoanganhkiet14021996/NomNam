import { useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { ArrowLeft, Camera, ImagePlus, KeyRound, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { MacroInline } from '@/components/MacroBar'
import { analyzeMeal, prepareImage } from '@/lib/ai/gemini'
import { reviewNutrients, roleToCategory, toReviewItem, type ReviewItem } from '@/lib/ai/match'
import { fmtKcal, sumNutrients } from '@/lib/nutrition'
import { cn } from '@/lib/utils'
import { MEAL_LABEL, portionHints, usualPortions } from '@/store/derive'
import { useAllFoods } from '@/store/hooks'
import { useSettings } from '@/store/settings'
import { useAppStore } from '@/store/useAppStore'
import type { MealType, Nutrients } from '@/types'
import { AiReviewItem } from './AiReviewItem'

export interface AiConfirmedItem extends Nutrients {
  name: string
  emoji: string
  grams: number
  foodId: string | null
}

const EXAMPLES = ['1 chén cơm, 150g ức gà áp chảo, rau muống xào', 'phở bò tái, 1 ly cà phê sữa đá', '3 trứng luộc, 2 lát bánh mì đen, 1 muỗng whey với sữa tươi không đường']

export function AiLogView({
  meal,
  onBack,
  onConfirm,
}: {
  meal: MealType
  onBack: () => void
  onConfirm: (items: AiConfirmedItem[]) => void
}) {
  const { geminiKey, geminiModel, setGemini } = useSettings()
  const foods = useAllFoods()
  const foodLogs = useAppStore((s) => s.foodLogs)
  const addCustomFood = useAppStore((s) => s.addCustomFood)
  const noteFoodRequests = useAppStore((s) => s.noteFoodRequests)
  const usual = useMemo(() => usualPortions(foodLogs), [foodLogs])
  const [mode, setMode] = useState<'text' | 'photo'>('text')
  const [text, setText] = useState('')
  const [image, setImage] = useState<{ base64: string; mimeType: string; previewUrl: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ReviewItem[] | null>(null)
  const [note, setNote] = useState<string | undefined>()
  const [dishName, setDishName] = useState('')
  const [keyDraft, setKeyDraft] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await analyzeMeal({
        apiKey: geminiKey,
        model: geminiModel,
        text: text.trim() || undefined,
        foods,
        portionHints: portionHints(usual),
        image: mode === 'photo' && image ? { base64: image.base64, mimeType: image.mimeType } : undefined,
      })
      setNote(res.note)
      setDishName(res.dishName)
      setItems(res.items.map((raw, i) => toReviewItem(raw, foods, i)))
      if (!res.items.length) setError(res.note || 'AI không nhận ra món ăn nào.')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  const onFile = async (file?: File) => {
    if (!file) return
    setError(null)
    try {
      setImage(await prepareImage(file))
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  // ── Chưa có API key ─────────────────────────────────
  if (!geminiKey) {
    return (
      <div className="space-y-4 px-4 pb-6 pt-1">
        <Header onBack={onBack} title="Ghi bằng AI" />
        <div className="space-y-3 rounded-2xl border bg-card p-4">
          <div className="flex items-center gap-2 font-semibold">
            <KeyRound className="h-4 w-4 text-primary" /> Cần Gemini API key (miễn phí)
          </div>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              Mở{' '}
              <a className="font-semibold text-primary underline" href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
                aistudio.google.com/apikey
              </a>
            </li>
            <li>Bấm "Create API key", copy và dán vào đây.</li>
          </ol>
          <div className="flex gap-2">
            <Input type="password" placeholder="AIza…" value={keyDraft} onChange={(e) => setKeyDraft(e.target.value)} />
            <Button onClick={() => setGemini(keyDraft)} disabled={keyDraft.trim().length < 20}>
              Lưu
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Key chỉ lưu trên thiết bị này, gửi thẳng tới Google, không qua máy chủ nào khác.</p>
        </div>
      </div>
    )
  }

  // ── Xem lại kết quả ─────────────────────────────────
  if (items && items.length) {
    const total = sumNutrients(items.map(reviewNutrients))
    const unanswered = items.filter((it) => it.question && !it.answer).length
    const confirm = () => {
      const out: AiConfirmedItem[] = items.map((it) => {
        const n = reviewNutrients(it)
        const name = it.name.trim() || 'Món AI'
        let foodId = it.food?.id ?? null
        if (!it.food && it.saveCustom) {
          foodId = addCustomFood({
            name,
            emoji: it.emoji,
            category: roleToCategory(it.role),
            per100: it.ai.per100,
            servings: [{ label: '1 phần', grams: it.grams }],
            defaultGrams: it.grams,
            aliases: it.kind ? [it.kind] : [],
          }).id
        }
        return { name, emoji: it.emoji, grams: Math.round(it.grams), foodId, ...n }
      })
      // Món chưa có trong bảng (kể cả vừa lưu thành món riêng) → chờ research để bổ sung số chuẩn
      const requests = items
        .filter((it) => !it.food)
        .map((it) => ({ name: it.name.trim() || 'Món AI', emoji: it.emoji, role: it.role, kind: it.kind, cooking: it.cooking, per100: it.ai.per100, grams: it.grams }))
      if (requests.length) {
        noteFoodRequests(requests)
        toast.message(`${requests.length} món chưa có trong bảng`, { description: 'Đã ghi vào Mục tiêu → Món chờ bổ sung.' })
      }
      onConfirm(out)
    }
    return (
      <div className="space-y-3 px-4 pb-6 pt-1">
        <Header onBack={() => setItems(null)} title="Kiểm tra lại" />
        {dishName && <p className="px-1 text-sm font-semibold">{dishName}</p>}
        {note && <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">💡 {note}</p>}
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((it, i) => (
              <AiReviewItem
                key={it.key}
                item={it}
                foods={foods}
                usual={usual}
                onChange={(next) => setItems((arr) => arr!.map((x, j) => (j === i ? next : x)))}
                onRemove={() => setItems((arr) => arr!.filter((_, j) => j !== i))}
              />
            ))}
          </AnimatePresence>
        </ul>
        <div className="sticky bottom-0 -mx-4 space-y-2 border-t bg-background px-4 pt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold">Tổng</span>
            <span className="num text-lg font-extrabold">{fmtKcal(total.kcal)} kcal</span>
          </div>
          <MacroInline {...total} className="justify-end" />
          {unanswered > 0 && <p className="text-xs text-warning">Còn {unanswered} câu hỏi chưa trả lời — đang dùng lựa chọn của AI.</p>}
          <Button size="lg" className="w-full" onClick={confirm}>
            Thêm {items.length} món vào {MEAL_LABEL[meal].toLowerCase()}
          </Button>
        </div>
      </div>
    )
  }

  // ── Nhập ảnh / chữ ──────────────────────────────────
  const canRun = mode === 'text' ? text.trim().length >= 2 : !!image
  return (
    <div className="space-y-4 px-4 pb-6 pt-1">
      <Header onBack={onBack} title="Ghi bằng AI" />
      <Segmented
        value={mode}
        onChange={(m) => {
          setMode(m)
          setError(null)
        }}
        options={[
          { value: 'text', label: '✍️ Gõ mô tả' },
          { value: 'photo', label: '📷 Chụp ảnh' },
        ]}
      />

      {mode === 'photo' && (
        <>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          {image ? (
            <div className="relative overflow-hidden rounded-2xl border">
              <img src={image.previewUrl} alt="Ảnh bữa ăn" className="max-h-64 w-full object-cover" />
              <Button size="sm" variant="secondary" className="absolute bottom-2 right-2" onClick={() => fileRef.current?.click()}>
                <Camera /> Chụp lại
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm font-semibold">Chụp hoặc chọn ảnh bữa ăn</span>
            </button>
          )}
        </>
      )}

      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={mode === 'text' ? 4 : 2}
          placeholder={mode === 'text' ? 'VD: 1 chén cơm, 150g ức gà, 2 trứng luộc, rau luộc' : 'Ghi chú thêm (không bắt buộc): vd "ăn hết nước", "ít cơm"'}
          aria-label="Mô tả bữa ăn"
          className="w-full resize-none rounded-2xl border bg-card p-3 text-base outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
        />
        {mode === 'text' && !text && (
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setText(ex)}
                className="rounded-full bg-muted px-3 py-1 text-left text-xs text-muted-foreground hover:text-foreground"
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <Button size="lg" className={cn('w-full')} disabled={!canRun || loading} onClick={run}>
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> AI đang phân tích…
          </>
        ) : (
          <>
            <Sparkles /> Phân tích
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">AI chỉ ước lượng — bạn sẽ được sửa gram trước khi lưu.</p>
    </div>
  )
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="Quay lại">
        <ArrowLeft />
      </Button>
      <h2 className="text-base font-bold">{title}</h2>
    </div>
  )
}

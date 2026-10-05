import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, Camera, ImagePlus, KeyRound, Loader2, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Segmented } from '@/components/ui/segmented'
import { MacroInline } from '@/components/MacroBar'
import { NumberField } from '@/components/NumberField'
import { analyzeMeal, prepareImage, type AiItem } from '@/lib/ai/gemini'
import { fmtKcal, multiplyNutrients, pickNutrients, sumNutrients } from '@/lib/nutrition'
import { cn } from '@/lib/utils'
import { MEAL_LABEL } from '@/store/derive'
import { useSettings } from '@/store/settings'
import type { MealType, Nutrients } from '@/types'

export interface AiConfirmedItem extends Nutrients {
  name: string
  emoji: string
  grams: number
}

interface ReviewItem extends AiItem {
  /** gram gốc AI ước lượng — dùng để scale dinh dưỡng khi người dùng sửa gram */
  baseGrams: number
  base: Nutrients
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
  const [mode, setMode] = useState<'text' | 'photo'>('text')
  const [text, setText] = useState('')
  const [image, setImage] = useState<{ base64: string; mimeType: string; previewUrl: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ReviewItem[] | null>(null)
  const [note, setNote] = useState<string | undefined>()
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
        image: mode === 'photo' && image ? { base64: image.base64, mimeType: image.mimeType } : undefined,
      })
      setNote(res.note)
      setItems(res.items.map((it) => ({ ...it, baseGrams: it.grams || 1, base: pickNutrients(it) })))
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
    const total = sumNutrients(items.map(pickNutrients))
    return (
      <div className="space-y-3 px-4 pb-6 pt-1">
        <Header onBack={() => setItems(null)} title="Kiểm tra lại" />
        {note && <p className="rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">💡 {note}</p>}
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((it, i) => (
              <motion.li
                key={i + it.name}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-2 rounded-2xl border bg-card p-3"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl" aria-hidden>
                    {it.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <input
                      value={it.name}
                      aria-label="Tên món"
                      onChange={(e) => setItems((arr) => arr!.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                      className="w-full bg-transparent text-sm font-semibold outline-none"
                    />
                    <MacroInline {...it} />
                  </div>
                  <div className="text-right">
                    <div className="num text-sm font-bold">{fmtKcal(it.kcal)} kcal</div>
                    {it.confidence === 'low' && <div className="text-[10px] font-semibold text-warning">ước lượng thô</div>}
                  </div>
                  <button
                    type="button"
                    aria-label={`Bỏ ${it.name}`}
                    onClick={() => setItems((arr) => arr!.filter((_, j) => j !== i))}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <NumberField
                  value={Math.round(it.grams)}
                  onChange={(g) =>
                    setItems((arr) =>
                      arr!.map((x, j) => (j === i ? { ...x, grams: g, ...multiplyNutrients(x.base, g / x.baseGrams) } : x)),
                    )
                  }
                  step={10}
                  min={1}
                  max={5000}
                  suffix="g"
                  ariaLabel={`Khối lượng ${it.name}`}
                  className="h-10"
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <div className="sticky bottom-0 -mx-4 space-y-2 border-t bg-background px-4 pt-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold">Tổng</span>
            <span className="num text-lg font-extrabold">{fmtKcal(total.kcal)} kcal</span>
          </div>
          <MacroInline {...total} className="justify-end" />
          <Button
            size="lg"
            className="w-full"
            onClick={() => onConfirm(items.map((it) => ({ name: it.name.trim() || 'Món AI', emoji: it.emoji, grams: Math.round(it.grams), ...pickNutrients(it) })))}
          >
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

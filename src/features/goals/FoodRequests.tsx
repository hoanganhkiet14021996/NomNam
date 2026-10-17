import { useMemo, useState } from 'react'
import { ChevronRight, ClipboardList, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { FOODS } from '@/data/foods.vn'
import { COOKING_LABEL, findFood, ROLE_LABEL } from '@/lib/ai/match'
import { fmtKcal } from '@/lib/nutrition'
import { pendingRequests, relinkableLogs } from '@/store/derive'
import { useAppStore } from '@/store/useAppStore'
import type { FoodRequest } from '@/types'

/** Thẻ "Món chờ bổ sung" ở tab Mục tiêu: món AI nhận ra nhưng chưa có trong bảng món. */
export function FoodRequestsCard() {
  const requests = useAppStore((s) => s.foodRequests)
  const list = useMemo(() => pendingRequests(requests), [requests])
  const ready = list.filter((r) => findFood(r, FOODS)).length
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="p-0">
        <button type="button" onClick={() => setOpen(true)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
          <ClipboardList className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">{list.length ? `${list.length} món chờ bổ sung` : 'Không có món chờ bổ sung'}</span>
            <span className="block text-xs text-muted-foreground">
              {ready ? `${ready} món đã có trong bảng — bấm để cập nhật` : 'Món AI nhận ra nhưng chưa có trong bảng món'}
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
        </button>
      </Card>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent title="Món chờ bổ sung">
          <div className="space-y-3 overflow-y-auto px-4 pb-6 pt-3">
            <h2 className="text-base font-bold">Món chờ bổ sung</h2>
            <p className="text-xs text-muted-foreground">
              Món AI nhận ra nhưng chưa có trong bảng món, đang dùng số AI ước lượng. Danh sách được đồng bộ lên tài khoản; trên máy tính nhờ Claude
              "research các món chờ bổ sung" để thêm số chuẩn vào bảng. Khi bảng đã có món, bấm cập nhật để tính lại các bữa cũ.
            </p>
            {list.length === 0 ? (
              <p className="rounded-xl bg-muted px-3 py-6 text-center text-sm text-muted-foreground">Chưa có món nào 🎉</p>
            ) : (
              <ul className="space-y-2">
                {list.map((r) => (
                  <RequestRow key={r.id} request={r} />
                ))}
              </ul>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function RequestRow({ request: r }: { request: FoodRequest }) {
  const foodLogs = useAppStore((s) => s.foodLogs)
  const setStatus = useAppStore((s) => s.setFoodRequestStatus)
  const relinkLogs = useAppStore((s) => s.relinkLogs)
  const restoreFoodLogs = useAppStore((s) => s.restoreFoodLogs)
  const food = findFood(r, FOODS)
  const affected = relinkableLogs(foodLogs, r.nameKey).length
  const cooking = COOKING_LABEL[r.cooking]

  const dismiss = () => {
    setStatus(r.id, 'dismissed')
    toast(`Đã bỏ qua "${r.name}"`, { action: { label: 'Hoàn tác', onClick: () => setStatus(r.id, 'pending') } })
  }

  const apply = () => {
    if (!food) return
    const before = relinkLogs(r.nameKey, food)
    setStatus(r.id, 'done', food.id)
    toast.success(before.length ? `Đã cập nhật ${before.length} bữa theo "${food.name}"` : `"${r.name}" đã có trong bảng`, {
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          restoreFoodLogs(before)
          setStatus(r.id, 'pending', null)
        },
      },
    })
  }

  return (
    <li className="space-y-2 rounded-2xl border bg-card p-3">
      <div className="flex items-start gap-2">
        <span className="text-xl" aria-hidden>
          {r.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{r.name}</p>
          <p className="text-[11px] text-muted-foreground">
            {ROLE_LABEL[r.role]}
            {r.kind ? ` · ${r.kind}` : ''}
            {cooking ? ` · ${cooking}` : ''}
          </p>
          <p className="num text-[11px] text-muted-foreground">
            AI ước lượng {fmtKcal(r.per100.kcal)} kcal/100g · đã ăn {r.timesSeen} lần
          </p>
        </div>
      </div>
      {food ? (
        <div className="flex items-center gap-2 rounded-xl bg-success/10 px-2.5 py-2">
          <p className="min-w-0 flex-1 text-xs">
            <span className="font-semibold text-success">✓ Đã có trong bảng:</span> {food.emoji} {food.name}
          </p>
          <Button size="sm" onClick={apply}>
            <RefreshCw /> {affected ? `Cập nhật ${affected} bữa` : 'Xong'}
          </Button>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={dismiss}>
            Bỏ qua
          </Button>
        </div>
      )}
    </li>
  )
}

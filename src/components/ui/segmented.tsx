import { motion } from "motion/react"
import { useId } from "react"

import { cn } from "@/lib/utils"

interface Option<T extends string> {
  value: T
  label: React.ReactNode
}

/** Nhóm nút chọn 1 (kiểu iOS segmented control) với nền trượt mượt. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
  size = "default",
}: {
  value: T
  onChange: (v: T) => void
  options: Option<T>[]
  className?: string
  size?: "default" | "sm"
}) {
  const id = useId()
  return (
    <div role="radiogroup" className={cn("flex rounded-xl bg-muted p-1", className)}>
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative flex-1 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              size === "sm" ? "h-8 text-xs" : "h-9 text-sm",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-lg bg-card shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

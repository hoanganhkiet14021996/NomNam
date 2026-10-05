import { animate, useMotionValue, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

const defaultFormat = (n: number) => Math.round(n).toLocaleString('vi-VN')

/** Số đếm mượt khi giá trị thay đổi. `format` nên là hàm ổn định (khai báo ngoài component). */
export function AnimatedNumber({
  value,
  format = defaultFormat,
  className,
}: {
  value: number
  format?: (n: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const mv = useMotionValue(value)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) {
      mv.set(value)
      if (ref.current) ref.current.textContent = format(value)
      return
    }
    const controls = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] })
    return controls.stop
  }, [value, mv, reduce, format])

  useEffect(
    () =>
      mv.on('change', (v) => {
        if (ref.current) ref.current.textContent = format(v)
      }),
    [mv, format],
  )

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}

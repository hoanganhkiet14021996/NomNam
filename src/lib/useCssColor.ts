import { useEffect, useState } from 'react'

function read(names: readonly string[]): Record<string, string> {
  const css = getComputedStyle(document.documentElement)
  return Object.fromEntries(names.map((n) => [n, `hsl(${css.getPropertyValue(`--${n}`).trim()})`]))
}

/**
 * Đọc màu từ CSS token (vd 'kcal' → hsl(var(--kcal))) để truyền vào thư viện chart (SVG attribute không hiểu var()).
 * Tự cập nhật khi đổi sáng/tối hoặc bảng màu. Danh sách tên cần cố định cho mỗi chỗ gọi.
 */
export function useCssColors<T extends string>(...names: T[]): Record<T, string> {
  const [colors, setColors] = useState(() => read(names))
  const key = names.join(',')
  useEffect(() => {
    const list = key.split(',')
    const obs = new MutationObserver(() => setColors(read(list)))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-palette'] })
    return () => obs.disconnect()
  }, [key])
  return colors as Record<T, string>
}

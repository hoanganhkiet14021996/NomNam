import defaultTheme from "tailwindcss/defaultTheme"
import animate from "tailwindcss-animate"

const token = (name) => `hsl(var(--${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        border: token("border"),
        input: token("input"),
        ring: token("ring"),
        background: token("background"),
        foreground: token("foreground"),
        primary: { DEFAULT: token("primary"), foreground: token("primary-foreground") },
        secondary: { DEFAULT: token("secondary"), foreground: token("secondary-foreground") },
        destructive: { DEFAULT: token("destructive"), foreground: token("destructive-foreground") },
        muted: { DEFAULT: token("muted"), foreground: token("muted-foreground") },
        accent: { DEFAULT: token("accent"), foreground: token("accent-foreground") },
        popover: { DEFAULT: token("popover"), foreground: token("popover-foreground") },
        card: { DEFAULT: token("card"), foreground: token("card-foreground") },
        // Màu macro — dùng thống nhất ở mọi màn hình
        kcal: token("kcal"),
        protein: token("protein"),
        carbs: token("carbs"),
        fat: token("fat"),
        fiber: token("fiber"),
        success: token("success"),
        warning: token("warning"),
      },
      borderRadius: {
        "2xl": "calc(var(--radius) + 6px)",
        xl: "calc(var(--radius) + 2px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        soft: "0 1px 2px hsl(var(--shadow) / 0.04), 0 4px 16px hsl(var(--shadow) / 0.06)",
      },
    },
  },
  plugins: [animate],
}

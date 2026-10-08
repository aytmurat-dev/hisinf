'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ label }: { label?: string }) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border border-[var(--border)] opacity-50 flex items-center justify-center" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-[var(--border)] hover:border-[var(--gold)] hover:bg-[var(--secondary)] transition-all cursor-pointer text-xs font-medium"
      title={label || 'Rejimni almashtirish'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[var(--gold)]" />
          {label && <span className="text-[var(--gold)] hidden sm:inline">{label}</span>}
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[var(--foreground)]" />
          {label && <span className="hidden sm:inline">{label}</span>}
        </>
      )}
    </button>
  )
}

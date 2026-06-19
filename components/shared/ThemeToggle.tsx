'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('restbite-theme')
    if (stored === 'light') {
      setTheme('light')
    }
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('restbite-theme', next)

    if (next === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }

  return (
    <button
      id="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="
        relative flex items-center justify-center
        w-9 h-9 rounded-lg
        border border-border
        bg-surface
        text-foreground
        transition-all duration-200
        hover:border-brand hover:text-brand
        focus-visible:ring-2 focus-visible:ring-brand
      "
    >
      {theme === 'dark' ? (
        <Sun size={16} strokeWidth={1.8} />
      ) : (
        <Moon size={16} strokeWidth={1.8} />
      )}
    </button>
  )
}

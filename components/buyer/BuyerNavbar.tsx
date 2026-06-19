'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

const NAV_LINKS = [
  { href: '/supermarkets', label: 'Deals' },
  { href: '/stores', label: 'Stores' },
]

export function BuyerNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Logo size="md" />

        {/* Desktop nav links — centred */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(link => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150"
                style={active
                  ? { color: 'var(--brand)', background: 'rgba(200,241,53,0.08)' }
                  : { color: 'var(--muted-foreground)' }
                }
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: 'var(--brand)' }} />
                )}
              </Link>
            )
          })}
        </div>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:translate-y-0"
            style={{ background: 'var(--brand)', color: 'var(--background)' }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile right: theme + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -mr-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full glass border-b border-border px-4 py-5 flex flex-col gap-2 animate-fade-up shadow-2xl">
          {NAV_LINKS.map(link => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center rounded-xl text-sm font-semibold transition-colors"
                style={active
                  ? { background: 'rgba(200,241,53,0.1)', color: 'var(--brand)', border: '1px solid rgba(200,241,53,0.2)' }
                  : { background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)' }
                }
              >
                {link.label}
              </Link>
            )
          })}
          <hr className="border-border my-1" />
          <Link
            href="/auth/login"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 text-center rounded-xl border border-border text-sm font-medium hover:bg-surface transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 text-center rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'var(--brand)', color: 'var(--background)' }}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  )
}

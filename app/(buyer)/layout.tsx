import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'
import { BuyerNavbar } from '@/components/buyer/BuyerNavbar'
import { BuyerFooter } from '@/components/buyer/BuyerFooter'

export const metadata: Metadata = {
  title: {
    default: 'Restbite — Rescue Food, Recover Value',
    template: '%s | Restbite',
  },
  description: 'Snag discounted near-expiry groceries or book last-minute dining slots before they close. Stop waste, save money.',
}

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Animated background — fixed to viewport, no overflow clipping */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-background">
        {/* Sweeping slanted beam 1 — lime */}
        <div className="beam-lime" />
        {/* Sweeping slanted beam 2 — violet, delayed */}
        <div className="beam-violet" />
        {/* Ambient top-left glow */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.06] bg-[var(--brand)]" />
        {/* Ambient bottom-right glow */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.06] bg-[var(--dining)]" />
      </div>

      {/* Top nav */}
      <BuyerNavbar />

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-xs text-center" style={{ color: 'var(--muted-fg)' }}>
            © {new Date().getFullYear()} Restbite. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted-fg)' }}>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

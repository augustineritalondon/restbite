import type { Metadata } from 'next'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { SignOutButton } from '@/components/shared/SignOutButton'
import { SidebarNav } from '@/components/shared/SidebarNav'
import { ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard | Restbite',
    template: '%s | Admin — Restbite',
  },
  description: 'Platform administration — users, restaurants, approvals and analytics.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh flex">
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border"
        style={{ background: 'var(--sidebar)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Logo href="/admin/dashboard" />
        </div>

        {/* Role badge — urgency red for admin authority */}
        <div className="px-5 pt-4 pb-2">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ background: 'color-mix(in srgb, var(--urgency) 15%, transparent)', color: 'var(--urgency)' }}
          >
            <ShieldCheck size={10} strokeWidth={2} />
            Admin
          </span>
        </div>

        {/* Nav */}
        <SidebarNav type="admin" />

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-0.5">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-14 glass border-b border-border flex items-center justify-between px-4">
          <Logo href="/admin/dashboard" size="sm" />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

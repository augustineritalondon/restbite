import type { Metadata } from 'next'
import { SignOutButton } from '@/components/shared/SignOutButton'
import { SidebarNav } from '@/components/shared/SidebarNav'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export const metadata: Metadata = {
  title: {
    default: 'Restaurant Dashboard | Restbite',
    template: '%s | Restaurant — Restbite',
  },
  description: 'Manage your restaurant — menus, reservations, time slots and analytics all in one place.',
}

export default function RestaurantLayout({
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
          <Logo href="/restaurant/dashboard" />
        </div>

        {/* Role badge — dining violet */}
        <div className="px-5 pt-4 pb-2">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ background: 'color-mix(in srgb, var(--dining) 15%, transparent)', color: 'var(--dining)' }}
          >
            Restaurant Portal
          </span>
        </div>

        {/* Nav */}
        <SidebarNav type="restaurant" />

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-0.5">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden h-14 glass border-b border-border flex items-center justify-between px-4">
          <Logo href="/restaurant/dashboard" size="sm" />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  LayoutDashboard,
  ShoppingBag,
  Star,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'

export const metadata: Metadata = {
  title: {
    default: 'Seller Dashboard | Restbite',
    template: '%s | Seller — Restbite',
  },
  description: 'Manage your listings, track orders, and grow your business on Restbite.',
}

const navItems = [
  { label: 'Overview',   href: '/seller/dashboard',   icon: LayoutDashboard },
  { label: 'Listings',   href: '/seller/listings',     icon: ShoppingBag },
  { label: 'Orders',     href: '/seller/orders',       icon: Star },
  { label: 'Analytics',  href: '/seller/analytics',    icon: BarChart2 },
  { label: 'Settings',   href: '/seller/settings',     icon: Settings },
]

export default function SellerLayout({
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
          <Logo href="/seller/dashboard" />
        </div>

        {/* Role badge */}
        <div className="px-5 pt-4 pb-2">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ background: 'color-mix(in srgb, var(--brand) 15%, transparent)', color: 'var(--brand)' }}
          >
            Seller Portal
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                text-sidebar-foreground/70
                hover:bg-sidebar-accent hover:text-sidebar-foreground
                transition-colors duration-150
              "
            >
              <Icon size={16} strokeWidth={1.8} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-0.5">
          <ThemeToggle />
          <button
            className="
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
              text-sidebar-foreground/60
              hover:bg-sidebar-accent hover:text-sidebar-foreground
              transition-colors duration-150
            "
          >
            <LogOut size={16} strokeWidth={1.8} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden h-14 glass border-b border-border flex items-center justify-between px-4">
          <Logo href="/seller/dashboard" size="sm" />
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}

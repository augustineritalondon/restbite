'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, CalendarDays, Settings,
  ShoppingBag, Star, BarChart2,
  Store, Users, ShieldCheck, Bell,
  type LucideIcon,
} from 'lucide-react'

type NavItem = { label: string; href: string; icon: LucideIcon }

const NAV_CONFIGS: Record<string, { accentColor: string; items: NavItem[] }> = {
  restaurant: {
    accentColor: 'var(--dining)',
    items: [
      { label: 'Overview',  href: '/restaurant/dashboard', icon: LayoutDashboard },
      { label: 'Sessions',  href: '/restaurant/sessions',  icon: CalendarDays },
      { label: 'Settings',  href: '/restaurant/settings',  icon: Settings },
    ],
  },
  seller: {
    accentColor: 'var(--brand)',
    items: [
      { label: 'Overview',   href: '/seller/dashboard',  icon: LayoutDashboard },
      { label: 'Listings',   href: '/seller/listings',   icon: ShoppingBag },
      { label: 'Orders',     href: '/seller/orders',     icon: Star },
      { label: 'Analytics',  href: '/seller/analytics',  icon: BarChart2 },
      { label: 'Settings',   href: '/seller/settings',   icon: Settings },
    ],
  },
  admin: {
    accentColor: 'var(--urgency)',
    items: [
      { label: 'Overview',      href: '/admin/dashboard',     icon: LayoutDashboard },
      { label: 'Restaurants',   href: '/admin/restaurants',   icon: Store },
      { label: 'Users',         href: '/admin/users',         icon: Users },
      { label: 'Approvals',     href: '/admin/approvals',     icon: ShieldCheck },
      { label: 'Analytics',     href: '/admin/analytics',     icon: BarChart2 },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Settings',      href: '/admin/settings',      icon: Settings },
    ],
  },
}

export function SidebarNav({ type }: { type: 'restaurant' | 'seller' | 'admin' }) {
  const pathname = usePathname()
  const { accentColor, items } = NAV_CONFIGS[type]

  return (
    <nav className="flex-1 px-3 py-2 space-y-0.5">
      {items.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-colors duration-150
              ${isActive
                ? 'text-sidebar-foreground'
                : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }
            `}
            style={isActive ? {
              background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
              color: accentColor,
            } : undefined}
          >
            <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

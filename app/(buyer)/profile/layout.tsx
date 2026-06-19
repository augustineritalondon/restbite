'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Package, Heart, Settings, LogOut } from 'lucide-react'

const PROFILE_NAV = [
  { href: '/profile/orders', label: 'My Orders', icon: Package },
  { href: '/profile/saved', label: 'Saved Items', icon: Heart },
  { href: '/profile/settings', label: 'Settings', icon: Settings },
]

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="md:sticky md:top-24">
            
            {/* User Info Snippet (Desktop) */}
            <div className="hidden md:flex items-center gap-3 mb-8 px-4">
              <div className="w-12 h-12 rounded-full bg-[var(--brand)] flex items-center justify-center text-black font-black text-lg">
                R
              </div>
              <div>
                <h2 className="font-bold text-foreground">Rita London</h2>
                <p className="text-xs text-muted-foreground">demo@restbite.app</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex md:flex-col gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
              {PROFILE_NAV.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                      isActive 
                        ? 'bg-[var(--brand)] text-[var(--background)] shadow-sm' 
                        : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
              
              <div className="hidden md:block my-4 border-t border-border" />
              
              <Link
                href="/auth/login"
                onClick={() => { document.cookie = "demo_buyer_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" }}
                className="hidden md:flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-surface hover:text-[var(--urgency)] transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </Link>
            </nav>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}

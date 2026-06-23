'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Heart, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { SignOutButton } from '@/components/shared/SignOutButton'

const PROFILE_NAV = [
  { href: '/profile/orders', label: 'My Orders', icon: Package },
  { href: '/profile/saved', label: 'Saved Items', icon: Heart },
  { href: '/profile/settings', label: 'Settings', icon: Settings },
]

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="md:sticky md:top-24">
            
            {/* User Info Snippet (Desktop) */}
            <div className="hidden md:flex items-center gap-3 mb-8 px-4">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center font-black text-lg relative overflow-hidden text-[var(--brand)]">
                {user?.user_metadata?.avatar_url ? (
                  <Image src={user.user_metadata.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div>
                <h2 className="font-bold text-foreground line-clamp-1">{user?.user_metadata?.full_name || 'Loading...'}</h2>
                <p className="text-xs text-muted-foreground line-clamp-1">{user?.email}</p>
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
              <div className="hidden md:block">
                <SignOutButton className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-surface hover:text-[var(--urgency)] transition-colors" iconSize={18} />
              </div>
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

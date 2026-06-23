'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, Bell } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { useCartStore, selectTotalItems, selectStoreName } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { storeSlug } from '@/lib/stores'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { href: '/supermarkets', label: 'Deals' },
  { href: '/restaurants', label: 'Dining' },
  { href: '/stores', label: 'Stores' },
]

export function BuyerNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const totalItems = useCartStore(selectTotalItems)
  const storeName = useCartStore(selectStoreName)
  const user = useAuthStore((state) => state.user)

  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchNotifications = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
      if (data) setNotifications(data)
    }
    fetchNotifications()
  }, [user])

  const unreadCount = notifications.filter(n => !n.is_read).length

  const markAsRead = async (id: string) => {
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

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
          {totalItems > 0 && storeName && (
            <Link 
              href={`/stores/${storeSlug(storeName)}/checkout`}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors mr-2"
            >
              <ShoppingCart size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: 'var(--brand)', color: 'var(--background)' }}>
                {totalItems}
              </span>
            </Link>
          )}
          <ThemeToggle />
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-muted-foreground hover:text-foreground transition-colors mr-2"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: 'var(--brand)', color: 'var(--background)' }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-border font-bold text-sm">Notifications</div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet.</div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => !n.is_read && markAsRead(n.id)}
                            className={`p-3 border-b border-border last:border-0 hover:bg-[var(--surface)] cursor-pointer transition-colors ${!n.is_read ? 'bg-[var(--surface)]' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-sm text-foreground">{n.title}</span>
                              {!n.is_read && <span className="w-2 h-2 rounded-full bg-[var(--brand)] mt-1" />}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-muted-foreground mt-2 block opacity-70">
                              {new Date(n.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/profile/orders"
                className="text-sm font-bold text-foreground hover:text-[var(--brand)] transition-colors px-4 py-2"
              >
                Orders
              </Link>
              <Link href="/profile/settings" className="relative w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-sm ml-2 hover:border-[var(--brand)] transition-colors overflow-hidden" style={{ color: 'var(--brand)' }}>
                {user.user_metadata?.avatar_url ? (
                  <Image src={user.user_metadata.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-bold text-foreground hover:text-[var(--brand)] transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 hover:-translate-y-px active:translate-y-0"
                style={{ background: 'var(--brand)', color: 'var(--background)' }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile right: theme + cart + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {totalItems > 0 && storeName && (
            <Link 
              href={`/stores/${storeSlug(storeName)}/checkout`}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: 'var(--brand)', color: 'var(--background)' }}>
                {totalItems}
              </span>
            </Link>
          )}
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
          {user ? (
            <>
              <Link
                href="/profile/orders"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center rounded-xl border border-border text-sm font-medium hover:bg-surface transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/profile/settings"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 text-center rounded-xl border border-border text-sm font-medium hover:bg-surface transition-colors"
              >
                Settings
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </header>
  )
}

'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import { useState } from 'react'

interface SignOutButtonProps {
  className?: string
  iconSize?: number
}

export function SignOutButton({ className = "", iconSize = 16 }: SignOutButtonProps) {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className={className || "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors duration-150"}
    >
      {isSigningOut ? (
        <span className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
      ) : (
        <LogOut size={iconSize} strokeWidth={1.8} />
      )}
      {isSigningOut ? 'Signing out...' : 'Sign out'}
    </button>
  )
}

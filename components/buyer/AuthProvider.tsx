'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore()
  
  useEffect(() => {
    // Read mock user from cookies
    const cookie = document.cookie.split('; ').find(row => row.startsWith('restbite_mock_user='))
    if (cookie) {
      try {
        const mockUser = JSON.parse(decodeURIComponent(cookie.split('=')[1]))
        setUser(mockUser)
      } catch (e) {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [setUser])

  return <>{children}</>
}

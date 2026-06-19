'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Navigation, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAllowLocation = () => {
    setLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        const supabase = createClient()
        // Save the location to user metadata
        await supabase.auth.updateUser({
          data: { location: { lat: latitude, lon: longitude } }
        })

        router.push('/supermarkets')
        router.refresh()
      },
      (err) => {
        console.error(err)
        setError('Unable to retrieve your location. You can set it later.')
        setLoading(false)
      }
    )
  }

  const handleSkip = () => {
    router.push('/supermarkets')
    router.refresh()
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl text-center">
        
        <div className="w-20 h-20 bg-[rgba(200,241,53,0.1)] rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-[rgba(200,241,53,0.05)] rounded-full animate-ping" />
          <MapPin size={40} style={{ color: 'var(--brand)' }} />
        </div>

        <h1 className="text-2xl font-black text-foreground mb-3">Find deals near you</h1>
        <p className="text-muted-foreground text-sm mb-8 px-4">
          Restbite uses your location to show you the best deals and expiring food from stores in your neighbourhood.
        </p>

        {error && (
          <div className="bg-[var(--urgency)]/10 text-[var(--urgency)] text-xs p-3 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleAllowLocation}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-black transition-all hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ background: 'var(--brand)', color: 'var(--background)' }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Navigation size={16} className="fill-[var(--background)]" />
                Allow Location
              </>
            )}
          </button>
          
          <button
            onClick={handleSkip}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}

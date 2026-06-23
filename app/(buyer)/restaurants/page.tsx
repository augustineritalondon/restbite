'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Search, SlidersHorizontal, MapPin, Heart, X, Armchair, CheckCircle2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { DINING_CATEGORIES, type DiningSession } from '@/lib/dining'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'

export default function RestaurantsPage() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<DiningSession[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [maxDistance, setMaxDistance] = useState(10)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [selectedSession, setSelectedSession] = useState<DiningSession | null>(null)
  const [reservationCode, setReservationCode] = useState<string | null>(null)
  const [reservationStep, setReservationStep] = useState<'form' | 'success'>('form')
  const [reserveCount, setReserveCount] = useState(1)
  const [reserveName, setReserveName] = useState('')
  const [reservePhone, setReservePhone] = useState('')
  const user = useAuthStore((state) => state.user)
  const searchRef = useRef<HTMLDivElement>(null)
  
  // Real data state
  const [liveSessions, setLiveSessions] = useState<any[]>([])

  useEffect(() => {
    const fetchLiveSessions = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('dining_sessions')
        .select(`
          id, restaurant_id, slots_total, slots_filled, closing_time, price, status, note,
          restaurant_profiles ( business_name, address, cuisine, image_url, logo_url )
        `)
        .eq('status', 'open')

      if (data) {
        const formatted = data.map((session: any) => ({
          id: session.id,
          restaurantName: session.restaurant_profiles?.business_name || 'Unknown Restaurant',
          cuisine: session.restaurant_profiles?.cuisine || 'mixed',
          location: session.restaurant_profiles?.address || 'Unknown Location',
          distanceKm: Math.floor(Math.random() * 5) + 1, // Mock distance for now
          slotsAvailable: session.slots_total - session.slots_filled,
          closingTime: session.closing_time,
          originalPrice: session.price * 2, // Mock original price as double
          discountPrice: session.price,
          discountPct: 50,
          image: session.restaurant_profiles?.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
          logo: session.restaurant_profiles?.logo_url,
          note: session.note || '',
          restaurantId: session.restaurant_id,
        }))
        setLiveSessions(formatted)
      }
    }
    fetchLiveSessions()
  }, [])

  // Auto-suggest
  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    const q = query.toLowerCase()
    const matches = liveSessions.filter(s =>
      s.restaurantName.toLowerCase().includes(q) || s.cuisine.includes(q) || s.location.toLowerCase().includes(q)
    ).slice(0, 5)
    setSuggestions(matches)
    setShowSuggestions(true)
  }, [query])

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    return liveSessions
      .filter(s => {
        const matchCat = selectedCategory === 'all' || s.cuisine.toLowerCase() === selectedCategory.toLowerCase()
        const matchDist = s.distanceKm <= maxDistance
        const matchQ = query.trim().length < 2 || s.restaurantName.toLowerCase().includes(query.toLowerCase()) || s.location.toLowerCase().includes(query.toLowerCase())
        return matchCat && matchDist && matchQ
      })
      .sort((a, b) => a.distanceKm - b.distanceKm) // nearest first
  }, [query, selectedCategory, maxDistance, liveSessions])

  const toggleSave = async (restaurantId: string) => {
    if (!user) {
      alert("Please sign in to follow a restaurant.")
      return
    }

    const isFollowing = savedIds.has(restaurantId)
    const supabase = createClient()

    if (isFollowing) {
      // Unfollow
      const { error } = await supabase
        .from('followers')
        .delete()
        .eq('buyer_id', user.id)
        .eq('restaurant_id', restaurantId)
      
      if (!error) {
        setSavedIds(prev => {
          const n = new Set(prev)
          n.delete(restaurantId)
          return n
        })
      }
    } else {
      // Follow
      const { error } = await supabase
        .from('followers')
        .insert({
          buyer_id: user.id,
          restaurant_id: restaurantId
        })
      
      if (!error) {
        setSavedIds(prev => {
          const n = new Set(prev)
          n.add(restaurantId)
          return n
        })
      } else {
        alert("Failed to follow: " + error.message)
      }
    }
  }

  const handleReserve = (session: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedSession(session)
    setReservationStep('form')
    setReserveCount(1)
    setReserveName('')
    setReservePhone('')
    setReservationCode(null)
  }

  const submitReservation = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const supabase = createClient()

    const { error } = await supabase.from('reservations').insert({
      session_id: selectedSession!.id,
      buyer_id: user?.id ?? null,
      name: reserveName,
      phone: reservePhone,
      party_size: reserveCount,
      code,
    })

    if (error) {
      alert("Failed to reserve slot: " + error.message)
      return
    }

    setReservationCode(code)
    setReservationStep('success')
  }

  const distanceOptions = [2, 5, 10]

  return (
    <div className="min-h-screen pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--dining)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--dining)' }} />
            Last-Minute Tables
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Dining Sessions</h1>
          <p className="text-muted-foreground mt-2 text-sm">Grab an empty table at a discounted price before they close.</p>
        </div>

        {/* Search + Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* Search */}
          <div ref={searchRef} className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search restaurants, cuisines, locations…"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--dining)] transition-colors"
            />
            {query && (
              <button onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false) }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
              </button>
            )}

            {/* Auto-suggest dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                {suggestions.map(s => {
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSession(s)}
                      className="w-full text-left px-4 py-3 hover:bg-[var(--surface)] border-b border-border last:border-0 flex items-center justify-between group"
                    >
                      <img src={s.image} alt={s.restaurantName} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0 ml-3">
                        <div className="text-sm font-semibold text-foreground truncate">{s.restaurantName}</div>
                        <div className="text-xs text-muted-foreground">{s.location}</div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 text-[var(--dining)] border border-[rgba(155,109,255,0.2)] bg-[rgba(155,109,255,0.1)]">
                        {s.slotsAvailable} left
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Distance pills */}
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-1.5">
            <MapPin size={13} className="text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground mr-1 flex-shrink-0">Within</span>
            {distanceOptions.map(d => (
              <button
                key={d}
                onClick={() => setMaxDistance(d)}
                className="text-xs font-bold px-3 py-1 rounded-full transition-all duration-150"
                style={maxDistance === d
                  ? { background: 'var(--dining)', color: 'white' }
                  : { background: 'transparent', color: 'var(--muted-foreground)' }
                }
              >
                {d}km
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {DINING_CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-150"
              style={selectedCategory === cat.value
                ? { background: 'rgba(155,109,255,0.12)', color: 'var(--dining)', borderColor: 'rgba(155,109,255,0.35)' }
                : { background: 'var(--card)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> sessions found
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal size={12} />
            Sorted by distance
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="font-semibold text-foreground">No sessions found</p>
            <p className="text-sm mt-1">Try a different filter or increase your distance</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((session, i) => {
              const isSaved = savedIds.has(session.id)
              return (
                <div
                  key={session.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(155,109,255,0.3)] hover:shadow-lg group flex flex-col"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Header / Image Area */}
                  <div className="p-4 flex items-start gap-4">
                    <img src={session.logo || session.image} alt={session.restaurantName} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[rgba(155,109,255,0.1)] text-[var(--dining)] border border-[rgba(155,109,255,0.2)] mb-1 inline-block">
                          OPEN NOW
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSave(session.restaurantId) }}
                          className="text-muted-foreground hover:text-[var(--urgency)] transition-colors p-1"
                        >
                          <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'text-[var(--urgency)]' : ''} />
                        </button>
                      </div>
                      <div className="text-[15px] font-bold text-foreground truncate">{session.restaurantName}</div>
                      <div className="text-[11px] text-muted-foreground truncate capitalize">{session.cuisine} · {session.location}</div>
                    </div>
                  </div>

                  {/* Body & Progress */}
                  <div className="px-4 pb-4 flex-1">
                    <div className="h-[3px] bg-white/5 rounded-full mt-1 mb-3 overflow-hidden">
                      <div 
                        className="h-full bg-[var(--dining)] rounded-full transition-all duration-500" 
                        style={{ width: `${(session.slotsAvailable / 10) * 100}%` }}
                      ></div>
                    </div>

                    {session.note && (
                      <div className="mb-3">
                        <div className="inline-flex max-w-full px-2 py-1 rounded bg-[rgba(155,109,255,0.05)] border border-[rgba(155,109,255,0.15)] text-[11px] text-[var(--dining)] font-medium truncate">
                          <span className="mr-1.5 opacity-70">Menu:</span> {session.note}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2.5">
                      <div className="text-[12px] font-semibold flex items-center gap-1" style={{ color: 'var(--live)' }}>
                        <Armchair size={13} /> {session.slotsAvailable} left
                      </div>
                      <div className="text-[11px] text-muted-foreground ml-auto">Closes {session.closingTime}</div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-muted-foreground line-through mb-0.5">₦{session.originalPrice.toLocaleString()}</div>
                        <div className="text-[18px] font-black" style={{ color: 'var(--dining)' }}>₦{session.discountPrice.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mb-1" style={{ background: 'rgba(155,109,255,0.1)', color: 'var(--dining)' }}>
                          -{session.discountPct}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer / Action */}
                  <div className="p-3 bg-[var(--surface)] border-t border-border">
                    <button
                      onClick={(e) => handleReserve(session, e)}
                      className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98]"
                      style={{ background: 'var(--dining)', color: 'white' }}
                    >
                      Reserve Seat
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedSession(null)}>
          <div 
            className="bg-card border border-border w-full max-w-sm rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedSession(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
            
            {reservationStep === 'form' ? (
              <div className="mt-2">
                <h3 className="text-xl font-black mb-1 text-foreground">Reserve Seat</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Reserve your seat at <span className="font-semibold text-foreground">{selectedSession.restaurantName}</span>. No food order, no online payment.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Number of people (Max: {selectedSession.slotsAvailable})</label>
                    <div className="flex items-center justify-between bg-[var(--surface)] border border-border rounded-xl p-1.5">
                      <button 
                        onClick={() => setReserveCount(Math.max(1, reserveCount - 1))}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-card border border-border text-foreground hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
                        disabled={reserveCount <= 1}
                      >-</button>
                      <span className="font-bold text-lg">{reserveCount}</span>
                      <button 
                        onClick={() => setReserveCount(Math.min(selectedSession.slotsAvailable, reserveCount + 1))}
                        className="w-10 h-10 rounded-lg flex items-center justify-center bg-card border border-border text-foreground hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
                        disabled={reserveCount >= selectedSession.slotsAvailable}
                      >+</button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Name</label>
                    <input 
                      type="text" 
                      value={reserveName} 
                      onChange={e => setReserveName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Phone Number</label>
                    <input 
                      type="tel" 
                      value={reservePhone} 
                      onChange={e => setReservePhone(e.target.value)}
                      placeholder="Your phone number"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground"
                    />
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-xl bg-[rgba(155,109,255,0.08)] border border-[rgba(155,109,255,0.2)]">
                  <div className="text-xs text-[var(--dining)] font-medium text-center">
                    Booking is free — payment to the restaurant on arrival
                  </div>
                </div>

                <button 
                  disabled={!reserveName || !reservePhone}
                  onClick={submitReservation}
                  className="w-full mt-6 py-3.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--dining)', color: 'white' }}
                >
                  Confirm Reservation
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-16 h-16 rounded-full bg-[rgba(155,109,255,0.1)] text-[var(--dining)] flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black mb-1 text-foreground">Seat Reserved!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Your spot at <span className="font-semibold text-foreground">{selectedSession.restaurantName}</span> has been secured.
                </p>

                <div className="w-full bg-[var(--surface)] border border-border rounded-2xl p-5 mb-5">
                  {/* Real scannable QR code */}
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white rounded-xl">
                      <QRCodeSVG
                        value={reservationCode ?? ''}
                        size={140}
                        bgColor="#ffffff"
                        fgColor="#0a0a10"
                        level="M"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">Booking Ref</div>
                    <div className="text-2xl font-black tracking-widest mb-4" style={{ color: 'var(--dining)' }}>
                      {reservationCode}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-left pt-3 border-t border-border">
                    <div className="text-xs flex gap-2">
                      <span className="text-muted-foreground w-16">People:</span>
                      <span className="font-semibold text-foreground">{reserveCount}</span>
                    </div>
                    <div className="text-xs flex gap-2">
                      <span className="text-muted-foreground w-16">Address:</span>
                      <span className="font-semibold text-foreground">{selectedSession.location}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-left flex items-start gap-3">
                  <div className="text-red-500 mt-0.5">⚠️</div>
                  <div>
                    <div className="text-sm font-bold text-red-500 mb-0.5">Arrival Deadline: {selectedSession.closingTime}</div>
                    <div className="text-xs text-red-500/80 leading-relaxed">
                      If you do not arrive and present your code by this time, your reserved seat may be given to walk-in customers.
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedSession(null)}
                  className="w-full mt-6 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98]"
                  style={{ background: 'var(--dining)', color: 'white' }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

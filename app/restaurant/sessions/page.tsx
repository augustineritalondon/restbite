'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, CheckCircle2, XCircle, MoreVertical, Copy, Share2, Link2, X, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'
import Link from 'next/link'

export default function RestaurantSessions() {
  const [activeTab, setActiveTab] = useState<'live' | 'history'>('live')
  const [showOpenModal, setShowOpenModal] = useState(false)
  const [showProfileWarning, setShowProfileWarning] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [checkinLink, setCheckinLink] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const user = useAuthStore((state) => state.user)

  // Form State
  const [slots, setSlots] = useState(12)
  const [closingTime, setClosingTime] = useState('22:30')
  const [price, setPrice] = useState(7500)
  const [note, setNote] = useState("Tonight's menu: local dishes + rice")

  const [bookings, setBookings] = useState<any[]>([])

  // Fetch active session and its reservations on mount
  useEffect(() => {
    if (!user) return
    const fetchActiveSession = async () => {
      const supabase = createClient()
      const { data: session } = await supabase
        .from('dining_sessions')
        .select('id, checkin_token, slots_total, closing_time, price, note')
        .eq('restaurant_id', user.id)
        .eq('status', 'open')
        .single()

      if (session) {
        setSessionActive(true)
        setActiveSessionId(session.id)
        setSlots(session.slots_total)
        setClosingTime(session.closing_time)
        setPrice(session.price)
        setNote(session.note || '')
        setCheckinLink(`${window.location.origin}/checkin/${session.checkin_token}`)

        // Fetch real reservations for this session
        const { data: reservations } = await supabase
          .from('reservations')
          .select('*')
          .eq('session_id', session.id)
          .order('reserved_at', { ascending: false })
        
        if (reservations) {
          setBookings(reservations.map(r => ({
            id: r.id,
            name: r.name,
            size: r.party_size,
            time: new Date(r.reserved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            code: r.code,
            arrived: r.arrived
          })))
        }
      }
    }
    fetchActiveSession()
  }, [user])

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    
    // Get the exact user from Supabase to guarantee RLS matches
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      alert("You must be logged in to publish a session.")
      return
    }

    // Validate that the restaurant has a profile set up
    const { data: profile } = await supabase
      .from('restaurant_profiles')
      .select('business_name, address')
      .eq('id', authUser.id)
      .single()

    if (!profile || !profile.business_name || !profile.address) {
      setShowOpenModal(false)
      setShowProfileWarning(true)
      return
    }

    const { data, error } = await supabase
      .from('dining_sessions')
      .insert({
        restaurant_id: authUser.id,
        slots_total: slots,
        closing_time: closingTime,
        price,
        note,
        status: 'open',
      })
      .select('checkin_token')
      .single()

    if (error) {
      console.error('SUPABASE ERROR:', error)
      alert(`Failed to save session: ${error.message}`)
      return
    }

    if (data?.checkin_token) {
      const link = `${window.location.origin}/checkin/${data.checkin_token}`
      setCheckinLink(link)
    }

    // Broadcast notification to all followers
    const { data: followers } = await supabase
      .from('followers')
      .select('buyer_id')
      .eq('restaurant_id', authUser.id)
    
    if (followers && followers.length > 0) {
      const notifications = followers.map(f => ({
        user_id: f.buyer_id,
        title: `New Session at ${profile.business_name}!`,
        message: `They just opened ${slots} slots! Grab yours before they run out.`,
        type: 'session_opened'
      }))
      
      await supabase.from('notifications').insert(notifications)
    }

    setSessionActive(true)
    setShowOpenModal(false)
  }

  const handleCheckIn = (id: number) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, arrived: true } : b))
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Sessions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage live bookings or review past sessions.</p>
        </div>
        {!sessionActive && (
          <button 
            onClick={() => setShowOpenModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--dining)] text-white rounded-xl text-sm font-bold transition-all hover:brightness-110 shadow-lg shadow-[var(--dining)]/20 w-fit"
          >
            <Plus size={16} strokeWidth={3} />
            Open Session
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-muted border border-border rounded-full p-1 w-fit mb-4 shadow-inner">
        <button 
          onClick={() => setActiveTab('live')}
          className={`text-[13px] font-semibold px-5 py-2 rounded-full transition-all duration-200 border ${
            activeTab === 'live' 
              ? 'bg-card text-[var(--dining)] border-border/60 shadow-sm' 
              : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          Live Session
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`text-[13px] font-semibold px-5 py-2 rounded-full transition-all duration-200 border ${
            activeTab === 'history' 
              ? 'bg-card text-[var(--dining)] border-border/60 shadow-sm' 
              : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          History
        </button>
      </div>

      {activeTab === 'live' && (
        <div className="space-y-6 animate-fade-in">
          {sessionActive ? (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border bg-[var(--surface)] flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[rgba(155,109,255,0.1)] text-xs font-bold text-[var(--dining)] border border-[rgba(155,109,255,0.2)] mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--dining)] animate-pulse mr-1.5" />
                    LIVE NOW
                  </div>
                  <h2 className="text-xl font-bold">Tonight's Session</h2>
                  <p className="text-sm text-muted-foreground mt-1">Closes at {closingTime} • ₦{price.toLocaleString()}/person</p>
                  <p className="text-xs text-foreground mt-2 italic">"{note}"</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Slots Remaining</div>
                    <div className="text-3xl font-black text-foreground">
                      {slots - bookings.reduce((acc, curr) => acc + curr.size, 0)} <span className="text-sm text-muted-foreground">/ {slots}</span>
                    </div>
                  </div>
                  <button 
                    onClick={async () => {
                      const supabase = createClient()
                      await supabase
                        .from('dining_sessions')
                        .update({ status: 'closed' })
                        .eq('restaurant_id', user?.id)
                        .eq('status', 'open')
                      setSessionActive(false)
                      setCheckinLink(null)
                    }}
                    className="text-xs font-bold px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors border border-red-500/20 mt-2"
                  >
                    Close Session Early
                  </button>
                </div>
              </div>

              {/* Check-in link */}
              {checkinLink && (
                <div className="px-6 py-4 border-b border-border bg-[rgba(155,109,255,0.04)]">
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 size={14} className="text-[var(--dining)]" />
                    <span className="text-xs font-bold text-[var(--dining)] uppercase tracking-widest">Staff Check-In Link</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-border text-xs font-mono text-muted-foreground truncate">
                      {checkinLink}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(checkinLink)
                        setLinkCopied(true)
                        setTimeout(() => setLinkCopied(false), 2000)
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--surface)] border border-border hover:border-[var(--dining)] text-sm font-semibold transition-colors text-foreground"
                    >
                      {linkCopied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      {linkCopied ? 'Copied!' : 'Copy'}
                    </button>
                    {'share' in navigator && (
                      <button
                        onClick={() => navigator.share({ title: 'Check-In Link', url: checkinLink })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--dining)] text-white text-sm font-semibold transition-all hover:brightness-110"
                      >
                        <Share2 size={14} />
                        Share
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">Send this link to any staff member. No login required — just open and scan.</p>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Guest List</h3>
                  <div className="relative w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search by name or code..." className="w-full pl-9 pr-4 py-2 bg-[var(--surface)] border border-border rounded-xl text-sm focus:outline-none focus:border-[var(--dining)]" />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-3 font-semibold">Guest</th>
                        <th className="pb-3 font-semibold">Code</th>
                        <th className="pb-3 font-semibold">Party Size</th>
                        <th className="pb-3 font-semibold">Time</th>
                        <th className="pb-3 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {bookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-[var(--surface)] transition-colors">
                          <td className="py-4 font-semibold">{booking.name}</td>
                          <td className="py-4 font-mono font-bold text-muted-foreground tracking-widest">{booking.code}</td>
                          <td className="py-4">{booking.size}</td>
                          <td className="py-4 text-muted-foreground">{booking.time}</td>
                          <td className="py-4 text-right">
                            {booking.arrived ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-500 font-bold text-xs">
                                <CheckCircle2 size={14} /> Checked In
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleCheckIn(booking.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[var(--surface)] hover:bg-card border border-border hover:border-[var(--dining)] text-foreground font-semibold text-xs transition-colors shadow-sm"
                              >
                                Mark Arrived
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-card border border-border rounded-2xl">
              <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-4 text-2xl">😴</div>
              <h2 className="text-xl font-bold mb-2">No Active Session</h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                You don't have an active session running. Open one to start receiving last-minute bookings.
              </p>
              <button 
                onClick={() => setShowOpenModal(true)}
                className="px-6 py-3 bg-[var(--dining)] text-white rounded-xl text-sm font-bold transition-all hover:brightness-110 shadow-lg shadow-[var(--dining)]/20"
              >
                Publish a Session
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden animate-fade-in">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-[var(--surface)]">
                <th className="py-4 px-6 font-semibold">Date</th>
                <th className="py-4 px-6 font-semibold">Slots Filled</th>
                <th className="py-4 px-6 font-semibold">Price</th>
                <th className="py-4 px-6 font-semibold">Revenue (Est)</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {[
                { date: 'Yesterday', filled: '12/12', rate: '100%', price: 7500, rev: 90000 },
                { date: 'Mon, 21 Jun', filled: '8/10', rate: '80%', price: 8000, rev: 64000 },
                { date: 'Sun, 20 Jun', filled: '15/15', rate: '100%', price: 7000, rev: 105000 },
                { date: 'Sat, 19 Jun', filled: '18/20', rate: '90%', price: 7500, rev: 135000 },
              ].map((h, i) => (
                <tr key={i} className="hover:bg-[var(--surface)] transition-colors">
                  <td className="py-4 px-6 font-semibold">{h.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span>{h.filled}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[rgba(155,109,255,0.1)] text-[var(--dining)]">{h.rate}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground">₦{h.price.toLocaleString()}</td>
                  <td className="py-4 px-6 font-bold text-foreground">₦{h.rev.toLocaleString()}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-[var(--surface)] transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Open Session Modal */}
      {showOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowOpenModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
            >
              <XCircle size={20} />
            </button>
            
            <h2 className="text-xl font-black mb-1">Open a Session</h2>
            <p className="text-sm text-muted-foreground mb-6">Publish empty seats. Followers will be notified immediately.</p>

            <form onSubmit={handlePublish} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Total Slots</label>
                  <input 
                    type="number" 
                    value={slots}
                    onChange={e => setSlots(parseInt(e.target.value))}
                    min={1}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Closing Time</label>
                  <input 
                    type="time" 
                    value={closingTime}
                    onChange={e => setClosingTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Price per person (Discounted) ₦</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={e => setPrice(parseInt(e.target.value))}
                  min={0}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Menu Note (Short)</label>
                <input 
                  type="text" 
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="e.g. Tonight's menu: Pasta or Rice dishes"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground"
                />
              </div>

              <div className="bg-[rgba(155,109,255,0.05)] border border-[rgba(155,109,255,0.15)] rounded-xl p-4 flex gap-3 text-sm text-[var(--dining)]">
                <div className="mt-0.5">🔔</div>
                <div className="font-medium">
                  Publishing this will send a push notification to your followers.
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'var(--dining)', color: 'white' }}
              >
                Publish Session Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Warning Modal */}
      {showProfileWarning && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-2xl p-6 border border-border shadow-2xl relative animate-in zoom-in-95">
            <button 
              onClick={() => setShowProfileWarning(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-[var(--surface)] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[rgba(155,109,255,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Store size={32} className="text-[var(--dining)]" />
              </div>
              <h2 className="text-xl font-bold mb-2">Profile Incomplete</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Please update your restaurant Address and Name in the Settings page before publishing a session. This is required so buyers can find you.
              </p>
              <Link 
                href="/restaurant/settings"
                onClick={() => setShowProfileWarning(false)}
                className="block w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98] text-center"
                style={{ background: 'var(--dining)', color: 'white' }}
              >
                Go to Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Armchair, TrendingUp, CalendarCheck } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'

export default function RestaurantDashboard() {
  const [sessionActive, setSessionActive] = useState(false)
  const [stats, setStats] = useState({
    slotsFilled: 0,
    slotsTotal: 0,
    guestsExpected: 0,
    sessionsThisMonth: 0,
    avgFillRate: '0%',
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    if (!user) return
    const fetchDashboard = async () => {
      const supabase = createClient()
      
      // Check active session
      const { data: session } = await supabase
        .from('dining_sessions')
        .select('id, slots_total, slots_filled')
        .eq('restaurant_id', user.id)
        .eq('status', 'open')
        .single()

      if (session) {
        setSessionActive(true)
        
        // Fetch reservations for active session
        const { data: res } = await supabase
          .from('reservations')
          .select('id, name, party_size, reserved_at, code, arrived')
          .eq('session_id', session.id)
          .order('reserved_at', { ascending: false })
          
        if (res) {
          const guests = res.reduce((acc, curr) => acc + curr.party_size, 0)
          setStats(s => ({
            ...s,
            slotsFilled: session.slots_filled,
            slotsTotal: session.slots_total,
            guestsExpected: guests
          }))
          setRecentBookings(res)
        }
      }

      // Fetch all sessions this month (simplified for now to all history)
      const { data: allSessions } = await supabase
        .from('dining_sessions')
        .select('slots_total, slots_filled')
        .eq('restaurant_id', user.id)

      if (allSessions && allSessions.length > 0) {
        const totalSessions = allSessions.length
        let totalF = 0
        let totalT = 0
        allSessions.forEach(s => {
          totalF += s.slots_filled
          totalT += s.slots_total
        })
        const avg = totalT > 0 ? Math.round((totalF / totalT) * 100) : 0
        setStats(s => ({
          ...s,
          sessionsThisMonth: totalSessions,
          avgFillRate: `${avg}%`
        }))
      }
    }
    fetchDashboard()
  }, [user])

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your dining sessions and track performance.</p>
        </div>
        {!sessionActive ? (
          <Link 
            href="/restaurant/sessions"
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--dining)] text-white rounded-xl text-sm font-bold transition-all hover:brightness-110 shadow-lg shadow-[var(--dining)]/20"
          >
            <Plus size={16} strokeWidth={3} />
            Open a Session
          </Link>
        ) : (
          <div className="inline-flex items-center px-4 py-2 rounded-xl bg-card border border-[var(--dining)]/30 text-sm font-bold text-[var(--dining)]">
            <div className="w-2 h-2 rounded-full bg-[var(--dining)] animate-pulse mr-2" />
            Session Open
          </div>
        )}
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-card border border-border rounded-2xl p-5 hover:border-[var(--border2)] transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-lg bg-[var(--surface)]"><Armchair size={16} /></div>
            <span className="text-xs font-semibold uppercase tracking-wider">Tonight's Fill</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-foreground">{stats.slotsFilled}</span>
            <span className="text-sm text-muted-foreground mb-1">/ {stats.slotsTotal || '-'} slots</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-card border border-border rounded-2xl p-5 hover:border-[var(--border2)] transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-lg bg-[var(--surface)]"><Users size={16} /></div>
            <span className="text-xs font-semibold uppercase tracking-wider">Guests Expected</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-foreground">{stats.guestsExpected}</span>
            <span className="text-sm text-muted-foreground mb-1">people</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card border border-border rounded-2xl p-5 hover:border-[var(--border2)] transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-lg bg-[var(--surface)]"><CalendarCheck size={16} /></div>
            <span className="text-xs font-semibold uppercase tracking-wider">Sessions This Month</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-foreground">{stats.sessionsThisMonth}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-card border border-border rounded-2xl p-5 hover:border-[var(--border2)] transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-3">
            <div className="p-2 rounded-lg bg-[var(--surface)]"><TrendingUp size={16} /></div>
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Fill Rate</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-[var(--dining)]">{stats.avgFillRate}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Bookings */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Today's Bookings</h2>
            <Link href="/restaurant/sessions" className="text-sm font-semibold text-[var(--dining)] hover:underline">
              Manage Session
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentBookings.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center bg-[var(--surface)] rounded-xl border border-dashed border-border">
                No bookings yet.
              </div>
            ) : (
              recentBookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface)] border border-transparent hover:border-border transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center font-bold text-[var(--dining)]">
                      {booking.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-foreground">{booking.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {booking.party_size} {booking.party_size === 1 ? 'person' : 'people'} · {new Date(booking.reserved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold tracking-widest text-muted-foreground mb-1">{booking.code}</div>
                    {booking.arrived ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">ARRIVED</span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">PENDING</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-xl bg-[var(--surface)] hover:bg-card border border-transparent hover:border-border transition-colors text-sm font-semibold flex items-center justify-between">
                Close Session Early
                <span className="text-muted-foreground">→</span>
              </button>
              <button className="w-full text-left p-3 rounded-xl bg-[var(--surface)] hover:bg-card border border-transparent hover:border-border transition-colors text-sm font-semibold flex items-center justify-between">
                Update Menu Note
                <span className="text-muted-foreground">→</span>
              </button>
            </div>
          </div>

          <div className="bg-[rgba(155,109,255,0.05)] border border-[rgba(155,109,255,0.15)] rounded-2xl p-6">
            <div className="w-8 h-8 rounded-full bg-[rgba(155,109,255,0.1)] flex items-center justify-center text-[var(--dining)] mb-3">
              💡
            </div>
            <h3 className="font-bold text-sm mb-1 text-[var(--dining)]">Pro Tip</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sessions that are published at least 2 hours before closing time see a 40% higher fill rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

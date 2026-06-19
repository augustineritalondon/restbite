'use client'

import { useEffect, useRef, useState } from 'react'

function animateCount(
  target: number, 
  duration: number, 
  onUpdate: (val: number) => void
) {
  let start = 0
  const steps = 60
  const step = target / steps
  const interval = duration / steps
  
  const timer = setInterval(() => {
    start = Math.min(start + step, target)
    onUpdate(Math.floor(start))
    if (start >= target) clearInterval(timer)
  }, interval)
}

export function StatsBar() {
  const [stats, setStats] = useState({
    deals: 0,
    sessions: 0,
    stores: 0,
    waste: 0
  })
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true)
        setTimeout(() => animateCount(247, 1200, (v) => setStats(s => ({ ...s, deals: v }))), 0)
        setTimeout(() => animateCount(18, 1000, (v) => setStats(s => ({ ...s, sessions: v }))), 100)
        setTimeout(() => animateCount(94, 1100, (v) => setStats(s => ({ ...s, stores: v }))), 200)
        setTimeout(() => animateCount(1240, 1300, (v) => setStats(s => ({ ...s, waste: v }))), 300)
        observer.disconnect()
      }
    }, { threshold: 0.5 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasAnimated])

  return (
    <div ref={ref} className="border-y border-border bg-[var(--surface)] p-5 md:p-6 flex flex-wrap justify-center overflow-hidden">
      <div className="text-center px-4 md:px-10 py-2 border-r border-border min-w-[140px] md:min-w-0">
        <div className="text-2xl font-extrabold" style={{ color: 'var(--brand)' }}>{stats.deals.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground mt-0.5">Deals listed today</div>
      </div>
      <div className="text-center px-4 md:px-10 py-2 border-r-0 md:border-r border-border min-w-[140px] md:min-w-0">
        <div className="text-2xl font-extrabold" style={{ color: 'var(--brand)' }}>{stats.sessions.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground mt-0.5">Dining sessions open</div>
      </div>
      <div className="text-center px-4 md:px-10 py-2 border-r border-border min-w-[140px] md:min-w-0 mt-4 md:mt-0">
        <div className="text-2xl font-extrabold" style={{ color: 'var(--brand)' }}>{stats.stores.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground mt-0.5">Stores onboarded</div>
      </div>
      <div className="text-center px-4 md:px-10 py-2 min-w-[140px] md:min-w-0 mt-4 md:mt-0">
        <div className="text-2xl font-extrabold" style={{ color: 'var(--brand)' }}>{stats.waste.toLocaleString()}kg</div>
        <div className="text-xs text-muted-foreground mt-0.5">Food waste prevented</div>
      </div>
    </div>
  )
}

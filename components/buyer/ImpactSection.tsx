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

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const el = ref.current
    if (!el) return
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('opacity-100', 'translate-y-0')
          e.target.classList.remove('opacity-0', 'translate-y-8')
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    
    const revealElements = el.querySelectorAll('.scroll-reveal')
    revealElements.forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [])
  
  return ref
}

export function ImpactSection() {
  const sectionRef = useScrollReveal()
  const statsRef = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState({
    meals: 0,
    waste: 0,
    saved: 0
  })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true)
        animateCount(12400, 1500, (v) => setStats(s => ({ ...s, meals: v })))
        setTimeout(() => animateCount(3200, 1400, (v) => setStats(s => ({ ...s, waste: v }))), 100)
        setTimeout(() => animateCount(2800000, 1500, (v) => setStats(s => ({ ...s, saved: v }))), 200)
        observer.disconnect()
      }
    }, { threshold: 0.4 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasAnimated])

  return (
    <section ref={sectionRef} className="py-16 px-8 max-w-5xl mx-auto">
      <div className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--brand)' }}>Impact</div>
      <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-tight mb-6 leading-[1.15] scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        Every order fights waste
      </h2>
      
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6">
        <div className="bg-card border border-border rounded-2xl p-6 text-center scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out delay-0">
          <div className="text-3xl font-black tracking-tight" style={{ color: 'var(--brand)' }}>{stats.meals.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">Meals rescued from the bin</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 text-center scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
          <div className="text-3xl font-black tracking-tight" style={{ color: 'var(--brand)' }}>{stats.waste.toLocaleString()}kg</div>
          <div className="text-xs text-muted-foreground mt-1">Food waste prevented</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 text-center scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
          <div className="text-3xl font-black tracking-tight" style={{ color: 'var(--brand)' }}>₦{Math.floor(stats.saved / 1000).toLocaleString()}k</div>
          <div className="text-xs text-muted-foreground mt-1">Saved by our community</div>
        </div>
      </div>
    </section>
  )
}

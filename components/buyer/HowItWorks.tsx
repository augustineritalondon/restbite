'use client'

import { useEffect, useRef } from 'react'
import { MapPin, ShoppingCart, CheckCircle2 } from 'lucide-react'

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

export function HowItWorks() {
  const sectionRef = useScrollReveal()

  return (
    <section ref={sectionRef} id="how" className="py-16 px-8 max-w-5xl mx-auto">
      <div className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--brand)' }}>How it works</div>
      <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-tight mb-10 leading-[1.15] scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        Simple. Fast. No waste.
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="bg-[#0F0F1A] border border-border rounded-2xl p-6 scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out delay-0">
          <div className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground mb-3">01</div>
          <div className="text-3xl mb-3 text-[var(--brand)]"><MapPin size={32} /></div>
          <h3 className="text-[15px] font-bold mb-1.5 text-foreground">Open the app</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Allow location access and instantly see discounted groceries and open dining sessions near you, sorted by urgency.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#0F0F1A] border border-border rounded-2xl p-6 scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100">
          <div className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground mb-3">02</div>
          <div className="text-3xl mb-3 text-[var(--urgency)]"><ShoppingCart size={32} /></div>
          <h3 className="text-[15px] font-bold mb-1.5 text-foreground">Grab a deal or book a seat</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Order groceries from one store at a time and choose pickup or delivery — or book a last-minute dining slot in seconds.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#0F0F1A] border border-border rounded-2xl p-6 scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200">
          <div className="text-[11px] font-bold tracking-[0.08em] text-muted-foreground mb-3">03</div>
          <div className="text-3xl mb-3 text-[var(--live)]"><CheckCircle2 size={32} /></div>
          <h3 className="text-[15px] font-bold mb-1.5 text-foreground">Show up and save</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Show your QR code at the store for grocery pickup, or your booking reference at the restaurant door. That's it.
          </p>
        </div>
      </div>
    </section>
  )
}

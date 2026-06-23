'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center p-8 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[420px] h-[420px] bg-[rgba(200,241,53,0.06)] -top-[60px] -left-[100px] animate-blob-a" />
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[380px] h-[380px] bg-[rgba(155,109,255,0.07)] -bottom-[80px] -right-[80px] animate-blob-b" />
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[300px] h-[300px] bg-[rgba(255,107,53,0.05)] top-[40%] left-[60%] animate-blob-c" />

      {/* Floating Cards */}
      <div className="absolute w-full h-full top-0 left-0 pointer-events-none hidden md:block">
        {/* Card 1 */}
        <div 
          className="absolute bg-card border border-[var(--border2)] rounded-2xl p-3 w-[160px] top-[12%] left-[4%] animate-float-a"
          style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
        >
          <div className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mb-1.5">Market deal</div>
          <div className="text-xs font-semibold text-foreground mb-1">Sourdough loaf</div>
          <div><span className="text-sm font-extrabold" style={{ color: 'var(--brand)' }}>₦600</span><span className="text-[10px] text-muted-foreground line-through ml-1">₦2,000</span></div>
          <div className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 tracking-wider bg-[rgba(255,107,53,0.1)] text-[var(--urgency)] border border-[rgba(255,107,53,0.2)]">Today only</div>
        </div>

        {/* Card 2 */}
        <div 
          className="absolute bg-card border border-[var(--border2)] rounded-2xl p-3 w-[160px] top-[18%] right-[4%] animate-float-b delay-[1000ms]"
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
        >
          <div className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mb-1.5">Dining session</div>
          <div className="text-xs font-semibold text-foreground mb-1">Native Tray</div>
          <div className="text-sm font-extrabold" style={{ color: 'var(--brand)' }}>50% OFF</div>
          <div className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 tracking-wider bg-[rgba(155,109,255,0.1)] text-[var(--dining)] border border-[rgba(155,109,255,0.2)]">6 slots left</div>
        </div>

        {/* Card 3 */}
        <div 
          className="absolute bg-card border border-[var(--border2)] rounded-2xl p-3 w-[160px] bottom-[18%] left-[6%] animate-float-c delay-[2000ms]"
          style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}
        >
          <div className="text-[10px] text-muted-foreground font-semibold tracking-wider uppercase mb-1.5">Just saved</div>
          <div className="text-xs font-semibold text-foreground mb-1">Gouda cheese</div>
          <div className="text-sm font-extrabold" style={{ color: 'var(--brand)' }}>₦850</div>
          <div className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 tracking-wider bg-[rgba(200,241,53,0.1)] text-[var(--brand)] border border-[rgba(200,241,53,0.2)]">68% off</div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5 animate-fade-up delay-100 mb-4" style={{ color: 'var(--brand)' }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brand)' }}></div>
          Live deals near you
        </div>
        
        <h1 className="text-[clamp(36px,6vw,72px)] font-black tracking-tight leading-[1.05] animate-fade-up delay-200 mb-5 max-w-[720px]">
          Food that's close to <span style={{ color: 'var(--brand)' }}>its end</span><br />
          shouldn't go to <span style={{ color: 'var(--urgency)' }}>waste</span>
        </h1>
        
        <p className="text-base text-muted-foreground animate-fade-up delay-[350ms] mb-8 max-w-[440px] leading-relaxed">
          Grab near-expiry groceries at huge discounts or book a last-minute table at your favourite restaurant before closing time.
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center animate-fade-up delay-500">
          <Link 
            href="/supermarkets"
            className="text-sm font-bold px-6 py-3 rounded-full border-none cursor-pointer transition-all duration-150 hover:scale-[0.97]"
            style={{ background: 'var(--brand)', color: 'var(--background)' }}
          >
            Browse deals
          </Link>
          <Link 
            href="/restaurants"
            className="text-sm font-medium px-6 py-3 rounded-full border border-[var(--border2)] cursor-pointer transition-all duration-150 hover:border-[var(--brand)] hover:text-[var(--brand)] bg-transparent text-foreground"
          >
            Find dining sessions
          </Link>
        </div>
      </div>
    </section>
  )
}

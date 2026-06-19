'use client'

import { Apple, Play } from 'lucide-react'

export function CallToAction() {
  return (
    <div className="px-4 sm:px-8 mb-16 w-full">
      <div className="bg-[#0F0F1A] border border-border rounded-[24px] p-12 text-center relative overflow-hidden">
        {/* CTA Blobs */}
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[60px] pointer-events-none bg-[rgba(200,241,53,0.07)] -top-[80px] -left-[60px] animate-cta-blob-a" />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[60px] pointer-events-none bg-[rgba(155,109,255,0.07)] -bottom-[80px] -right-[60px] animate-cta-blob-b" />
        
        <div className="relative z-10">
          <h2 className="text-[clamp(22px,3vw,38px)] font-black tracking-tight relative mb-4">Eat well. Spend less. Waste nothing.</h2>
          <p className="text-sm text-muted-foreground mb-8 relative max-w-md mx-auto">The smartest way to shop groceries and dine out in Port Harcourt.</p>
          
          <div className="flex gap-4 justify-center relative flex-wrap items-center">
            <a href="#" className="transition-transform duration-200 hover:-translate-y-1 hover:brightness-110">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="h-[44px] w-auto" />
            </a>
            <a href="#" className="transition-transform duration-200 hover:-translate-y-1 hover:brightness-110">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-[44px] w-auto" />
            </a>
            <button 
              className="font-bold px-6 py-3.5 rounded-2xl border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: 'var(--brand)', color: 'var(--background)' }}
            >
              Use on web
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

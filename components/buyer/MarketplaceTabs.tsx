'use client'

import { useState, useEffect, useRef } from 'react'
import { Heart, Armchair } from 'lucide-react'

// Intersection Observer Hook for scroll reveal
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
    
    // Find all children with the reveal classes
    const revealElements = el.querySelectorAll('.scroll-reveal')
    revealElements.forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [])
  
  return ref
}

export function MarketplaceTabs() {
  const [activeTab, setActiveTab] = useState<'market' | 'dining'>('market')
  const sectionRef = useScrollReveal()

  return (
    <section id="market" ref={sectionRef} className="py-16 px-8 max-w-5xl mx-auto">
      <div className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--brand)' }}>Market</div>
      <h2 className="text-[clamp(24px,3.5vw,40px)] font-extrabold tracking-tight mb-4 leading-[1.15] scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        Near-expiry groceries.<br/>Real discounts.
      </h2>
      <p className="text-[15px] text-muted-foreground max-w-lg leading-relaxed mb-10 scroll-reveal opacity-0 translate-y-8 transition-all duration-700 ease-out">
        Supermarkets and stores near you list products that are close to their expiry date — you grab them at up to 80% off before they get thrown away.
      </p>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-[#15151F] rounded-full p-1 w-fit mb-8">
        <button 
          onClick={() => setActiveTab('market')}
          className={`text-[13px] font-semibold px-5 py-2 rounded-full transition-all duration-200 border ${
            activeTab === 'market' 
              ? 'bg-card text-[var(--brand)] border-[rgba(200,241,53,0.2)]' 
              : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          Groceries
        </button>
        <button 
          onClick={() => setActiveTab('dining')}
          className={`text-[13px] font-semibold px-5 py-2 rounded-full transition-all duration-200 border ${
            activeTab === 'dining' 
              ? 'bg-card text-[var(--dining)] border-[rgba(155,109,255,0.2)]' 
              : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          Dining sessions
        </button>
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px]">
        {/* Groceries Tab */}
        {activeTab === 'market' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 animate-fade-up">
            {/* Prod 1 */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border2)]">
              <div className="h-32 bg-[#15151F] relative border-b border-border">
                <img src="https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80" alt="Gouda cheese block" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[var(--background)]/90 backdrop-blur-sm text-[var(--urgency)] border border-[rgba(255,107,53,0.3)]">EXPIRES TODAY</div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-[var(--urgency)] transition-colors"><Heart size={14} /></div>
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-foreground">Gouda cheese block</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">ShopRite PH Mall · 1.2km</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦850</span>
                  <span className="text-[10px] text-muted-foreground line-through">₦2,600</span>
                </div>
                <div className="text-[10px] font-semibold flex items-center gap-1 mt-1" style={{ color: 'var(--urgency)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--urgency)' }}></div>
                  Expires today
                </div>
              </div>
            </div>
            
            {/* Prod 2 */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border2)]">
              <div className="h-32 bg-[#15151F] relative border-b border-border">
                <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80" alt="Sourdough loaf" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[var(--background)]/90 backdrop-blur-sm text-[var(--brand)] border border-[rgba(200,241,53,0.3)]">EXPIRES IN 2 DAYS</div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-[var(--urgency)] transition-colors"><Heart size={14} /></div>
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-foreground">Sourdough loaf</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Market Square GRA · 0.8km</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦600</span>
                  <span className="text-[10px] text-muted-foreground line-through">₦2,000</span>
                </div>
                <div className="text-[10px] font-medium text-muted-foreground mt-1">2 days left</div>
              </div>
            </div>

            {/* Prod 3 */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border2)]">
              <div className="h-32 bg-[#15151F] relative border-b border-border">
                <img src="https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80" alt="Full cream milk 2L" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[var(--background)]/90 backdrop-blur-sm text-[var(--urgency)] border border-[rgba(255,107,53,0.3)]">EXPIRES TODAY</div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-[var(--urgency)] transition-colors"><Heart size={14} /></div>
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-foreground">Full cream milk 2L</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Spar Port Harcourt · 2.1km</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦1,100</span>
                  <span className="text-[10px] text-muted-foreground line-through">₦3,200</span>
                </div>
                <div className="text-[10px] font-semibold flex items-center gap-1 mt-1" style={{ color: 'var(--urgency)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--urgency)' }}></div>
                  Expires today
                </div>
              </div>
            </div>

            {/* Prod 4 */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border2)]">
              <div className="h-32 bg-[#15151F] relative border-b border-border">
                <img src="https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80" alt="Chicken thighs 1kg" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[var(--background)]/90 backdrop-blur-sm text-[var(--brand)] border border-[rgba(200,241,53,0.3)]">EXPIRES IN 3 DAYS</div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-[var(--urgency)] transition-colors"><Heart size={14} /></div>
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-foreground">Chicken thighs 1kg</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Everyday Supermarket · 3.4km</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦2,400</span>
                  <span className="text-[10px] text-muted-foreground line-through">₦5,000</span>
                </div>
                <div className="text-[10px] font-medium text-muted-foreground mt-1">3 days left</div>
              </div>
            </div>

            {/* Prod 5 */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border2)]">
              <div className="h-32 bg-[#15151F] relative border-b border-border">
                <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80" alt="Fresh Strawberries" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[var(--background)]/90 backdrop-blur-sm text-[var(--urgency)] border border-[rgba(255,107,53,0.3)]">EXPIRES TODAY</div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-[var(--urgency)] transition-colors"><Heart size={14} /></div>
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-foreground">Fresh Strawberries</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">ShopRite PH Mall · 1.2km</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦1,200</span>
                  <span className="text-[10px] text-muted-foreground line-through">₦3,500</span>
                </div>
                <div className="text-[10px] font-semibold flex items-center gap-1 mt-1" style={{ color: 'var(--urgency)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--urgency)' }}></div>
                  Expires today
                </div>
              </div>
            </div>

            {/* Prod 6 */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border2)]">
              <div className="h-32 bg-[#15151F] relative border-b border-border">
                <img src="https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80" alt="Ground Beef 500g" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[var(--background)]/90 backdrop-blur-sm text-[var(--brand)] border border-[rgba(200,241,53,0.3)]">EXPIRES IN 1 DAY</div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-[var(--urgency)] transition-colors"><Heart size={14} /></div>
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-foreground">Ground Beef 500g</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Market Square GRA · 0.8km</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦1,800</span>
                  <span className="text-[10px] text-muted-foreground line-through">₦4,200</span>
                </div>
                <div className="text-[10px] font-medium text-muted-foreground mt-1">1 day left</div>
              </div>
            </div>

            {/* Prod 7 */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border2)]">
              <div className="h-32 bg-[#15151F] relative border-b border-border">
                <img src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80" alt="Organic Spinach" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[var(--background)]/90 backdrop-blur-sm text-[var(--urgency)] border border-[rgba(255,107,53,0.3)]">EXPIRES TODAY</div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-[var(--urgency)] transition-colors"><Heart size={14} /></div>
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-foreground">Organic Spinach</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Spar Port Harcourt · 2.1km</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦300</span>
                  <span className="text-[10px] text-muted-foreground line-through">₦1,000</span>
                </div>
                <div className="text-[10px] font-semibold flex items-center gap-1 mt-1" style={{ color: 'var(--urgency)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--urgency)' }}></div>
                  Expires today
                </div>
              </div>
            </div>

            {/* Prod 8 */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[var(--border2)]">
              <div className="h-32 bg-[#15151F] relative border-b border-border">
                <img src="https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?auto=format&fit=crop&w=400&q=80" alt="Ripe Bananas" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider bg-[var(--background)]/90 backdrop-blur-sm text-[var(--brand)] border border-[rgba(200,241,53,0.3)]">2 DAYS</div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--background)]/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-[var(--urgency)] transition-colors"><Heart size={14} /></div>
              </div>
              <div className="p-3">
                <div className="text-xs font-semibold text-foreground">Ripe Bananas Bunch</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Everyday Supermarket · 3.4km</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦450</span>
                  <span className="text-[10px] text-muted-foreground line-through">₦1,200</span>
                </div>
                <div className="text-[10px] font-medium text-muted-foreground mt-1">2 days left</div>
              </div>
            </div>
          </div>
        )}

        {/* Dining Tab */}
        {activeTab === 'dining' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-up">
            {/* Session 1 */}
            <div className="bg-card border border-border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(155,109,255,0.3)]">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-[rgba(155,109,255,0.1)] border border-[rgba(155,109,255,0.2)]">🍲</div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(155,109,255,0.1)] text-[var(--dining)] border border-[rgba(155,109,255,0.2)] tracking-wider">OPEN NOW</div>
              </div>
              <div className="text-[15px] font-bold text-foreground mb-0.5">Native Tray</div>
              <div className="text-[11px] text-muted-foreground">Nigerian · local cuisine · GRA Phase 2</div>
              <div className="h-[3px] bg-white/5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[var(--dining)] rounded-full transition-all duration-500 w-[60%]"></div>
              </div>
              <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-border">
                <div className="text-[12px] font-semibold flex items-center gap-1" style={{ color: 'var(--live)' }}>
                  <Armchair size={13} /> 8 left
                </div>
                <div className="text-[11px] text-muted-foreground">Closes 10:30pm</div>
                <div className="text-[17px] font-extrabold ml-auto" style={{ color: 'var(--brand)' }}>50% OFF</div>
              </div>
            </div>

            {/* Session 2 */}
            <div className="bg-card border border-border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(155,109,255,0.3)]">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-[rgba(155,109,255,0.1)] border border-[rgba(155,109,255,0.2)]">🍛</div>
                <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(155,109,255,0.1)] text-[var(--dining)] border border-[rgba(155,109,255,0.2)] tracking-wider">OPEN NOW</div>
              </div>
              <div className="text-[15px] font-bold text-foreground mb-0.5">Kilimanjaro</div>
              <div className="text-[11px] text-muted-foreground">Continental · fast food · Peter Odili Road</div>
              <div className="h-[3px] bg-white/5 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[var(--dining)] rounded-full transition-all duration-500 w-[75%]"></div>
              </div>
              <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-border">
                <div className="text-[12px] font-semibold flex items-center gap-1" style={{ color: 'var(--live)' }}>
                  <Armchair size={13} /> 5 left
                </div>
                <div className="text-[11px] text-muted-foreground">Closes 9:45pm</div>
                <div className="text-[17px] font-extrabold ml-auto" style={{ color: 'var(--brand)' }}>40% OFF</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

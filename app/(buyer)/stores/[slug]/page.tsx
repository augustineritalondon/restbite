'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, Clock, Truck, ShoppingBag, Tag, Heart } from 'lucide-react'
import { STORES } from '@/lib/stores'
import { PRODUCTS, expiryLabel } from '@/lib/products'

export default function StoreDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const store = STORES.find(s => s.slug === slug)
  const [isFollowing, setIsFollowing] = useState(false)

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🏪</div>
        <h2 className="text-xl font-bold text-foreground mb-2">Store not found</h2>
        <Link href="/stores" className="text-sm font-bold px-6 py-3 rounded-full mt-4" style={{ background: 'var(--brand)', color: 'var(--background)' }}>
          Browse all stores
        </Link>
      </div>
    )
  }

  const storeProducts = PRODUCTS.filter(p => p.store === store.name).sort((a, b) => a.expiresIn - b.expiresIn)

  return (
    <div className="min-h-screen pb-20">

      {/* Hero banner */}
      <div className="relative h-56 sm:h-72 overflow-hidden bg-muted">
        <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs text-white/70 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={14} /> Back
            </button>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{store.name}</h1>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-sm font-semibold text-white/80">
                <Star size={13} fill="var(--brand)" color="var(--brand)" />
                {store.rating}
              </span>
              <span className="text-white/40 text-xs">·</span>
              <span className="text-xs text-white/60">{store.reviewCount} reviews</span>
              <span className="text-white/40 text-xs">·</span>
              <span className="text-xs text-white/60">{store.distanceKm}km away</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
            style={isFollowing 
              ? { background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }
              : { background: 'var(--brand)', color: 'var(--background)' }
            }
          >
            <Heart size={16} fill={isFollowing ? 'white' : 'transparent'} />
            {isFollowing ? 'Following' : 'Follow Store'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Info row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.2)' }}>
              <Clock size={16} style={{ color: 'var(--brand)' }} />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Open until</div>
              <div className="text-sm font-bold text-foreground">{store.openUntil}</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.2)' }}>
              <Tag size={16} style={{ color: 'var(--brand)' }} />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Active deals</div>
              <div className="text-sm font-bold text-foreground">{store.activeDeals} products</div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.2)' }}>
              <MapPin size={16} style={{ color: 'var(--brand)' }} />
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Address</div>
              <div className="text-sm font-bold text-foreground leading-tight">{store.address}</div>
            </div>
          </div>
        </div>

        {/* Fulfilment */}
        <div className="flex gap-3 mb-10">
          {store.hasPickup && (
            <div className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border font-semibold" style={{ background: 'rgba(200,241,53,0.06)', color: 'var(--brand)', borderColor: 'rgba(200,241,53,0.2)' }}>
              <ShoppingBag size={15} /> Pickup available
            </div>
          )}
          {store.hasDelivery && (
            <div className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border font-semibold" style={{ background: 'rgba(0,212,200,0.06)', color: 'var(--live)', borderColor: 'rgba(0,212,200,0.2)' }}>
              <Truck size={15} /> Delivery available
            </div>
          )}
        </div>

        {/* Deals from this store */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black tracking-tight text-foreground">Deals from this store</h2>
          <span className="text-xs text-muted-foreground">Sorted by expiry</span>
        </div>

        {storeProducts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-4xl mb-3">📦</div>
            <p className="font-semibold text-foreground">No active deals right now</p>
            <p className="text-sm mt-1">Check back later for new listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {storeProducts.map(product => {
              const exp = expiryLabel(product.expiresIn)
              return (
                <Link
                  key={product.id}
                  href={`/supermarkets/${product.id}`}
                  className="group bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(200,241,53,0.3)] hover:shadow-lg"
                >
                  <div className="h-36 relative overflow-hidden bg-muted">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider backdrop-blur-sm" style={{ color: exp.color, background: exp.bg, border: `1px solid ${exp.border}` }}>
                      {exp.text}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-semibold text-foreground leading-tight mb-1 line-clamp-2">{product.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦{product.price.toLocaleString()}</span>
                      <span className="text-[10px] text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</span>
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--brand)' }}>-{product.discountPct}%</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

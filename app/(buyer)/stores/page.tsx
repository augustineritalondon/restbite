'use client'

import Link from 'next/link'
import { MapPin, Star, Truck, ShoppingBag, Tag } from 'lucide-react'
import { STORES } from '@/lib/stores'

export default function StoresPage() {
  return (
    <div className="min-h-screen pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--brand)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brand)' }} />
            Near you in Port Harcourt
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Stores</h1>
          <p className="text-muted-foreground mt-2 text-sm">Browse stores near you and see their active deals.</p>
        </div>

        {/* Store grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {STORES.map((store, i) => (
            <Link
              key={store.id}
              href={`/stores/${store.slug}`}
              className="group bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(200,241,53,0.3)] hover:shadow-xl"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Store image */}
              <div className="relative h-48 overflow-hidden bg-[#15151F]">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge */}
                {store.badge && (
                  <div className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide" style={{ background: 'var(--brand)', color: 'var(--background)' }}>
                    {store.badge}
                  </div>
                )}

                {/* Deals count */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm" style={{ background: 'rgba(200,241,53,0.15)', color: 'var(--brand)', border: '1px solid rgba(200,241,53,0.25)' }}>
                  <Tag size={11} />
                  {store.activeDeals} active deals
                </div>
              </div>

              {/* Store info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="font-bold text-foreground text-base leading-tight">{store.name}</h2>
                    <div className="text-xs text-muted-foreground capitalize mt-0.5">{store.category}</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <Star size={13} fill="var(--brand)" color="var(--brand)" />
                    <span className="text-sm font-bold" style={{ color: 'var(--brand)' }}>{store.rating}</span>
                    <span className="text-xs text-muted-foreground">({store.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 mb-3">
                  <MapPin size={12} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">{store.address}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {store.hasPickup && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(200,241,53,0.08)', color: 'var(--brand)', border: '1px solid rgba(200,241,53,0.15)' }}>
                        <ShoppingBag size={10} /> Pickup
                      </span>
                    )}
                    {store.hasDelivery && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: 'rgba(0,212,200,0.08)', color: 'var(--live)', border: '1px solid rgba(0,212,200,0.15)' }}>
                        <Truck size={10} /> Delivery
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={11} /> {store.distanceKm}km
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

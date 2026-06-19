'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, Clock, Truck, ShoppingBag, Heart, ChevronLeft, ChevronRight, AlertCircle, Package } from 'lucide-react'
import { PRODUCTS, expiryLabel } from '@/lib/products'
import { storeSlug } from '@/lib/stores'
import { useCartStore } from '@/lib/store/cartStore'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const product = PRODUCTS.find(p => p.id === id)
  const { addItem } = useCartStore()

  const [qty, setQty] = useState(1)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'ingredients' | 'allergens'>('ingredients')

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-foreground mb-2">Product not found</h2>
        <p className="text-muted-foreground text-sm mb-6">This deal may have already been snapped up.</p>
        <Link href="/supermarkets" className="text-sm font-bold px-6 py-3 rounded-full" style={{ background: 'var(--brand)', color: 'var(--background)' }}>
          Browse all deals
        </Link>
      </div>
    )
  }

  const exp = expiryLabel(product.expiresIn)
  const savings = product.originalPrice - product.price

  // Related products (same category, different id)
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen pb-24">
      {/* Back nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to deals
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Left: Image ── */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden bg-[#15151F] aspect-square relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Expiry badge */}
              <div
                className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full tracking-wider backdrop-blur-sm flex items-center gap-1.5"
                style={{ color: exp.color, background: exp.bg, border: `1px solid ${exp.border}` }}
              >
                {product.expiresIn === 0 && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: exp.color }} />}
                {exp.text}
              </div>
              {/* Save button */}
              <button
                onClick={() => setSaved(s => !s)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
                style={{ background: saved ? 'rgba(255,107,53,0.2)' : 'rgba(0,0,0,0.4)', border: `1px solid ${saved ? 'rgba(255,107,53,0.4)' : 'rgba(255,255,255,0.1)'}` }}
              >
                <Heart size={18} fill={saved ? 'var(--urgency)' : 'none'} color={saved ? 'var(--urgency)' : 'white'} />
              </button>
            </div>

            {/* Discount badge */}
            <div
              className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full flex flex-col items-center justify-center font-black shadow-xl"
              style={{ background: 'var(--brand)', color: 'var(--background)' }}
            >
              <span className="text-xl leading-none">-{product.discountPct}%</span>
              <span className="text-[9px] font-bold tracking-widest uppercase">OFF</span>
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-6 pt-2">

            {/* Category + name */}
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2 capitalize">{product.category}</div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight mb-1">{product.name}</h1>
              <p className="text-sm text-muted-foreground">{product.store} · {product.distanceKm}km away</p>
            </div>

            {/* Expiry prominence */}
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 border"
              style={{ background: exp.bg, borderColor: exp.border }}
            >
              <AlertCircle size={20} style={{ color: exp.color }} className="flex-shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Expiry</div>
                <div className="text-sm font-bold" style={{ color: exp.color }}>
                  {product.expiresIn === 0 ? 'Expires TODAY — grab now!' : `Expires in ${product.expiresIn} day${product.expiresIn > 1 ? 's' : ''}`}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Sale price</div>
                <div className="text-4xl font-black" style={{ color: 'var(--brand)' }}>₦{product.price.toLocaleString()}</div>
              </div>
              <div className="pb-1">
                <div className="text-base text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</div>
                <div className="text-xs font-bold" style={{ color: 'var(--brand)' }}>You save ₦{savings.toLocaleString()}</div>
              </div>
            </div>

            {/* Quantity selector */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quantity</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0 bg-card border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--surface)] transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-foreground">{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.quantityLeft, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[var(--surface)] transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Package size={13} />
                  <span><span className="font-semibold text-foreground">{product.quantityLeft}</span> left in store</span>
                </div>
              </div>
            </div>

            {/* Pickup / Delivery */}
            <div className="flex gap-3">
              {product.hasPickup && (
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  <ShoppingBag size={13} style={{ color: 'var(--brand)' }} />
                  Pickup available
                </div>
              )}
              {product.hasDelivery && (
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  <Truck size={13} style={{ color: 'var(--brand)' }} />
                  Delivery available
                </div>
              )}
            </div>

            {/* Ingredients / Allergens tabs */}
            <div>
              <div className="flex gap-1 mb-3 bg-[#15151F] rounded-xl p-1 w-fit">
                {(['ingredients', 'allergens'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-150 capitalize"
                    style={tab === t
                      ? { background: 'var(--card)', color: 'var(--foreground)' }
                      : { background: 'transparent', color: 'var(--muted-foreground)' }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {tab === 'ingredients' && product.ingredients}
                {tab === 'allergens' && (
                  product.allergens.length > 0
                    ? (
                      <div className="flex flex-wrap gap-2">
                        {product.allergens.map(a => (
                          <span key={a} className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(255,107,53,0.1)', color: 'var(--urgency)', border: '1px solid rgba(255,107,53,0.2)' }}>
                            ⚠️ {a}
                          </span>
                        ))}
                      </div>
                    )
                    : <span className="text-xs text-muted-foreground">No common allergens declared.</span>
                )}
              </div>
            </div>

            {/* Store card */}
            <div className="border border-border rounded-2xl p-4 bg-card">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Store</div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(200,241,53,0.1)', border: '1px solid rgba(200,241,53,0.2)' }}>
                  🏪
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/stores/${storeSlug(product.store)}`} className="font-bold text-foreground text-sm hover:text-[var(--brand)] transition-colors">
                    {product.store}
                  </Link>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star size={11} fill="var(--brand)" color="var(--brand)" />
                    <span className="text-xs font-semibold" style={{ color: 'var(--brand)' }}>{product.storeRating}</span>
                    <span className="text-xs text-muted-foreground">· {product.distanceKm}km</span>
                  </div>
                  <div className="flex items-start gap-1 mt-1">
                    <MapPin size={11} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{product.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  addItem(product, qty)
                  // Optional: add a small toast/notification here later
                }}
                className="flex-1 py-4 rounded-2xl text-sm font-black tracking-wide border border-[var(--border2)] transition-all duration-150 hover:border-[var(--brand)] hover:text-[var(--brand)] bg-transparent text-foreground flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} /> Add to cart
              </button>
              <button
                onClick={() => {
                  addItem(product, qty)
                  router.push(`/stores/${storeSlug(product.store)}/checkout`)
                }}
                className="flex-1 py-4 rounded-2xl text-sm font-black tracking-wide transition-all duration-150 hover:scale-[0.98] hover:brightness-95"
                style={{ background: 'var(--brand)', color: 'var(--background)' }}
              >
                Checkout now
              </button>
            </div>
          </div>
        </div>

        {/* Related deals */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-black tracking-tight text-foreground mb-6">More {product.category} deals</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => {
                const e = expiryLabel(p.expiresIn)
                return (
                  <Link
                    key={p.id}
                    href={`/supermarkets/${p.id}`}
                    className="bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(200,241,53,0.3)] group"
                  >
                    <div className="h-32 relative overflow-hidden bg-[#15151F]">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider backdrop-blur-sm" style={{ color: e.color, background: e.bg, border: `1px solid ${e.border}` }}>
                        {e.text}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-semibold text-foreground line-clamp-1 mb-1">{p.name}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-extrabold" style={{ color: 'var(--brand)' }}>₦{p.price.toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground line-through">₦{p.originalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

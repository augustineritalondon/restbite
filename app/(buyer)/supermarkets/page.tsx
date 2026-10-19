'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, SlidersHorizontal, MapPin, Heart, X } from 'lucide-react'
import { PRODUCTS, CATEGORIES, expiryLabel, type Product } from '@/lib/products'
import { storeSlug } from '@/lib/stores'

export default function SupermarketsPage() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [maxDistance, setMaxDistance] = useState(10)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const searchRef = useRef<HTMLDivElement>(null)

  // Auto-suggest
  useEffect(() => {
    if (query.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    const q = query.toLowerCase()
    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.store.toLowerCase().includes(q) || p.category.includes(q)
    ).slice(0, 5)
    setSuggestions(matches)
    setShowSuggestions(true)
  }, [query])

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = useMemo(() => {
    return PRODUCTS
      .filter(p => {
        const matchCat = selectedCategory === 'all' || p.category === selectedCategory
        const matchDist = p.distanceKm <= maxDistance
        const matchQ = query.trim().length < 2 || p.name.toLowerCase().includes(query.toLowerCase()) || p.store.toLowerCase().includes(query.toLowerCase())
        return matchCat && matchDist && matchQ
      })
      .sort((a, b) => a.expiresIn - b.expiresIn) // soonest expiry first
  }, [query, selectedCategory, maxDistance])

  function toggleSave(id: string) {
    setSavedIds(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  const distanceOptions = [1, 5, 10]

  return (
    <div className="min-h-screen pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--brand)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--brand)' }} />
            Near-expiry deals
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Supermarket Deals</h1>
          <p className="text-muted-foreground mt-2 text-sm">Sorted by expiry — grab before they're gone.</p>
        </div>

        {/* Search + Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">

          {/* Search */}
          <div ref={searchRef} className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search products, stores…"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[var(--brand)] transition-colors"
            />
            {query && (
              <button onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false) }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <X size={14} />
              </button>
            )}

            {/* Auto-suggest dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                {suggestions.map(s => {
                  const exp = expiryLabel(s.expiresIn)
                  return (
                    <Link
                      key={s.id}
                      href={`/supermarkets/${s.id}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--surface)] transition-colors"
                    >
                      <img src={s.image} alt={s.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.store}</div>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ color: exp.color, background: exp.bg, border: `1px solid ${exp.border}` }}>
                        {exp.text}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Distance pills */}
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-1.5">
            <MapPin size={13} className="text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground mr-1 flex-shrink-0">Within</span>
            {distanceOptions.map(d => (
              <button
                key={d}
                onClick={() => setMaxDistance(d)}
                className="text-xs font-bold px-3 py-1 rounded-full transition-all duration-150"
                style={maxDistance === d
                  ? { background: 'var(--brand)', color: 'var(--background)' }
                  : { background: 'transparent', color: 'var(--muted-foreground)' }
                }
              >
                {d}km
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-150"
              style={selectedCategory === cat.value
                ? { background: 'rgba(200,241,53,0.12)', color: 'var(--brand)', borderColor: 'rgba(200,241,53,0.35)' }
                : { background: 'var(--card)', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> deals found
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal size={12} />
            Sorted by expiry
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-foreground">No deals found</p>
            <p className="text-sm mt-1">Try a different filter or increase your distance</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((product, i) => {
              const exp = expiryLabel(product.expiresIn)
              const isSaved = savedIds.has(product.id)
              return (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(200,241,53,0.3)] hover:shadow-lg group"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <Link href={`/supermarkets/${product.id}`} className="block">
                    {/* Image */}
                    <div className="h-36 relative overflow-hidden bg-muted">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Expiry badge */}
                      <div
                        className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider backdrop-blur-sm"
                        style={{ color: exp.color, background: exp.bg, border: `1px solid ${exp.border}` }}
                      >
                        {exp.text}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-3">
                      <div className="text-[11px] text-muted-foreground capitalize mb-0.5">{product.category} · {product.distanceKm}km</div>
                      <div className="text-sm font-semibold text-foreground leading-tight mb-2 line-clamp-2">{product.name}</div>
                      <div className="text-[10px] text-muted-foreground mb-2">
                        <Link
                          href={`/stores/${storeSlug(product.store)}`}
                          onClick={e => e.stopPropagation()}
                          className="hover:text-[var(--brand)] transition-colors truncate block"
                        >
                          {product.store}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦{product.price.toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</span>
                        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--brand)' }}>-{product.discountPct}%</span>
                      </div>
                    </div>
                  </Link>

                  {/* Save button — outside Link to avoid navigation */}
                  <div className="px-3 pb-3 -mt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(product.id) }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150"
                      style={isSaved
                        ? { background: 'rgba(255,107,53,0.1)', color: 'var(--urgency)', borderColor: 'rgba(255,107,53,0.3)' }
                        : { background: 'transparent', color: 'var(--muted-foreground)', borderColor: 'var(--border)' }
                      }
                    >
                      <Heart size={11} fill={isSaved ? 'currentColor' : 'none'} />
                      {isSaved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

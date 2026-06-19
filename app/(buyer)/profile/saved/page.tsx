'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Flame, Star, MapPin } from 'lucide-react'
import { PRODUCTS, expiryLabel, Product } from '@/lib/products'
import { STORES } from '@/lib/stores'

type SavedProduct = Product & { priceDropped?: boolean }

export default function SavedItemsPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products')

  // Mock saved items: pick a few from PRODUCTS, and add a mock "sold out" one
  const savedProducts: SavedProduct[] = [
    ...PRODUCTS.slice(0, 3).map((p, i) => ({
      ...p,
      // Fake a price drop for the second item
      priceDropped: i === 1,
    })),
    // Sold out item
    {
      ...PRODUCTS[4],
      id: 'mock-sold-out',
      quantityLeft: 0,
    }
  ]

  // Mock followed stores: take first 2
  const followedStores = STORES.slice(0, 2).map((s, i) => ({
    ...s,
    newDealsCount: i === 0 ? 3 : 0
  }))

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Saved</h1>
        <p className="text-muted-foreground mt-1 text-sm">Products you're watching and stores you follow.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-card border border-border p-1 rounded-xl overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 min-w-[100px] text-sm font-bold py-2.5 rounded-lg transition-colors ${
            activeTab === 'products' 
              ? 'bg-[var(--brand)] text-[var(--background)] shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-surface'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`flex-1 min-w-[100px] text-sm font-bold py-2.5 rounded-lg transition-colors ${
            activeTab === 'stores' 
              ? 'bg-[var(--brand)] text-[var(--background)] shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-surface'
          }`}
        >
          Stores
        </button>
      </div>

      {/* Content */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {savedProducts.map(product => {
            const isSoldOut = product.quantityLeft === 0
            const exp = expiryLabel(product.expiresIn)
            
            return (
              <Link
                key={product.id}
                href={isSoldOut ? '#' : `/supermarkets/${product.id}`}
                className={`group bg-card border border-border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isSoldOut ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:-translate-y-1 hover:border-[rgba(200,241,53,0.3)] hover:shadow-lg'
                }`}
              >
                <div className="h-36 relative overflow-hidden bg-[#15151F]">
                  <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-transform duration-500 ${!isSoldOut && 'group-hover:scale-105'}`} />
                  
                  {/* Badges */}
                  {!isSoldOut && (
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 align-start items-start">
                      <div className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider backdrop-blur-sm" style={{ color: exp.color, background: exp.bg, border: `1px solid ${exp.border}` }}>
                        {exp.text}
                      </div>
                      {product.priceDropped && (
                        <div className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider flex items-center gap-1 backdrop-blur-sm" style={{ background: 'rgba(255,107,53,0.9)', color: '#fff' }}>
                          <Flame size={10} /> Price Dropped
                        </div>
                      )}
                    </div>
                  )}

                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="font-bold text-white uppercase tracking-widest text-sm">Sold Out</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-foreground leading-tight mb-1 line-clamp-2">{product.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{product.store}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-extrabold" style={{ color: 'var(--brand)' }}>₦{product.price.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {activeTab === 'stores' && (
        <div className="flex flex-col gap-4">
          {followedStores.map(store => (
            <Link
              key={store.id}
              href={`/stores/${store.slug}`}
              className="group flex flex-col sm:flex-row gap-4 bg-card border border-border p-4 rounded-2xl hover:border-[rgba(200,241,53,0.3)] transition-colors"
            >
              <img src={store.image} alt={store.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-foreground text-lg group-hover:text-[var(--brand)] transition-colors">{store.name}</h3>
                  {store.newDealsCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--brand)] text-[var(--background)]">
                      {store.newDealsCount} new today
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1 font-semibold">
                    <Star size={12} fill="currentColor" className="text-[var(--brand)]" />
                    {store.rating}
                  </span>
                  <span>•</span>
                  <span>{store.activeDeals} total active deals</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} />
                  {store.address}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

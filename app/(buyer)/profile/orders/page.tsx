'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode, MapPin, CheckCircle2, RotateCcw, Star, XCircle } from 'lucide-react'

type TabType = 'pending' | 'completed' | 'cancelled'

// Extended Mock order history
const ORDERS = [
  {
    id: 'ORD-A9F3K2',
    storeName: 'Spar Port Harcourt',
    date: 'Today, 2:45 PM',
    status: 'pending',
    label: 'Ready for pickup',
    total: 3450,
    itemsCount: 4,
    pickupCode: '849201',
    address: 'Garden City Mall, Stadium Road, PH',
    storeSlug: 'spar-ph',
  },
  {
    id: 'ORD-B7M1L9',
    storeName: 'Market Square GRA',
    date: 'Yesterday, 6:10 PM',
    status: 'completed',
    label: 'Completed',
    total: 1800,
    itemsCount: 2,
    pickupCode: '110392',
    address: 'GRA Phase 2, Peter Odili Road, Port Harcourt',
    storeSlug: 'market-square-gra',
  },
  {
    id: 'ORD-C2X8N4',
    storeName: 'ShopRite PH Mall',
    date: 'Jun 15, 2026',
    status: 'completed',
    label: 'Completed',
    total: 5600,
    itemsCount: 5,
    pickupCode: '592811',
    address: 'Shop 142, Port Harcourt Mall, Woji Road, PH',
    storeSlug: 'shoprite-ph',
  },
  {
    id: 'ORD-X9Y2Z1',
    storeName: 'Kilimanjaro GRA',
    date: 'Jun 10, 2026',
    status: 'cancelled',
    label: 'Cancelled',
    total: 2100,
    itemsCount: 1,
    pickupCode: '-',
    address: 'Aba Road, GRA, Port Harcourt',
    storeSlug: 'kilimanjaro-gra',
  }
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('pending')

  const filteredOrders = ORDERS.filter(order => order.status === activeTab)

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-foreground">My Orders</h1>
        <p className="text-muted-foreground mt-1 text-sm">View your past deals and active pickup codes.</p>
      </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-card border border-border p-1 rounded-xl overflow-x-auto hide-scrollbar">
          {(['pending', 'completed', 'cancelled'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] text-sm font-bold py-2.5 rounded-lg capitalize transition-colors ${
                activeTab === tab 
                  ? 'bg-[var(--brand)] text-[var(--background)] shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-card border border-border rounded-2xl">
              <div className="text-4xl mb-3 text-muted-foreground">📭</div>
              <p className="font-semibold text-foreground">No {activeTab} orders</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isPending = order.status === 'pending'
              const isCompleted = order.status === 'completed'
              const isCancelled = order.status === 'cancelled'

              return (
                <div 
                  key={order.id} 
                  className={`bg-card border rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-6 ${isPending ? 'border-[var(--brand)] shadow-lg' : 'border-border'}`}
                >
                  {/* Left side: details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground font-semibold">{order.date}</div>
                      <div 
                        className="text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                        style={
                          isPending ? { background: 'rgba(200,241,53,0.1)', color: 'var(--brand)', border: '1px solid rgba(200,241,53,0.2)' } :
                          isCancelled ? { background: 'rgba(255,107,53,0.1)', color: 'var(--urgency)', border: '1px solid rgba(255,107,53,0.2)' } :
                          { background: 'var(--surface)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }
                        }
                      >
                        {order.label}
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-foreground mb-1">{order.storeName}</h2>
                    
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
                      <MapPin size={12} />
                      <span>{order.address}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold text-foreground">₦{order.total.toLocaleString()}</span>
                        <span className="text-muted-foreground"> • {order.itemsCount} items</span>
                      </div>
                      <span className="text-xs text-muted-foreground">ID: {order.id}</span>
                    </div>
                  </div>

                  {/* Right side: Conditional Actions based on status */}
                  <div className="flex flex-col gap-3 min-w-[140px]">
                    {isPending && (
                      <div className="bg-[var(--surface)] border border-border rounded-xl p-4 flex flex-col items-center justify-center flex-1">
                        <div className="bg-white p-2 rounded-lg mb-2">
                          <QrCode size={60} className="text-black" />
                        </div>
                        <div className="text-xl font-black tracking-[0.2em]" style={{ color: 'var(--brand)' }}>
                          {order.pickupCode}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Show at pickup</div>
                      </div>
                    )}

                    {isCompleted && (
                      <>
                        <div className="flex-1 flex flex-col items-center justify-center border border-border border-dashed rounded-xl p-4 text-muted-foreground">
                          <CheckCircle2 size={32} className="opacity-50 mb-2" />
                          <span className="text-xs font-semibold">Collected</span>
                        </div>
                        <button onClick={() => alert('Rating modal opens')} className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-lg border border-[var(--brand)] text-[var(--brand)] hover:bg-[rgba(200,241,53,0.1)] transition-colors">
                          <Star size={14} fill="currentColor" /> Rate Store
                        </button>
                      </>
                    )}

                    {isCancelled && (
                      <div className="flex-1 flex flex-col items-center justify-center border border-[rgba(255,107,53,0.3)] bg-[rgba(255,107,53,0.05)] rounded-xl p-4" style={{ color: 'var(--urgency)' }}>
                        <XCircle size={32} className="mb-2 opacity-80" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Voided</span>
                      </div>
                    )}

                    {/* Reorder Button (for completed or cancelled) */}
                    {!isPending && (
                      <Link 
                        href={`/stores/${order.storeSlug}`}
                        className="flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-lg bg-surface hover:bg-border transition-colors text-foreground mt-auto"
                      >
                        <RotateCcw size={14} /> Reorder
                      </Link>
                    )}
                  </div>

                </div>
              )
            })
          )}
        </div>
    </div>
  )
}

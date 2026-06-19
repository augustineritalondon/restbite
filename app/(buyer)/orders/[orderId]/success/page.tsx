'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, QrCode, Store, ChevronRight } from 'lucide-react'

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>()
  
  // Generating a mock 6-digit pickup code
  const pickupCode = Math.floor(100000 + Math.random() * 900000).toString()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[rgba(200,241,53,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} style={{ color: 'var(--brand)' }} />
        </div>
        
        <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Your payment was successful and your order #{orderId} is secured.
        </p>

        {/* QR Code & Pickup section */}
        <div className="bg-[var(--surface)] border border-border rounded-2xl p-6 mb-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Show this to the store</p>
          <div className="bg-white p-4 rounded-xl inline-block mb-4">
            {/* Mock QR Code - normally you'd generate a real one with a library */}
            <QrCode size={120} className="text-black" />
          </div>
          <div className="text-3xl font-black tracking-[0.2em] mb-4" style={{ color: 'var(--brand)' }}>
            {pickupCode}
          </div>
          
          <button 
            onClick={() => window.alert('QR Code saved to gallery! (Mock)')}
            className="text-xs font-bold px-4 py-2 rounded-lg border border-[var(--brand)] text-[var(--brand)] hover:bg-[rgba(200,241,53,0.1)] transition-colors"
          >
            Download QR Code
          </button>
        </div>

        {/* Next Steps */}
        <div className="text-left space-y-4 mb-8">
          <div className="flex gap-3 items-start">
            <Store className="text-[var(--brand)] mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-sm">Head to the store</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Show your QR code or 6-digit pin at the collection counter before the store closes.</p>
            </div>
          </div>
        </div>

        <Link 
          href="/supermarkets"
          className="w-full flex justify-center py-4 rounded-2xl text-sm font-black tracking-wide transition-all duration-150 hover:scale-[0.98]"
          style={{ background: 'var(--brand)', color: 'var(--background)' }}
        >
          Keep exploring deals
        </Link>
        
        <div className="mt-4">
          <Link href="/profile/orders" className="text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
            View order receipt <ChevronRight size={12} />
          </Link>
        </div>

      </div>
    </div>
  )
}

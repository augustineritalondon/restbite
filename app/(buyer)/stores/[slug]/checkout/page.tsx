'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, Truck, ShoppingBag, ShieldCheck } from 'lucide-react'
import { STORES } from '@/lib/stores'
import { useCartStore, selectStoreName, selectSubtotal, selectTotalSavings } from '@/lib/store/cartStore'

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const store = STORES.find(s => s.slug === slug)
  
  const items = useCartStore(s => s.items)
  const storeName = useCartStore(selectStoreName)
  const removeItem = useCartStore(s => s.removeItem)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const clearCart = useCartStore(s => s.clearCart)
  const subtotal = useCartStore(selectSubtotal)
  const totalSavings = useCartStore(selectTotalSavings)
  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup')
  const [isProcessing, setIsProcessing] = useState(false)

  // Determine initial fulfillment based on store capabilities
  useEffect(() => {
    if (store) {
      if (store.hasPickup && !store.hasDelivery) setFulfillment('pickup')
      else if (store.hasDelivery && !store.hasPickup) setFulfillment('delivery')
      // else default is pickup if both exist
    }
  }, [store])

  if (!store || (storeName && storeName !== store.name)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold text-foreground mb-2">Cart mismatch or Store not found</h2>
        <p className="text-muted-foreground text-sm mb-6">You can only checkout items from one store at a time.</p>
        <Link href="/supermarkets" className="text-sm font-bold px-6 py-3 rounded-full" style={{ background: 'var(--brand)', color: 'var(--background)' }}>
          Browse all deals
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm mb-6">Looks like you haven't added anything yet.</p>
        <button onClick={() => router.back()} className="text-sm font-bold px-6 py-3 rounded-full" style={{ background: 'var(--brand)', color: 'var(--background)' }}>
          Go back
        </button>
      </div>
    )
  }

  const deliveryFee = fulfillment === 'delivery' ? 1000 : 0
  const orderTotal = subtotal + deliveryFee

  const handlePayment = () => {
    setIsProcessing(true)
    // Mocking payment delay
    setTimeout(() => {
      clearCart()
      const mockOrderId = Math.random().toString(36).substring(2, 10).toUpperCase()
      router.push(`/orders/${mockOrderId}/success`)
    }, 2000)
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Back nav */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to shopping
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Store Header */}
        <div className="flex items-center gap-4 mb-8 bg-card border border-border p-4 rounded-2xl">
          <img src={store.image} alt={store.name} className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <h1 className="text-xl font-black text-foreground">{store.name}</h1>
            <p className="text-sm text-muted-foreground">{store.address}</p>
          </div>
        </div>

        {/* Cart Items */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">Your Items</h2>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1">{item.product.name}</h3>
                      <div className="text-xs text-muted-foreground mt-1">
                        <span className="line-through mr-2">₦{item.product.originalPrice.toLocaleString()}</span>
                        <span className="font-bold" style={{ color: 'var(--brand)' }}>₦{item.product.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-[var(--urgency)] transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 border border-border rounded-lg p-1 bg-background">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-sm font-black">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment Options */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">How to get your order</h2>
          <div className="flex gap-4">
            <label className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${!store.hasPickup ? 'opacity-50 cursor-not-allowed' : ''} ${fulfillment === 'pickup' ? 'border-[var(--brand)] bg-[rgba(200,241,53,0.05)]' : 'border-border bg-card'}`}>
              <input 
                type="radio" 
                name="fulfillment" 
                value="pickup" 
                className="sr-only" 
                checked={fulfillment === 'pickup'} 
                onChange={() => store.hasPickup && setFulfillment('pickup')}
                disabled={!store.hasPickup}
              />
              <ShoppingBag size={24} className={fulfillment === 'pickup' ? 'text-[var(--brand)]' : 'text-muted-foreground'} />
              <span className="font-semibold text-sm">Store Pickup</span>
              <span className="text-xs text-muted-foreground">Free</span>
            </label>
            <label className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${!store.hasDelivery ? 'opacity-50 cursor-not-allowed' : ''} ${fulfillment === 'delivery' ? 'border-[var(--brand)] bg-[rgba(200,241,53,0.05)]' : 'border-border bg-card'}`}>
              <input 
                type="radio" 
                name="fulfillment" 
                value="delivery" 
                className="sr-only" 
                checked={fulfillment === 'delivery'} 
                onChange={() => store.hasDelivery && setFulfillment('delivery')}
                disabled={!store.hasDelivery}
              />
              <Truck size={24} className={fulfillment === 'delivery' ? 'text-[var(--brand)]' : 'text-muted-foreground'} />
              <span className="font-semibold text-sm">Delivery</span>
              <span className="text-xs text-muted-foreground">₦1,000</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border p-6 rounded-2xl mb-8">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Fulfillment ({fulfillment})</span>
              <span>{deliveryFee > 0 ? `₦${deliveryFee.toLocaleString()}` : 'Free'}</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="font-bold">Total to pay</span>
              <span className="text-2xl font-black text-foreground">₦{orderTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold px-3 py-2 rounded-lg mt-4" style={{ background: 'rgba(200,241,53,0.1)', color: 'var(--brand)' }}>
              <span className="flex items-center gap-1.5"><ShieldCheck size={14}/> Total Savings</span>
              <span>₦{totalSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-black tracking-wide transition-all duration-150 hover:scale-[0.98] hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: 'var(--brand)', color: 'var(--background)' }}
        >
          {isProcessing ? (
            <span className="w-5 h-5 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <>
              <CreditCard size={18} /> Pay ₦{orderTotal.toLocaleString()} securely
            </>
          )}
        </button>
        <p className="text-center text-xs text-muted-foreground mt-4">
          Secured by Paystack / Flutterwave
        </p>

      </div>
    </div>
  )
}

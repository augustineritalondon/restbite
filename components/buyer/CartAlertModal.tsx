'use client'

import { useCartStore, selectStoreName } from '@/lib/store/cartStore'

export function CartAlertModal() {
  const { pendingItem, confirmPendingItem, cancelPendingItem } = useCartStore()
  const storeName = useCartStore(selectStoreName)

  if (!pendingItem) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-up">
        <h3 className="text-lg font-black text-foreground mb-2">Clear your cart?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your cart contains items from <strong className="text-foreground">{storeName}</strong>. You can only checkout from one store at a time. Do you want to clear your cart and add this item from <strong className="text-foreground">{pendingItem.product.store}</strong>?
        </p>
        <div className="flex gap-3">
          <button 
            onClick={cancelPendingItem}
            className="flex-1 py-3 rounded-xl text-sm font-semibold border border-border hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={confirmPendingItem}
            className="flex-1 py-3 rounded-xl text-sm font-black transition-colors"
            style={{ background: 'rgba(255,107,53,0.1)', color: 'var(--urgency)', border: '1px solid rgba(255,107,53,0.3)' }}
          >
            Clear & Add
          </button>
        </div>
      </div>
    </div>
  )
}

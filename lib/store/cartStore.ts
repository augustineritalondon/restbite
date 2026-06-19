import { create } from 'zustand'
import { Product } from '@/lib/products'

export type CartItem = {
  product: Product
  quantity: number
}

type CartState = {
  items: CartItem[]
  pendingItem: { product: Product; quantity: number } | null
  
  // Actions
  addItem: (product: Product, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  confirmPendingItem: () => void
  cancelPendingItem: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  pendingItem: null,

  addItem: (product, quantity) => set((state) => {
    // Enforce single store
    if (state.items.length > 0 && state.items[0].product.store !== product.store) {
      return { pendingItem: { product, quantity } }
    }

    const existingIndex = state.items.findIndex((i) => i.product.id === product.id)
    if (existingIndex >= 0) {
      const newItems = [...state.items]
      newItems[existingIndex].quantity = Math.min(
        product.quantityLeft,
        newItems[existingIndex].quantity + quantity
      )
      return { items: newItems }
    }

    return { items: [...state.items, { product, quantity }] }
  }),

  removeItem: (productId) => set((state) => ({
    items: state.items.filter((i) => i.product.id !== productId)
  })),

  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity: Math.min(Math.max(1, quantity), item.product.quantityLeft) }
      }
      return item
    })
  })),

  clearCart: () => set({ items: [], pendingItem: null }),

  confirmPendingItem: () => set((state) => {
    if (state.pendingItem) {
      return {
        items: [{ product: state.pendingItem.product, quantity: state.pendingItem.quantity }],
        pendingItem: null
      }
    }
    return state
  }),

  cancelPendingItem: () => set({ pendingItem: null })
}))

// Derived state selectors
export const selectStoreName = (state: CartState) => state.items.length > 0 ? state.items[0].product.store : null
export const selectTotalItems = (state: CartState) => state.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectSubtotal = (state: CartState) => state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
export const selectTotalSavings = (state: CartState) => state.items.reduce((sum, item) => sum + (item.product.originalPrice - item.product.price) * item.quantity, 0)

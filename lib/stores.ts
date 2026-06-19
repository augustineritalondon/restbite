// Shared store data
export type Store = {
  id: string
  slug: string
  name: string
  category: 'supermarket' | 'grocery' | 'bakery' | 'butcher'
  rating: number
  reviewCount: number
  distanceKm: number
  address: string
  openUntil: string
  image: string
  hasDelivery: boolean
  hasPickup: boolean
  activeDeals: number
  badge?: string
}

export const STORES: Store[] = [
  {
    id: 's1',
    slug: 'shoprite-ph-mall',
    name: 'ShopRite PH Mall',
    category: 'supermarket',
    rating: 4.6,
    reviewCount: 312,
    distanceKm: 1.2,
    address: 'Shop 142, Port Harcourt Mall, Woji Road, PH',
    openUntil: '10:00 PM',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    hasDelivery: false,
    hasPickup: true,
    activeDeals: 14,
    badge: 'Most popular',
  },
  {
    id: 's2',
    slug: 'market-square-gra',
    name: 'Market Square GRA',
    category: 'supermarket',
    rating: 4.3,
    reviewCount: 189,
    distanceKm: 2.1,
    address: 'GRA Phase 2, Peter Odili Road, Port Harcourt',
    openUntil: '9:00 PM',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
    hasDelivery: true,
    hasPickup: true,
    activeDeals: 9,
  },
  {
    id: 's3',
    slug: 'spar-port-harcourt',
    name: 'Spar Port Harcourt',
    category: 'supermarket',
    rating: 4.4,
    reviewCount: 241,
    distanceKm: 0.9,
    address: 'Garden City Mall, Stadium Road, PH',
    openUntil: '9:30 PM',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=800&q=80',
    hasDelivery: true,
    hasPickup: true,
    activeDeals: 11,
    badge: 'Closest to you',
  },
]

export function storeSlug(storeName: string) {
  return storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export type DiningSession = {
  id: string
  restaurantName: string
  cuisine: string
  location: string
  distanceKm: number
  slotsAvailable: number
  closingTime: string
  originalPrice: number
  discountPrice: number
  discountPct: number
  image: string
  note?: string
}

export const DINING_CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Nigerian', value: 'nigerian' },
  { label: 'Continental', value: 'continental' },
  { label: 'Fast Food', value: 'fast food' },
  { label: 'Asian', value: 'asian' },
  { label: 'Cafe', value: 'cafe' },
]

export const DINING_SESSIONS: DiningSession[] = [
  {
    id: 'd1',
    restaurantName: 'Native Tray',
    cuisine: 'nigerian',
    location: 'GRA Phase 2',
    distanceKm: 1.5,
    slotsAvailable: 8,
    closingTime: '10:30 PM',
    originalPrice: 15000,
    discountPrice: 7500,
    discountPct: 50,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd2',
    restaurantName: 'Kilimanjaro',
    cuisine: 'fast food',
    location: 'Peter Odili Road',
    distanceKm: 3.2,
    slotsAvailable: 5,
    closingTime: '9:45 PM',
    originalPrice: 8000,
    discountPrice: 4800,
    discountPct: 40,
    image: 'https://images.unsplash.com/photo-1626804475297-4160aeea1a52?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd3',
    restaurantName: 'Spice Route',
    cuisine: 'asian',
    location: 'Port Harcourt Mall',
    distanceKm: 2.1,
    slotsAvailable: 4,
    closingTime: '11:00 PM',
    originalPrice: 22000,
    discountPrice: 8800,
    discountPct: 60,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd4',
    restaurantName: 'Woodhouse Cafe',
    cuisine: 'cafe',
    location: 'Woji',
    distanceKm: 4.5,
    slotsAvailable: 2,
    closingTime: '8:30 PM',
    originalPrice: 12000,
    discountPrice: 4200,
    discountPct: 65,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd5',
    restaurantName: 'Genesis Restaurant',
    cuisine: 'continental',
    location: 'Tombia Street',
    distanceKm: 1.8,
    slotsAvailable: 10,
    closingTime: '10:00 PM',
    originalPrice: 18000,
    discountPrice: 9000,
    discountPct: 50,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'd6',
    restaurantName: 'Bole King',
    cuisine: 'nigerian',
    location: 'D-Line',
    distanceKm: 2.7,
    slotsAvailable: 6,
    closingTime: '9:00 PM',
    originalPrice: 5000,
    discountPrice: 2500,
    discountPct: 50,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  },
]

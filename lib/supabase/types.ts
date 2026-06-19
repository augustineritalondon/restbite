export type UserRole = 'buyer' | 'seller' | 'restaurant' | 'admin'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Restaurant {
  id: string
  owner_id: string
  name: string
  description: string | null
  cuisine_type: string | null
  address: string
  city: string
  postcode: string
  phone: string | null
  email: string | null
  logo_url: string | null
  cover_image_url: string | null
  is_active: boolean
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface TimeSlot {
  id: string
  restaurant_id: string
  date: string
  start_time: string
  end_time: string
  capacity: number
  booked_count: number
  price_per_person: number | null
  is_available: boolean
  created_at: string
}

export interface Booking {
  id: string
  buyer_id: string
  restaurant_id: string
  slot_id: string
  party_size: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  special_requests: string | null
  total_amount: number | null
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  price: number
  category: string
  image_url: string | null
  is_available: boolean
  created_at: string
}

// Database shape (from Supabase auto-generated types — update once connected)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'created_at'>>
      }
      restaurants: {
        Row: Restaurant
        Insert: Omit<Restaurant, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Restaurant, 'id' | 'created_at'>>
      }
      time_slots: {
        Row: TimeSlot
        Insert: Omit<TimeSlot, 'id' | 'created_at'>
        Update: Partial<Omit<TimeSlot, 'id' | 'created_at'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id' | 'created_at'>>
      }
      menu_items: {
        Row: MenuItem
        Insert: Omit<MenuItem, 'id' | 'created_at'>
        Update: Partial<Omit<MenuItem, 'id' | 'created_at'>>
      }
    }
  }
}

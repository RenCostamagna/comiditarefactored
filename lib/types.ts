// Core entity types
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  level: UserLevel
  points: number
  created_at: string
  updated_at: string
}

export interface Place {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  category: string
  price_range: string
  rating: number
  google_place_id?: string
  phone?: string
  website?: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  user_id: string
  place_id: string
  rating: number
  comment: string
  photos: string[]
  created_at: string
  updated_at: string
  user?: User
  place?: Place
}

export interface DetailedReview {
  id: string
  user_id: string
  place_id: string
  rating: number
  comment: string
  photos: string[]
  dish_name: string
  food_taste: number
  presentation: number
  portion_size: number
  drinks_variety: number
  veggie_options: number
  gluten_free_options: number
  vegan_options: number
  music_acoustics: number
  ambiance: number
  furniture_comfort: number
  cleanliness: number
  service: number
  created_at: string
  updated_at: string
  user?: User
  place?: Place
}

export interface GooglePlace {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  price_level?: number
  types: string[]
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  opening_hours?: {
    open_now: boolean
    periods: Array<{
      open: { day: number; time: string }
      close: { day: number; time: string }
    }>
  }
  formatted_phone_number?: string
  website?: string
}

// User level system
export interface UserLevel {
  level: number
  name: string
  min_points: number
  max_points: number
  color: string
  icon: string
}

// Constants
export const PRICE_RANGES = {
  under_10000: "Hasta 10.000",
  "10000_15000": "10.000 - 15.000",
  "15000_20000": "15.000 - 20.000",
  "20000_30000": "20.000 - 30.000",
  "30000_50000": "30.000 - 50.000",
  "50000_80000": "50.000 - 80.000",
  over_80000: "Más de 80.000",
} as const

export const RESTAURANT_CATEGORIES = {
  'PARRILLAS': 'Parrillas',
  'CAFE_Y_DELI': 'Café y Deli',
  'BODEGONES': 'Bodegones',
  'RESTAURANTES': 'Restaurantes',
  'HAMBURGUESERIAS': 'Hamburgueserías',
  'PIZZERIAS': 'Pizzerías',
  'PASTAS': 'Pastas',
  'CARRITOS': 'Carritos',
  'BARES': 'Bares'
} as const
// Re-export all types from the main types file
export * from '../types'

// Additional utility types for better type safety
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type NonNullable<T> = T extends null | undefined ? never : T

// API response types
export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
  field?: string
}

// Form and validation types
export interface FormState<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  isDirty: boolean
  isValid: boolean
  isSubmitting: boolean
}

export interface ValidationRule<T> {
  validate: (value: T) => boolean
  message: string
}

export interface FormField<T> {
  value: T
  error?: string
  touched: boolean
  rules: ValidationRule<T>[]
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  id?: string
  'data-testid'?: string
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

export interface WithLoading<T> extends LoadingState {
  data: T | null
}

// Enhanced user types
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'es' | 'en'
  notifications: {
    email: boolean
    push: boolean
    reviews: boolean
    recommendations: boolean
  }
  privacy: {
    profileVisible: boolean
    reviewsVisible: boolean
    locationSharing: boolean
  }
}

export interface UserProfile extends User {
  preferences: UserPreferences
  statistics: {
    totalReviews: number
    averageRating: number
    favoriteCategories: string[]
    visitedPlaces: number
  }
}

// Enhanced place types
export interface PlaceHours {
  monday: { open: string; close: string } | null
  tuesday: { open: string; close: string } | null
  wednesday: { open: string; close: string } | null
  thursday: { open: string; close: string } | null
  friday: { open: string; close: string } | null
  saturday: { open: string; close: string } | null
  sunday: { open: string; close: string } | null
}

export interface PlacePhoto {
  id: string
  url: string
  width: number
  height: number
  caption?: string
  uploadedBy: string
  uploadedAt: string
}

export interface PlaceStatistics {
  totalReviews: number
  averageRating: number
  categoryBreakdown: Record<string, number>
  ratingDistribution: Record<string, number>
  popularTimes?: Array<{
    day: string
    hours: Array<{ hour: number; popularity: number }>
  }>
}

export interface EnhancedPlace extends Place {
  photos: PlacePhoto[]
  hours: PlaceHours
  statistics: PlaceStatistics
  tags: string[]
  verified: boolean
  lastUpdated: string
}

// Enhanced review types
export interface ReviewPhoto {
  id: string
  url: string
  width: number
  height: number
  caption?: string
}

export interface ReviewLike {
  id: string
  userId: string
  reviewId: string
  createdAt: string
}

export interface ReviewReply {
  id: string
  userId: string
  reviewId: string
  content: string
  createdAt: string
  user?: User
}

export interface EnhancedReview extends Review {
  photos: ReviewPhoto[]
  likes: ReviewLike[]
  replies: ReviewReply[]
  verified: boolean
  helpful: number
  flagged: boolean
}

export interface EnhancedDetailedReview extends DetailedReview {
  photos: ReviewPhoto[]
  likes: ReviewLike[]
  replies: ReviewReply[]
  verified: boolean
  helpful: number
  flagged: boolean
}

// Search and filtering types
export interface SearchFilters {
  category?: string
  priceRange?: string
  rating?: number
  distance?: number
  openNow?: boolean
  tags?: string[]
  sortBy?: 'relevance' | 'rating' | 'distance' | 'newest'
}

export interface SearchResult {
  places: EnhancedPlace[]
  totalResults: number
  searchTime: number
  query: string
  filters: SearchFilters
}

// Map and location types
export interface Location {
  lat: number
  lng: number
}

export interface MapBounds {
  northeast: Location
  southwest: Location
}

export interface MapOptions {
  center: Location
  zoom: number
  bounds?: MapBounds
}

// Event types
export interface UserEvent {
  id: string
  userId: string
  type: 'review_created' | 'place_visited' | 'user_followed' | 'place_favorited'
  data: Record<string, any>
  createdAt: string
}

// Notification types
export interface Notification {
  id: string
  userId: string
  type: 'review_like' | 'review_reply' | 'place_update' | 'system'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}

// Analytics types
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp: number
}

// Configuration types
export interface AppConfig {
  features: {
    reviews: boolean
    photos: boolean
    maps: boolean
    notifications: boolean
    analytics: boolean
  }
  limits: {
    maxPhotosPerReview: number
    maxReviewLength: number
    maxFileSize: number
    dailyReviewLimit: number
  }
  integrations: {
    googleMaps: boolean
    supabase: boolean
    stripe: boolean
  }
}

// Hook return types
export interface UseApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  mutate: (data: T) => void
}

export interface UseFormReturn<T> {
  data: T
  errors: Partial<Record<keyof T, string>>
  handleChange: (field: keyof T, value: any) => void
  handleSubmit: (onSubmit: (data: T) => void) => void
  reset: () => void
  isValid: boolean
  isDirty: boolean
}

// State management types
export interface AppState {
  user: UserProfile | null
  theme: 'light' | 'dark' | 'system'
  notifications: Notification[]
  searchHistory: string[]
  favoriteePlaces: string[]
  recentPlaces: string[]
}

export interface AppAction {
  type: string
  payload?: any
}

// Utility types for strict typing
export type PlaceCategory = keyof typeof RESTAURANT_CATEGORIES
export type PriceRange = keyof typeof PRICE_RANGES
export type RatingValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

// Form validation schemas
export interface ReviewFormData {
  rating: RatingValue
  comment: string
  photos: File[]
  category: PlaceCategory
  priceRange: PriceRange
  wouldRecommend: boolean
}

export interface DetailedReviewFormData extends ReviewFormData {
  dishName: string
  foodTaste: RatingValue
  presentation: RatingValue
  portionSize: RatingValue
  drinksVariety: RatingValue
  veggieOptions: RatingValue
  glutenFreeOptions: RatingValue
  veganOptions: RatingValue
  musicAcoustics: RatingValue
  ambiance: RatingValue
  furnitureComfort: RatingValue
  cleanliness: RatingValue
  service: RatingValue
}

// Component-specific types
export interface PlaceCardProps extends BaseComponentProps {
  place: EnhancedPlace
  variant?: 'default' | 'compact' | 'detailed'
  showDistance?: boolean
  showRating?: boolean
  showCategory?: boolean
  onClick?: (place: EnhancedPlace) => void
}

export interface ReviewCardProps extends BaseComponentProps {
  review: EnhancedReview
  variant?: 'default' | 'compact' | 'detailed'
  showPlace?: boolean
  showUser?: boolean
  showActions?: boolean
  onLike?: (reviewId: string) => void
  onReply?: (reviewId: string) => void
}

export interface SearchBarProps extends BaseComponentProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  suggestions?: string[]
  loading?: boolean
}

// Database types (for Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      places: {
        Row: Place
        Insert: Omit<Place, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Place, 'id' | 'created_at' | 'updated_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at' | 'updated_at'>>
      }
      detailed_reviews: {
        Row: DetailedReview
        Insert: Omit<DetailedReview, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DetailedReview, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

// Export the main types for backward compatibility
export {
  User,
  Place,
  Review,
  DetailedReview,
  GooglePlace,
  UserLevel,
  PRICE_RANGES,
  RESTAURANT_CATEGORIES
} from '../types'
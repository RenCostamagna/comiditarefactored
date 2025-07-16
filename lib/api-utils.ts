import { NextRequest, NextResponse } from 'next/server'
import { AppError, handleApiError, ValidationError } from './errors'

// Cache configuration
const CACHE_DURATION = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 24 * 60 * 60, // 24 hours
}

// In-memory cache for API responses
const responseCache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export function getCachedResponse(key: string): any | null {
  const cached = responseCache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl * 1000) {
    responseCache.delete(key)
    return null
  }
  
  return cached.data
}

export function setCachedResponse(key: string, data: any, ttl: number = CACHE_DURATION.MEDIUM): void {
  responseCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

// API response wrapper with consistent error handling
export async function apiHandler<T>(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<T>,
  options: {
    method?: string[]
    cache?: boolean
    cacheKey?: string
    cacheTtl?: number
    validateSchema?: (data: any) => boolean
  } = {}
): Promise<NextResponse> {
  const {
    method = ['GET'],
    cache = false,
    cacheKey,
    cacheTtl = CACHE_DURATION.MEDIUM,
    validateSchema
  } = options

  try {
    // Method validation
    if (!method.includes(request.method || 'GET')) {
      throw new AppError(
        `Method ${request.method} not allowed`,
        'METHOD_NOT_ALLOWED',
        405
      )
    }

    // Check cache first
    if (cache && cacheKey) {
      const cachedData = getCachedResponse(cacheKey)
      if (cachedData) {
        return NextResponse.json(cachedData, {
          headers: {
            'Cache-Control': `public, max-age=${cacheTtl}`,
            'X-Cache': 'HIT'
          }
        })
      }
    }

    // Execute handler
    const result = await handler(request)

    // Validate response if schema provided
    if (validateSchema && !validateSchema(result)) {
      throw new ValidationError('Invalid response data')
    }

    // Cache successful response
    if (cache && cacheKey) {
      setCachedResponse(cacheKey, result, cacheTtl)
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': cache ? `public, max-age=${cacheTtl}` : 'no-cache',
        'X-Cache': cache ? 'MISS' : 'DISABLED'
      }
    })

  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}

// Rate limiting utility
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count }
}

// Request validation utilities
export function validateRequiredParams(
  searchParams: URLSearchParams,
  required: string[]
): { valid: boolean; missing: string[] } {
  const missing = required.filter(param => !searchParams.get(param))
  return { valid: missing.length === 0, missing }
}

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\s\-_áéíóúñü]/gi, '')
    .substring(0, 100)
}

// Google Places API utilities
export async function fetchGooglePlaces(
  endpoint: string,
  params: Record<string, string>,
  options: { cache?: boolean; cacheKey?: string } = {}
): Promise<any> {
  const url = new URL(`https://maps.googleapis.com/maps/api/place/${endpoint}/json`)
  
  // Add API key
  url.searchParams.set('key', process.env.GOOGLE_MAPS_API_KEY || '')
  
  // Add other parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  // Check cache first
  if (options.cache && options.cacheKey) {
    const cachedData = getCachedResponse(options.cacheKey)
    if (cachedData) {
      return cachedData
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'Comidita App/1.0'
    }
  })

  if (!response.ok) {
    throw new AppError(
      `Google Places API error: ${response.status}`,
      'GOOGLE_API_ERROR',
      response.status
    )
  }

  const data = await response.json()

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new AppError(
      `Google Places API error: ${data.status}`,
      'GOOGLE_API_ERROR',
      400
    )
  }

  // Cache successful response
  if (options.cache && options.cacheKey) {
    setCachedResponse(options.cacheKey, data, CACHE_DURATION.MEDIUM)
  }

  return data
}

// Response formatting utilities
export function formatPlaceResult(place: any) {
  return {
    place_id: place.place_id,
    name: place.name,
    formatted_address: place.formatted_address,
    geometry: place.geometry,
    rating: place.rating,
    user_ratings_total: place.user_ratings_total,
    formatted_phone_number: place.formatted_phone_number,
    website: place.website,
    photos: place.photos?.map((photo: any) => ({
      photo_reference: photo.photo_reference,
      width: photo.width,
      height: photo.height
    })) || []
  }
}

export function filterRosarioPlaces(places: any[]): any[] {
  return places.filter(place => {
    const address = place.formatted_address?.toLowerCase() || ''
    return address.includes('rosario') || address.includes('santa fe')
  })
}

// Middleware for common API operations
export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    // Add authentication logic here
    // For now, just pass through
    return handler(req)
  }
}

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  maxRequests: number = 100,
  windowMs: number = 60000
) {
  return async (req: NextRequest) => {
    const ip = req.ip || 'unknown'
    const { allowed, remaining } = rateLimit(ip, maxRequests, windowMs)
    
    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', code: 'RATE_LIMIT_EXCEEDED' },
        { status: 429 }
      )
    }

    const response = await handler(req)
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    return response
  }
}

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of responseCache.entries()) {
    if (now - entry.timestamp > entry.ttl * 1000) {
      responseCache.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes
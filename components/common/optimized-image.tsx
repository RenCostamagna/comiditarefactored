'use client'

import { useState, useRef, useEffect, forwardRef } from 'react'
import { useIntersectionObserver } from '@/hooks/use-performance'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
  blurDataURL?: string
  priority?: boolean
  quality?: number
  sizes?: string
  fill?: boolean
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
  fallback?: React.ReactNode
}

export const OptimizedImage = forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    className,
    placeholder,
    blurDataURL,
    priority = false,
    quality = 80,
    sizes,
    fill = false,
    loading = 'lazy',
    onLoad,
    onError,
    fallback
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [imageSrc, setImageSrc] = useState(priority ? src : '')
    const imageRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    
    const isIntersecting = useIntersectionObserver(containerRef, {
      threshold: 0.1,
      rootMargin: '50px'
    })

    // Load image when intersecting or if priority is true
    useEffect(() => {
      if ((isIntersecting || priority) && !imageSrc && !hasError) {
        setImageSrc(src)
      }
    }, [isIntersecting, priority, src, imageSrc, hasError])

    // Handle image load
    const handleLoad = () => {
      setIsLoaded(true)
      onLoad?.()
    }

    // Handle image error
    const handleError = () => {
      setHasError(true)
      onError?.()
    }

    // Generate srcSet for responsive images
    const generateSrcSet = (baseSrc: string, baseWidth?: number) => {
      if (!baseWidth) return undefined
      
      const sizes = [0.5, 1, 1.5, 2]
      return sizes
        .map(size => {
          const scaledWidth = Math.round(baseWidth * size)
          return `${baseSrc}?w=${scaledWidth}&q=${quality} ${size}x`
        })
        .join(', ')
    }

    // Show error fallback
    if (hasError) {
      if (fallback) {
        return <>{fallback}</>
      }
      
      return (
        <div 
          className={cn(
            'flex items-center justify-center bg-muted text-muted-foreground',
            fill ? 'absolute inset-0' : '',
            className
          )}
          style={fill ? {} : { width, height }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )
    }

    // Show loading state
    if (!imageSrc || !isLoaded) {
      const LoadingComponent = (
        <div
          ref={containerRef}
          className={cn(
            'relative overflow-hidden bg-muted',
            fill ? 'absolute inset-0' : '',
            className
          )}
          style={fill ? {} : { width, height }}
        >
          {blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
              aria-hidden="true"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
          
          {/* Loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )

      // If image source is not set yet, show loading component
      if (!imageSrc) {
        return LoadingComponent
      }

      // If image source is set but not loaded, show loading with hidden img
      return (
        <>
          {LoadingComponent}
          <img
            ref={imageRef}
            src={imageSrc}
            alt={alt}
            className="absolute inset-0 opacity-0"
            onLoad={handleLoad}
            onError={handleError}
            loading={loading}
            srcSet={generateSrcSet(imageSrc, width)}
            sizes={sizes}
          />
        </>
      )
    }

    // Show loaded image
    return (
      <img
        ref={ref || imageRef}
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          fill ? 'absolute inset-0 w-full h-full object-cover' : '',
          className
        )}
        style={fill ? {} : { width, height }}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        srcSet={generateSrcSet(imageSrc, width)}
        sizes={sizes}
      />
    )
  }
)

OptimizedImage.displayName = 'OptimizedImage'

// Component for avatar images with fallback
interface AvatarImageProps {
  src?: string
  alt: string
  size?: number
  className?: string
  fallback?: React.ReactNode
}

export function AvatarImage({ 
  src, 
  alt, 
  size = 40, 
  className,
  fallback 
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground rounded-full',
          className
        )}
        style={{ width: size, height: size }}
      >
        {fallback || (
          <span className="text-sm font-medium">
            {alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-full object-cover', className)}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  )
}

// Component for place/food images with aspect ratio
interface PlaceImageProps {
  src: string
  alt: string
  aspectRatio?: 'square' | 'video' | 'photo'
  className?: string
  priority?: boolean
  sizes?: string
}

export function PlaceImage({ 
  src, 
  alt, 
  aspectRatio = 'photo',
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: PlaceImageProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    photo: 'aspect-[4/3]'
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', aspectRatioClasses[aspectRatio])}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className={cn('object-cover', className)}
        priority={priority}
        sizes={sizes}
        fallback={
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        }
      />
    </div>
  )
}

// Component for image gallery with lazy loading
interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    width?: number
    height?: number
  }>
  className?: string
  onImageClick?: (index: number) => void
}

export function ImageGallery({ 
  images, 
  className,
  onImageClick 
}: ImageGalleryProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-square cursor-pointer group"
          onClick={() => onImageClick?.(index)}
        >
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover rounded-lg transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        </div>
      ))}
    </div>
  )
}

// Hook for preloading images
export function useImagePreloader(imageSrcs: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const preloadImages = async () => {
    setIsLoading(true)
    const promises = imageSrcs.map(src => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(src)
        img.onerror = reject
        img.src = src
      })
    })

    try {
      const results = await Promise.allSettled(promises)
      const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<string>).value)
      
      setLoadedImages(new Set(successful))
    } catch (error) {
      console.error('Error preloading images:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (imageSrcs.length > 0) {
      preloadImages()
    }
  }, [imageSrcs])

  return { loadedImages, isLoading, preloadImages }
}
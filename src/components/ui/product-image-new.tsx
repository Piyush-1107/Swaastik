'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  fallbackIcon?: React.ReactNode
  sizes?: string
}

export function ProductImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  fallbackIcon,
  sizes,
  ...props
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // If no src or error occurred, show fallback
  if (!src || imageError) {
    return (
      <div className={cn(
        "bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center",
        className
      )}>
        {fallbackIcon || (
          <div className="text-center">
            <div className="text-4xl mb-2">💎</div>
            <p className="text-sm text-muted-foreground">
              {alt || 'Product Image'}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center animate-pulse z-10">
          <div className="text-center">
            <div className="text-4xl mb-2">💎</div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : (width || 400)}
        height={fill ? undefined : (height || 400)}
        fill={fill}
        sizes={sizes || "400px"}
        className={cn(
          "transition-all duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill ? "object-cover" : "",
          className
        )}
        onLoad={() => {
          setIsLoading(false)
        }}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        {...props}
      />
    </div>
  )
}

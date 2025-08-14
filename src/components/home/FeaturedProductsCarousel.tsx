'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/ui/product-image'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  images: string[]
  specifications: {
    metal: string
    purity: string
    weight: string
    stones: string[]
    hallmarked: boolean
  }
  stock: number
  featured: boolean
  reviews: any[]
  createdAt?: Date
  updatedAt?: Date
}

export function FeaturedProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageDimensions, setImageDimensions] = useState<{width: number, height: number} | null>(null)

  // Function to handle image load and get dimensions
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    })
  }

  // Reset dimensions when product changes
  useEffect(() => {
    setImageDimensions(null)
  }, [currentIndex])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // First try to get featured products
        let response = await fetch('/api/products?featured=true&limit=6')
        let data = await response.json()
        
        if (data.success && data.data.products && data.data.products.length > 0) {
          setProducts(data.data.products)
        } else {
          // If no featured products, get the first 4 products
          response = await fetch('/api/products?limit=4')
          data = await response.json()
          
          if (data.success && data.data.products) {
            setProducts(data.data.products)
          } else {
            console.error('Failed to fetch products:', data.error)
            setProducts([])
          }
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    )
  }

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    if (products.length > 1) {
      const interval = setInterval(nextSlide, 3000)
      return () => clearInterval(interval)
    }
  }, [products.length])

  if (loading) {
    return (
      <div className="relative w-full h-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/30">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary font-medium">Loading Featured Products...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="relative w-full h-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/30">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground text-2xl">💎</span>
          </div>
          <p className="text-secondary font-medium">Featured Products</p>
          <p className="text-muted-foreground text-sm">Coming Soon</p>
        </div>
      </div>
    )
  }

  const currentProduct = products[currentIndex]

  // Calculate aspect ratio for dynamic sizing
  const aspectRatio = imageDimensions 
    ? imageDimensions.width / imageDimensions.height 
    : 1 // Default to square

  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden bg-white"
      style={{ 
        aspectRatio: aspectRatio,
        maxHeight: '400px', // Prevent it from getting too tall
        height: 'auto'
      }}
    >
      {/* Clickable Product Image with Link */}
      <Link href={`/products/${currentProduct.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {currentProduct.name}</span>
      </Link>
      
      {/* Product Image */}
      <img
        src={currentProduct.images[0]}
        alt={currentProduct.name}
        className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
        onLoad={handleImageLoad}
        loading="lazy"
      />
      
      {/* Always visible product info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
        <div className="text-white">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">
            {currentProduct.name}
          </h3>
          <p className="text-yellow-400 font-bold text-xl">
            ₹{currentProduct.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Featured Badge - only show if product is actually featured */}
      {currentProduct.featured && (
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium shadow-lg">
          Featured
        </div>
      )}
      
      {/* Navigation arrows */}
      {products.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-20"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              prevSlide()
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-20"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              nextSlide()
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Indicators */}
      {products.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 shadow-lg ${
                index === currentIndex ? 'bg-white scale-110' : 'bg-white/70 hover:bg-white/90'
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentIndex(index)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

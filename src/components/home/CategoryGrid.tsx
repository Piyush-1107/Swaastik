'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  images: string[]
  featured: boolean
}

interface CategoryWithImage {
  name: string
  slug: string
  description: string
  image: string
  itemCount: string
  productImage?: string
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<CategoryWithImage[]>([
    {
      name: 'Rings',
      slug: 'rings',
      description: 'Elegant rings for every occasion',
      image: '💍',
      itemCount: '150+ designs'
    },
    {
      name: 'Earrings',
      slug: 'earrings', 
      description: 'Beautiful earrings to complement your style',
      image: '💎',
      itemCount: '200+ designs'
    },
    {
      name: 'Necklaces',
      slug: 'necklaces',
      description: 'Stunning necklaces for special moments',
      image: '📿',
      itemCount: '120+ designs'
    },
    {
      name: 'Bangles',
      slug: 'bangles',
      description: 'Traditional and modern bangles',
      image: '⭕',
      itemCount: '180+ designs'
    }
  ])

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const updatedCategories = await Promise.all(
          categories.map(async (category) => {
            // First try to get featured products from this category
            let response = await fetch(`/api/products?category=${category.slug}&featured=true&limit=1`)
            let data = await response.json()
            
            // If no featured products, get any product from this category
            if (!data.success || !data.data.products || data.data.products.length === 0) {
              response = await fetch(`/api/products?category=${category.slug}&limit=1`)
              data = await response.json()
            }
            
            // If we found a product with images, use its first image
            if (data.success && data.data.products && data.data.products.length > 0) {
              const product = data.data.products[0]
              if (product.images && product.images.length > 0) {
                return {
                  ...category,
                  productImage: product.images[0]
                }
              }
            }
            
            return category
          })
        )
        
        setCategories(updatedCategories)
      } catch (error) {
        console.error('Error fetching category images:', error)
        // Keep original categories with emojis as fallback
      }
    }

    fetchCategoryImages()
  }, [])

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-3">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of authentic Indian jewelry, each piece crafted with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 hover:shadow-lg transition-all duration-300 group-hover:scale-105 h-48 sm:h-56 lg:h-64">
                {/* Category Image - Product image or gradient fallback */}
                {category.productImage ? (
                  <img
                    src={category.productImage}
                    alt={`${category.name} jewelry`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <div className="text-6xl">{category.image}</div>
                  </div>
                )}

                {/* Gradient overlay for text - stronger opacity for better readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20"></div>
                
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full transform translate-x-6 -translate-y-6"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-lg">
                    {category.name}
                  </h3>
                  
                  <p className="text-white text-sm mb-3 drop-shadow-md">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-yellow-300 font-medium drop-shadow-md">
                      {category.itemCount}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white border-white/50 hover:text-black hover:bg-white/95 backdrop-blur-sm"
                    >
                      Explore →
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 sm:mt-10">
          <Button asChild size="lg" className="px-6 sm:px-8">
            <Link href="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'
import { Product } from '@/types'

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const categoryNames: { [key: string]: string } = {
    rings: 'Rings',
    earrings: 'Earrings',
    necklaces: 'Necklaces',
    bangles: 'Bangles'
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('category', category)
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }
      
      if (priceRange.min) {
        params.append('minPrice', priceRange.min)
      }
      
      if (priceRange.max) {
        params.append('maxPrice', priceRange.max)
      }

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data.products)
      } else {
        console.error('Failed to fetch products:', data.error)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (category) {
      fetchProducts()
    }
  }, [category, searchQuery, priceRange])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setPriceRange({ min: '', max: '' })
  }

  const categoryName = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      {/* Compact Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-2">
          {categoryName} Collection
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Discover our {categoryName.toLowerCase()} collection, BIS hallmarked and expertly crafted.
        </p>
      </div>

      {/* Compact Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-3 mb-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder={`Search ${categoryName.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>

          {/* Price Range */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min ₹"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full h-9 text-sm"
            />
            <Input
              type="number"
              placeholder="Max ₹"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full h-9 text-sm"
            />
          </div>

          {/* Clear Filters */}
          <Button variant="outline" onClick={clearFilters} size="sm" className="h-9">
            <Filter className="h-3 w-3 mr-2" />
            Clear
          </Button>
        </div>

        {/* Product Count */}
        <div className="text-sm text-muted-foreground">
          {loading ? 'Loading...' : `${products.length} items found`}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-3 sm:p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            No {categoryName.toLowerCase()} found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or browse our other categories.
          </p>
          <Button onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}

      {/* Category Info */}
      <div className="mt-16 text-center">
        <div className="bg-muted/30 rounded-2xl p-8">
          <h3 className="font-display text-2xl font-semibold text-secondary mb-4">
            Why Choose Our {categoryName}?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary text-xl">💎</span>
              </div>
              <h4 className="font-semibold mb-2">Premium Quality</h4>
              <p className="text-sm text-muted-foreground">
                Handcrafted with finest materials and attention to detail
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary text-xl">🏆</span>
              </div>
              <h4 className="font-semibold mb-2">Certified Quality</h4>
              <p className="text-sm text-muted-foreground">
                All pieces are BIS hallmarked for guaranteed purity
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary text-xl">✨</span>
              </div>
              <h4 className="font-semibold mb-2">Timeless Design</h4>
              <p className="text-sm text-muted-foreground">
                Classic and contemporary designs for every occasion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, Grid, List } from 'lucide-react'
import { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'rings', label: 'Rings' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'bangles', label: 'Bangles' }
  ]

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }
      
      if (priceRange.min) {
        params.append('minPrice', priceRange.min)
      }
      
      if (priceRange.max) {
        params.append('maxPrice', priceRange.max)
      }

      // Add a higher limit to show more products
      params.append('limit', '100')

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
    fetchProducts()
  }, [selectedCategory, searchQuery, priceRange])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setPriceRange({ min: '', max: '' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-4">
          Our Jewelry Collection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our exquisite range of handcrafted jewelry, each piece 
          certified with BIS hallmarking and crafted with precision.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search jewelry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min ₹"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Max ₹"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full"
            />
          </div>

          {/* Clear Filters */}
          <Button variant="outline" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or browse our categories.
          </p>
          <Button onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      )}

      {/* Trust Section */}
      <div className="mt-16 text-center">
        <div className="bg-muted/30 rounded-2xl p-8">
          <h3 className="font-display text-2xl font-semibold text-secondary mb-4">
            Why Choose Swastik Gems?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary text-xl">🏆</span>
              </div>
              <h4 className="font-semibold mb-2">100% Authentic</h4>
              <p className="text-sm text-muted-foreground">
                All jewelry is BIS hallmarked and certified for purity
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary text-xl">🔒</span>
              </div>
              <h4 className="font-semibold mb-2">Secure Shopping</h4>
              <p className="text-sm text-muted-foreground">
                Safe payment options and secure checkout process
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary text-xl">🚚</span>
              </div>
              <h4 className="font-semibold mb-2">Fast Delivery</h4>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders above ₹5,000 across India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Shield, Truck, RotateCcw, Award, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductImage } from '@/components/ui/product-image'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        // Since we don't have individual product API, we'll fetch from products and find by slug
        const response = await fetch('/api/products')
        const data = await response.json()
        
        if (data.success) {
          const foundProduct = data.data.products.find((p: Product) => p.slug === slug)
          setProduct(foundProduct || null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product)
      }
    }
  }

  const handleWishlistToggle = () => {
    if (product) {
      if (isInWishlist(product._id!)) {
        removeFromWishlist(product._id!)
      } else {
        addToWishlist(product)
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-secondary mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const averageRating = product.reviews && product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0

  return (
    <div className="container mx-auto px-4 py-2 sm:py-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="mb-4 hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Responsive Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Product Images */}
        <div className="relative">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square lg:aspect-[4/5]">
            <ProductImage
              src={product.images && product.images.length > selectedImageIndex ? product.images[selectedImageIndex] : undefined}
              alt={product.name}
              width={600}
              height={600}
              className="object-cover w-full h-full"
            />
            
            {/* Image Navigation - Only show if multiple images */}
            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? product.images.length - 1 : prev - 1
                  )}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 z-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === product.images.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 z-10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        selectedImageIndex === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip for Desktop */}
          {product.images && product.images.length > 1 && (
            <div className="hidden lg:flex mt-4 space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <ProductImage
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 lg:space-y-6">
          <div className="space-y-3 lg:space-y-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary leading-tight">{product.name}</h1>
            
            {/* Price and Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>
              
              {/* Rating */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 lg:h-5 lg:w-5 ${
                          i < Math.floor(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm lg:text-base text-muted-foreground">
                    ({product.reviews.length})
                  </span>
                </div>
              )}
            </div>

            {/* Key specifications */}
            <div className="flex items-center gap-4 text-sm lg:text-base text-muted-foreground">
              <span>{product.specifications.metal}</span>
              <span>•</span>
              <span>{product.specifications.purity}</span>
              {product.specifications.hallmarked && (
                <>
                  <span>•</span>
                  <span className="flex items-center text-green-600">
                    <Award className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    BIS
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            {product.stock <= 3 && product.stock > 0 && (
              <div className="text-sm lg:text-base text-orange-600 font-medium">
                Only {product.stock} left in stock
              </div>
            )}
            
            {product.stock === 0 && (
              <div className="text-sm lg:text-base text-red-600 font-medium">
                Out of stock
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  -
                </Button>
                <span className="w-12 text-center text-sm lg:text-base">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="h-10 w-10 p-0"
                >
                  +
                </Button>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-10 lg:h-12"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>

            {/* Wishlist Button */}
            <Button
              variant="outline"
              onClick={handleWishlistToggle}
              className="w-full h-10 lg:h-12"
              size="lg"
            >
              <Heart className={`h-4 w-4 lg:h-5 lg:w-5 mr-2 ${isInWishlist(product._id!) ? 'fill-current text-red-500' : ''}`} />
              {isInWishlist(product._id!) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>

          {/* Trust Badges - Prominent on Desktop */}
          <div className="border-t pt-4 lg:pt-6">
            <h3 className="font-medium mb-3 lg:mb-4">Trust & Security</h3>
            <div className="grid grid-cols-2 gap-3 lg:gap-4 text-sm lg:text-base">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-green-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 lg:h-5 lg:w-5 text-purple-600" />
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-600" />
                <span>BIS Certified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Specifications - Full Width */}
      <div className="mt-8 lg:mt-12 space-y-6 lg:space-y-8">
        {/* Description */}
        <div className="border-t pt-6 lg:pt-8">
          <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Description</h3>
          <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specifications */}
        <div className="border-t pt-6 lg:pt-8">
          <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 text-sm lg:text-base">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted-foreground">Metal:</span>
              <span className="font-medium">{product.specifications.metal}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted-foreground">Purity:</span>
              <span className="font-medium">{product.specifications.purity}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-muted-foreground">Weight:</span>
              <span className="font-medium">{product.specifications.weight}</span>
            </div>
            {product.specifications.stones.length > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100 md:col-span-2">
                <span className="text-muted-foreground">Stones:</span>
                <span className="font-medium">{product.specifications.stones.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-secondary mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Date unknown'}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

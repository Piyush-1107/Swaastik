'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ProductImage } from '@/components/ui/product-image'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist(product._id!)) {
      removeFromWishlist(product._id!)
    } else {
      addToWishlist(product)
    }
  }

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden aspect-square">
          {/* Product Image */}
          <ProductImage
            src={product.images && product.images.length > 0 ? product.images[0] : undefined}
            alt={product.name}
            width={400}
            height={400}
            className="group-hover:scale-110 transition-transform duration-300 object-cover w-full h-full"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
            {product.specifications.hallmarked && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <Award className="w-3 h-3" />
                BIS
              </span>
            )}
          </div>

          {/* Quick actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className={`bg-white/90 hover:bg-white ${
                isInWishlist(product._id!) ? 'text-red-500' : 'text-muted-foreground'
              }`}
              onClick={handleWishlistToggle}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product._id!) ? 'fill-current' : ''}`} />
            </Button>
          </div>

          {/* Stock indicator */}
          {product.stock <= 3 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Only {product.stock} left
              </span>
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-3 sm:p-4">
        <Link href={`/products/${product.slug}`}>
          <div className="space-y-1.5 sm:space-y-2">
            {/* Category */}
            <p className="text-xs text-primary font-medium uppercase tracking-wider">
              {product.category}
            </p>

            {/* Product name */}
            <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base leading-tight">
              {product.name}
            </h3>

            {/* Specifications - Mobile optimized */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{product.specifications.metal}</span>
              <span>•</span>
              <span>{product.specifications.purity}</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{product.specifications.weight}</span>
            </div>

            {/* Rating - Compact for mobile */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-primary text-primary" />
                  <span className="text-xs sm:text-sm font-medium ml-1">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ({product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {/* Price and stones - Mobile optimized layout */}
            <div className="flex items-center justify-between gap-2">
              <p className="text-base sm:text-lg font-bold text-secondary">
                {formatPrice(product.price)}
              </p>
              {product.specifications.stones.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {product.specifications.stones.slice(0, 2).map((stone, index) => (
                    <span
                      key={index}
                      className="text-xs bg-muted px-1.5 py-0.5 rounded-full"
                    >
                      {stone}
                    </span>
                  ))}
                  {product.specifications.stones.length > 2 && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                      +{product.specifications.stones.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full text-sm"
          variant={product.stock === 0 ? "secondary" : "default"}
          size="sm"
        >
          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}

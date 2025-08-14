'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductImage } from '@/components/ui/product-image'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const subtotal = getTotalPrice()
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const shipping = subtotal >= 5000 ? 0 : 200
  const total = subtotal + tax + shipping

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsLoading(true)
    // Simulate checkout process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to checkout page
      window.location.href = '/checkout'
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground/50 mb-4" />
            <h1 className="font-display text-3xl font-bold text-secondary mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to discover our beautiful jewelry collection.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/products">
                Start Shopping
              </Link>
            </Button>
            
            <div className="text-center">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-3xl font-bold text-secondary">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border overflow-hidden">
            {items.map((item, index) => (
              <div key={item.product._id} className={`p-6 ${index !== items.length - 1 ? 'border-b' : ''}`}>
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <ProductImage
                      src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : undefined}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-lg"
                      fallbackIcon={
                        <div className="text-center">
                          <div className="text-2xl mb-1">💎</div>
                        </div>
                      }
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-secondary text-lg mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.product.specifications.metal} • {item.product.specifications.purity} • {item.product.specifications.weight}
                        </p>
                        {item.product.specifications.hallmarked && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            BIS Hallmarked
                          </span>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product._id!)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.product._id!, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product._id!, parseInt(e.target.value) || 1)}
                          className="w-16 text-center h-8"
                          min="1"
                        />
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(item.product._id!, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-semibold text-lg text-secondary">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            {formatPrice(item.product.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear Cart */}
          <div className="mt-4 flex justify-between items-center">
            <Button variant="ghost" onClick={clearCart} className="text-muted-foreground">
              Clear Cart
            </Button>
            
            <Link href="/products" className="text-primary hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-8">
            <h2 className="font-semibold text-xl text-secondary mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              
              {shipping > 0 && (
                <p className="text-sm text-muted-foreground">
                  Add {formatPrice(5000 - subtotal)} more for free shipping
                </p>
              )}
              
              <hr />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-secondary">{formatPrice(total)}</span>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full mb-4"
              size="lg"
            >
              {isLoading ? 'Processing...' : `Proceed to Checkout`}
            </Button>

            {/* Trust Indicators */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">Secure SSL checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">BIS hallmarked jewelry</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

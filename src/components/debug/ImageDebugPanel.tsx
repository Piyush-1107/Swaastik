'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'

interface ImageTestProps {
  imageUrl: string
  name: string
}

function ImageTest({ imageUrl, name }: ImageTestProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')

  const testImage = () => {
    setStatus('loading')
    setError('')
    
    const img = document.createElement('img')
    img.onload = () => setStatus('success')
    img.onerror = () => {
      setStatus('error')
      setError('Failed to load image')
    }
    img.src = imageUrl
  }

  useEffect(() => {
    testImage()
  }, [imageUrl])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Loading...</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">✅ Working</Badge>
      case 'error':
        return <Badge variant="destructive">❌ Failed</Badge>
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium">{name}</span>
        </div>
        {getStatusBadge()}
      </div>
      
      <div className="text-xs font-mono text-gray-600 break-all">
        {imageUrl}
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Direct img tag test */}
        <div>
          <p className="text-sm font-medium mb-2">Direct &lt;img&gt; tag:</p>
          <div className="w-full h-32 border rounded overflow-hidden bg-gray-50">
            <img 
              src={imageUrl} 
              alt="Direct test"
              className="w-full h-full object-cover"
              onLoad={() => console.log('✅ Direct img loaded:', imageUrl)}
              onError={(e) => console.log('❌ Direct img failed:', imageUrl, e)}
            />
          </div>
        </div>

        {/* Next.js Image component test */}
        <div>
          <p className="text-sm font-medium mb-2">Next.js Image:</p>
          <div className="w-full h-32 border rounded overflow-hidden bg-gray-50 relative">
            <Image
              src={imageUrl}
              alt="Next.js test"
              fill
              className="object-cover"
              onLoad={() => console.log('✅ Next.js Image loaded:', imageUrl)}
              onError={(e) => console.log('❌ Next.js Image failed:', imageUrl, e)}
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={testImage}
        size="sm" 
        variant="outline"
        className="w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Test Again
      </Button>
    </div>
  )
}

export function ImageDebugPanel() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.products) {
          setProducts(result.data.products.slice(0, 3)) // Test first 3 products
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const testUrls = [
    'https://scxfuzbtsvprczztxuca.supabase.co/storage/v1/object/public/product-images/silver-brace-wedding/1754806071622-rbenx1.jpeg',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500',
    'https://res.cloudinary.com/dcspbfkfs/image/upload/v1/test.jpg'
  ]

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse">Loading products...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Image Loading Debug Panel
        </CardTitle>
        <CardDescription>
          Test image loading from different sources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test sample URLs */}
        <div>
          <h3 className="font-semibold mb-3">Test URLs:</h3>
          <div className="space-y-4">
            <ImageTest 
              imageUrl={testUrls[0]} 
              name="Supabase Storage (Your uploaded image)"
            />
            <ImageTest 
              imageUrl={testUrls[1]} 
              name="Unsplash (External test)"
            />
          </div>
        </div>

        {/* Test actual product images */}
        {products.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Your Product Images:</h3>
            <div className="space-y-4">
              {products.map((product, index) => {
                if (product.images && product.images.length > 0) {
                  return (
                    <ImageTest
                      key={product._id || index}
                      imageUrl={product.images[0]}
                      name={`${product.name} (Product Image)`}
                    />
                  )
                }
                return null
              })}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Debug Information:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Check browser console for detailed error messages</li>
            <li>• Verify Supabase storage bucket is public</li>
            <li>• Ensure Next.js image domains are configured</li>
            <li>• Test direct URL access in new browser tab</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

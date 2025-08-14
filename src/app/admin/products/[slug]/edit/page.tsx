'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Product } from '@/types'

interface EditProductPageProps {
  params: { slug: string }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchingProduct, setFetchingProduct] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    images: [''],
    specifications: {
      metal: '',
      purity: '',
      weight: '',
      stones: [''],
      hallmarked: false
    },
    stock: '',
    featured: false
  })

  const categories = [
    { value: 'rings', label: 'Rings' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'bangles', label: 'Bangles' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'pendants', label: 'Pendants' }
  ]

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.slug}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const product = result.data
          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            category: product.category || '',
            images: product.images && product.images.length > 0 ? product.images : [''],
            specifications: {
              metal: product.specifications?.metal || '',
              purity: product.specifications?.purity || '',
              weight: product.specifications?.weight || '',
              stones: product.specifications?.stones && product.specifications.stones.length > 0 
                ? product.specifications.stones 
                : [''],
              hallmarked: product.specifications?.hallmarked || false
            },
            stock: product.stock?.toString() || '',
            featured: product.featured || false
          })
        } else {
          toast.error('Product not found')
          router.push('/admin/products')
        }
      } else {
        toast.error('Failed to fetch product')
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to fetch product')
      router.push('/admin/products')
    } finally {
      setFetchingProduct(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.startsWith('specifications.')) {
      const specField = field.replace('specifications.', '')
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Auto-generate slug from name if slug is empty or matches old name
    if (field === 'name') {
      const slug = value.toString().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }))
  }

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, images: newImages }))
    }
  }

  const handleStoneChange = (index: number, value: string) => {
    const newStones = [...formData.specifications.stones]
    newStones[index] = value
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        stones: newStones
      }
    }))
  }

  const addStoneField = () => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        stones: [...prev.specifications.stones, '']
      }
    }))
  }

  const removeStoneField = (index: number) => {
    if (formData.specifications.stones.length > 1) {
      const newStones = formData.specifications.stones.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          stones: newStones
        }
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.category) {
        toast.error('Please fill in all required fields')
        return
      }

      // Prepare data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        images: formData.images.filter(img => img.trim() !== ''),
        specifications: {
          ...formData.specifications,
          stones: formData.specifications.stones.filter(stone => stone.trim() !== '')
        }
      }

      // Make actual API call to update product
      const response = await fetch(`/api/products/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update product')
      }

      const result = await response.json()
      console.log('Product updated:', result.data)
      
      toast.success('Product updated successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingProduct) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading product...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-secondary">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential product details and pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Golden Rose Ring"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="golden-rose-ring"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the product features and benefits..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="8500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked: boolean) => handleInputChange('featured', checked as boolean)}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>
                  Technical details and certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="metal">Metal Type</Label>
                    <Input
                      id="metal"
                      value={formData.specifications.metal}
                      onChange={(e) => handleInputChange('specifications.metal', e.target.value)}
                      placeholder="Gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purity">Purity</Label>
                    <Input
                      id="purity"
                      value={formData.specifications.purity}
                      onChange={(e) => handleInputChange('specifications.purity', e.target.value)}
                      placeholder="22K"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={formData.specifications.weight}
                    onChange={(e) => handleInputChange('specifications.weight', e.target.value)}
                    placeholder="3.5g"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stones/Gems</Label>
                  {formData.specifications.stones.map((stone, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={stone}
                        onChange={(e) => handleStoneChange(index, e.target.value)}
                        placeholder="e.g., Ruby, Diamond"
                      />
                      {formData.specifications.stones.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeStoneField(index)}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStoneField}
                  >
                    Add Stone
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hallmarked"
                    checked={formData.specifications.hallmarked}
                    onCheckedChange={(checked: boolean) => handleInputChange('specifications.hallmarked', checked as boolean)}
                  />
                  <Label htmlFor="hallmarked">BIS Hallmarked</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Add product images (URLs for now - we'll add file upload later)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeImageField(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageField}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Image URL
              </Button>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button asChild variant="outline">
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}

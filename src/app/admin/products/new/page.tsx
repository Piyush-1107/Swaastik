'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Upload } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import ImageUpload from '@/components/ImageUpload'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    images: [] as string[],
    imagePaths: [] as string[], // Store storage paths for cleanup
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

    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toString().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleImagesUploaded = (urls: string[], paths: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls],
      imagePaths: [...prev.imagePaths, ...paths]
    }))
    toast.success(`${urls.length} image(s) uploaded successfully!`)
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
        images: formData.images, // Already filtered URLs from upload
        specifications: {
          ...formData.specifications,
          stones: formData.specifications.stones.filter(stone => stone.trim() !== '')
        }
      }

      // Make actual API call to create product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const error = await response.json()
        
        // Handle specific error cases with user-friendly messages
        if (error.code === '23505' && error.details?.includes('slug')) {
          throw new Error('A product with this name already exists. Please choose a different name.')
        }
        
        throw new Error(error.error || 'Failed to create product')
      }

      const result = await response.json()
      console.log('Product created:', result.data)
      
      toast.success('Product created successfully!')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      
      // Show user-friendly error messages
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-3xl font-bold text-secondary">Add New Product</h1>
            <p className="text-muted-foreground">Create a new jewelry product</p>
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
                Upload high-quality images of your product. Images will be automatically resized and optimized.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImagesUploaded={handleImagesUploaded}
                productSlug={formData.slug}
                maxImages={5}
                existingImages={formData.images}
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end">
            <Button asChild variant="outline">
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}

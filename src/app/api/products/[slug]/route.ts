import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // First try to find by slug, then by id
    let { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('slug', params.slug)
      .single()

    // If not found by slug, try by id (for admin operations)
    if (error && error.code === 'PGRST116') {
      const response = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', params.slug)
        .single()
      
      product = response.data
      error = response.error
    }

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch product' 
        },
        { status: 500 }
      )
    }

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found' 
        },
        { status: 404 }
      )
    }

    // Transform data
    const transformedProduct = {
      _id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images || [],
      specifications: product.specifications || {
        metal: '',
        purity: '',
        weight: '',
        stones: [],
        hallmarked: false
      },
      stock: product.stock,
      featured: product.featured,
      reviews: [],
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    }

    return NextResponse.json({
      success: true,
      data: transformedProduct
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch product' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.name) updateData.name = body.name
    if (body.slug) updateData.slug = body.slug
    else if (body.name) {
      updateData.slug = body.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
    }
    if (body.description) updateData.description = body.description
    if (body.price !== undefined) updateData.price = parseFloat(body.price)
    if (body.category) updateData.category = body.category
    if (body.images) updateData.images = body.images
    if (body.specifications) updateData.specifications = body.specifications
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock)
    if (body.featured !== undefined) updateData.featured = body.featured

    // Try to update by id first, then by slug
    let { data: product, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', params.slug)
      .select()
      .single()

    if (error && error.code === 'PGRST116') {
      const response = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('slug', params.slug)
        .select()
        .single()
      
      product = response.data
      error = response.error
    }

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update product' 
        },
        { status: 500 }
      )
    }

    // Transform response
    const transformedProduct = {
      _id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      category: product.category,
      images: product.images || [],
      specifications: product.specifications || {
        metal: '',
        purity: '',
        weight: '',
        stones: [],
        hallmarked: false
      },
      stock: product.stock,
      featured: product.featured,
      reviews: [],
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    }

    return NextResponse.json({
      success: true,
      data: transformedProduct
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update product' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // Try to delete by id first, then by slug
    let { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', params.slug)

    if (error && error.code === 'PGRST116') {
      const response = await supabaseAdmin
        .from('products')
        .delete()
        .eq('slug', params.slug)
      
      error = response.error
    }

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete product' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete product' 
      },
      { status: 500 }
    )
  }
}

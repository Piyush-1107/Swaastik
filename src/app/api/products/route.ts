import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Start with base query
    let query = supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' })
    
    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    
    if (featured === 'true') {
      query = query.eq('featured', true)
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`)
    }
    
    if (minPrice) {
      query = query.gte('price', parseInt(minPrice))
    }
    
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice))
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    const { data: products, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch products' 
        },
        { status: 500 }
      )
    }

    // Transform data to match our existing Product type
    const transformedProducts = products?.map((product: any) => ({
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
      reviews: [], // We'll add reviews later
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Generate slug from name if not provided
    const slug = body.slug || body.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: name, price, and category are required.' 
        },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existingProduct } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingProduct) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'A product with this URL slug already exists. Please use a different product name or modify the slug.' 
        },
        { status: 400 }
      )
    }

    const productData = {
      name: body.name,
      slug: slug,
      description: body.description,
      price: parseFloat(body.price),
      category: body.category,
      images: body.images || [],
      specifications: body.specifications || {
        metal: '',
        purity: '',
        weight: '',
        stones: [],
        hallmarked: false
      },
      stock: parseInt(body.stock) || 0,
      featured: body.featured || false
    }

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      
      // Handle specific error cases
      if (error.code === '23505') {
        // Unique constraint violation (duplicate slug)
        if (error.message.includes('slug')) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'A product with this URL slug already exists. Please use a different product name or modify the slug.' 
            },
            { status: 400 }
          )
        } else {
          return NextResponse.json(
            { 
              success: false, 
              error: 'A product with these details already exists.' 
            },
            { status: 400 }
          )
        }
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create product. Please check your input and try again.' 
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
    console.error('Error creating product:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create product' 
      },
      { status: 500 }
    )
  }
}

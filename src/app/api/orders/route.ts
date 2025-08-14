import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Start with base query
    let query = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
    
    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }
    
    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,id.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    
    const { data: orders, error, count } = await query
      .range(from, to)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch orders' 
        },
        { status: 500 }
      )
    }

    // Transform data to match our existing Order type
    const transformedOrders = orders?.map((order: any) => ({
      _id: order.id,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone
      },
      items: order.items || [],
      totalAmount: order.total_amount,
      status: order.status,
      shippingAddress: order.shipping_address,
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at)
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        orders: transformedOrders,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const orderData = {
      customer_name: body.customer.name,
      customer_email: body.customer.email,
      customer_phone: body.customer.phone,
      items: body.items,
      total_amount: body.totalAmount,
      status: body.status || 'pending',
      shipping_address: body.shippingAddress
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create order' 
        },
        { status: 500 }
      )
    }

    // Transform response
    const transformedOrder = {
      _id: order.id,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone
      },
      items: order.items,
      totalAmount: order.total_amount,
      status: order.status,
      shippingAddress: order.shipping_address,
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at)
    }

    return NextResponse.json({
      success: true,
      data: transformedOrder
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order' 
      },
      { status: 500 }
    )
  }
}

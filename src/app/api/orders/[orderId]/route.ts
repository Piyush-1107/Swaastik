import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', params.orderId)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch order' 
        },
        { status: 500 }
      )
    }

    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )
    }

    // Transform data
    const transformedOrder = {
      _id: order.id,
      orderId: order.order_id,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone
      },
      items: order.items,
      totalAmount: order.total_amount,
      status: order.status,
      paymentStatus: order.payment_status,
      shippingAddress: order.shipping_address,
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at)
    }

    return NextResponse.json({
      success: true,
      data: transformedOrder
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch order' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const body = await request.json()
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.status) updateData.status = body.status
    if (body.paymentStatus) updateData.payment_status = body.paymentStatus
    if (body.customer) {
      if (body.customer.name) updateData.customer_name = body.customer.name
      if (body.customer.email) updateData.customer_email = body.customer.email
      if (body.customer.phone) updateData.customer_phone = body.customer.phone
    }
    if (body.items) updateData.items = body.items
    if (body.totalAmount) updateData.total_amount = body.totalAmount
    if (body.shippingAddress) updateData.shipping_address = body.shippingAddress

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', params.orderId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update order' 
        },
        { status: 500 }
      )
    }

    // Transform response
    const transformedOrder = {
      _id: order.id,
      orderId: order.order_id,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone
      },
      items: order.items,
      totalAmount: order.total_amount,
      status: order.status,
      paymentStatus: order.payment_status,
      shippingAddress: order.shipping_address,
      createdAt: new Date(order.created_at),
      updatedAt: new Date(order.updated_at)
    }

    return NextResponse.json({
      success: true,
      data: transformedOrder
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', params.orderId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to delete order' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete order' 
      },
      { status: 500 }
    )
  }
}

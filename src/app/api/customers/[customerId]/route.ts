import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const { customerId } = params

    // Fetch orders for this customer
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .or(`customer_email.eq.${customerId.replace('CUST-', '').toLowerCase()}@gmail.com,id.eq.${customerId}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch customer data' 
        },
        { status: 500 }
      )
    }

    if (!orders || orders.length === 0) {
      // Try to find by email pattern or return not found
      const emailPattern = customerId.replace('CUST-', '').toLowerCase()
      const { data: ordersByEmail, error: emailError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .ilike('customer_email', `%${emailPattern}%`)
        .order('created_at', { ascending: false })

      if (emailError || !ordersByEmail || ordersByEmail.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Customer not found' 
          },
          { status: 404 }
        )
      }
      
      // Use orders found by email
      orders.splice(0, 0, ...ordersByEmail)
    }

    // Aggregate customer data from orders
    const firstOrder = orders[0]
    const customer = {
      _id: firstOrder.customer_email,
      customerId: `CUST-${firstOrder.customer_email.split('@')[0].toUpperCase()}`,
      name: firstOrder.customer_name,
      email: firstOrder.customer_email,
      phone: firstOrder.customer_phone,
      location: firstOrder.shipping_address?.city || 'Unknown',
      state: firstOrder.shipping_address?.state || 'Unknown',
      fullAddress: firstOrder.shipping_address || {},
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.total_amount, 0),
      joinDate: new Date(orders[orders.length - 1].created_at).toISOString(),
      lastOrderDate: new Date(orders[0].created_at).toISOString(),
      status: 'active',
      orders: orders.map(order => ({
        id: order.id,
        amount: order.total_amount,
        status: order.status,
        date: order.created_at,
        items: order.items || []
      }))
    }

    // Calculate tier based on total spent
    let customerTier = 'bronze'
    if (customer.totalSpent >= 100000) { // 1 lakh+
      customerTier = 'platinum'
    } else if (customer.totalSpent >= 50000) { // 50k+
      customerTier = 'gold'
    } else if (customer.totalSpent >= 20000) { // 20k+
      customerTier = 'silver'
    }

    // Determine status based on last order
    const daysSinceLastOrder = (new Date().getTime() - new Date(customer.lastOrderDate).getTime()) / (1000 * 3600 * 24)
    const customerStatus = daysSinceLastOrder > 180 ? 'inactive' : 'active'

    const finalCustomer = {
      ...customer,
      tier: customerTier,
      status: customerStatus,
      avgOrderValue: customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0
    }

    return NextResponse.json({
      success: true,
      data: finalCustomer
    })

  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch customer data' 
      },
      { status: 500 }
    )
  }
}

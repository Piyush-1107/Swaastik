import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const tier = searchParams.get('tier')
    const location = searchParams.get('location')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Fetch all orders to aggregate customer data
    let ordersQuery = supabaseAdmin
      .from('orders')
      .select('*')

    if (search) {
      ordersQuery = ordersQuery.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`)
    }

    const { data: orders, error } = await ordersQuery.order('created_at', { ascending: false })

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

    // Aggregate customer data from orders
    const customerMap = new Map()
    
    orders?.forEach((order: any) => {
      const customerId = order.customer_email // Use email as unique identifier
      
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          _id: customerId,
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          totalOrders: 0,
          totalSpent: 0,
          status: 'active',
          lastOrderDate: new Date(order.created_at),
          joinDate: new Date(order.created_at),
          location: order.shipping_address?.city || 'Unknown',
          state: order.shipping_address?.state || 'Unknown',
          orders: []
        })
      }

      const customer = customerMap.get(customerId)
      customer.totalOrders += 1
      customer.totalSpent += order.total_amount
      customer.orders.push({
        id: order.id,
        amount: order.total_amount,
        status: order.status,
        date: order.created_at
      })
      
      // Update last order date if this order is more recent
      if (new Date(order.created_at) > customer.lastOrderDate) {
        customer.lastOrderDate = new Date(order.created_at)
      }
      
      // Update join date if this order is older
      if (new Date(order.created_at) < customer.joinDate) {
        customer.joinDate = new Date(order.created_at)
      }
    })

    // Convert map to array and calculate tiers
    let customers = Array.from(customerMap.values()).map(customer => {
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
      const daysSinceLastOrder = (new Date().getTime() - customer.lastOrderDate.getTime()) / (1000 * 3600 * 24)
      const customerStatus = daysSinceLastOrder > 180 ? 'inactive' : 'active'

      return {
        ...customer,
        customerId: `CUST-${customer.email.split('@')[0].toUpperCase()}`,
        tier: customerTier,
        status: customerStatus,
        avgOrderValue: customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0,
        joinDate: customer.joinDate.toISOString(),
        lastOrderDate: customer.lastOrderDate.toISOString()
      }
    })

    // Apply filters
    if (status && status !== 'all') {
      customers = customers.filter(customer => customer.status === status)
    }

    if (tier && tier !== 'all') {
      customers = customers.filter(customer => customer.tier === tier)
    }

    if (location && location !== 'all') {
      customers = customers.filter(customer => 
        customer.location.toLowerCase().includes(location.toLowerCase()) ||
        customer.state.toLowerCase().includes(location.toLowerCase())
      )
    }

    // Sort by total spent (descending)
    customers.sort((a, b) => b.totalSpent - a.totalSpent)

    // Apply pagination
    const total = customers.length
    const from = (page - 1) * limit
    const to = from + limit
    const paginatedCustomers = customers.slice(from, to)

    return NextResponse.json({
      success: true,
      data: {
        customers: paginatedCustomers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          totalCustomers: customers.length,
          activeCustomers: customers.filter(c => c.status === 'active').length,
          inactiveCustomers: customers.filter(c => c.status === 'inactive').length,
          averageOrderValue: customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length || 0,
          totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch customers' 
      },
      { status: 500 }
    )
  }
}

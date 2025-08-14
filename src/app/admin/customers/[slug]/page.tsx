'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
  }
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  createdAt: string
  status: 'active' | 'inactive'
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  items: number
}

export default function CustomerDetailPage() {
  const params = useParams()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For now, we'll use mock data since we don't have a customers API yet
    const mockCustomer: Customer = {
      id: params.slug as string,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      address: {
        street: '123 MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      totalOrders: 5,
      totalSpent: 45000,
      lastOrderDate: '2024-01-15',
      createdAt: '2023-06-15',
      status: 'active'
    }

    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        total: 12500,
        status: 'delivered',
        createdAt: '2024-01-15',
        items: 2
      },
      {
        id: '2',
        orderNumber: 'ORD-2023-089',
        total: 8500,
        status: 'delivered',
        createdAt: '2023-12-20',
        items: 1
      },
      {
        id: '3',
        orderNumber: 'ORD-2023-067',
        total: 15000,
        status: 'delivered',
        createdAt: '2023-11-10',
        items: 3
      },
      {
        id: '4',
        orderNumber: 'ORD-2023-045',
        total: 6000,
        status: 'delivered',
        createdAt: '2023-09-25',
        items: 1
      },
      {
        id: '5',
        orderNumber: 'ORD-2023-023',
        total: 3000,
        status: 'delivered',
        createdAt: '2023-08-05',
        items: 1
      }
    ]

    // Simulate API call
    setTimeout(() => {
      setCustomer(mockCustomer)
      setOrders(mockOrders)
      setLoading(false)
    }, 500)
  }, [params.slug])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Customer Not Found</h1>
          <p className="text-gray-600 mb-6">The customer you're looking for doesn't exist.</p>
          <Link href="/admin/customers">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600">Customer ID: {customer.id}</p>
          </div>
        </div>
        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
          {customer.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                {customer.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Customer Since</p>
                    <p className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {customer.lastOrderDate && (
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Last Order</p>
                      <p className="font-medium">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {customer.address && (
                <>
                  <Separator />
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {customer.address.street}<br />
                        {customer.address.city}, {customer.address.state} {customer.address.pincode}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Recent orders from this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{order.orderNumber}</p>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'pending' ? 'secondary' :
                          order.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.items} item{order.items !== 1 ? 's' : ''} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">₹{customer.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{customer.totalOrders}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <Separator />
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">₹{Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Average Order Value</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button className="w-full" variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call Customer
              </Button>
              <Button className="w-full" variant="outline">
                <ShoppingBag className="w-4 h-4 mr-2" />
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
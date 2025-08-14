'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Calendar,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

// Mock order data - in real app, fetch based on order ID
const orderData = {
  id: 'ORD-2024-002',
  customer: {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 87654 32109'
  },
  status: 'shipped',
  payment: 'paid',
  paymentMethod: 'Credit Card',
  transactionId: 'TXN123456789',
  amount: {
    subtotal: 12000,
    tax: 500,
    shipping: 0,
    total: 12500
  },
  address: {
    line1: '123 Main Street',
    line2: 'Apartment 4B',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110001',
    country: 'India'
  },
  dates: {
    ordered: '2024-08-07T10:30:00Z',
    shipped: '2024-08-08T14:20:00Z',
    estimated: '2024-08-12T18:00:00Z'
  },
  items: [
    {
      id: 1,
      name: 'Gold Diamond Ring',
      sku: 'GDR-001',
      price: 12000,
      quantity: 1,
      image: '/api/placeholder/100/100',
      specifications: {
        metal: 'Gold',
        purity: '18K',
        weight: '3.2g',
        stones: ['Diamond - 0.5ct']
      }
    }
  ],
  timeline: [
    {
      status: 'Order Placed',
      date: '2024-08-07T10:30:00Z',
      description: 'Order has been successfully placed and payment confirmed'
    },
    {
      status: 'Processing',
      date: '2024-08-07T16:45:00Z',
      description: 'Order is being prepared for shipment'
    },
    {
      status: 'Shipped',
      date: '2024-08-08T14:20:00Z',
      description: 'Package has been shipped via Blue Dart - AWB: BD123456789'
    }
  ]
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
]

const statusConfig = {
  pending: { 
    label: 'Pending', 
    variant: 'secondary' as const, 
    icon: Clock,
    color: 'text-yellow-600'
  },
  processing: { 
    label: 'Processing', 
    variant: 'default' as const, 
    icon: Package,
    color: 'text-blue-600'
  },
  shipped: { 
    label: 'Shipped', 
    variant: 'default' as const, 
    icon: Truck,
    color: 'text-purple-600'
  },
  delivered: { 
    label: 'Delivered', 
    variant: 'default' as const, 
    icon: CheckCircle,
    color: 'text-green-600'
  },
  cancelled: { 
    label: 'Cancelled', 
    variant: 'destructive' as const, 
    icon: XCircle,
    color: 'text-red-600'
  }
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(orderData)
  const [updating, setUpdating] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true)
    try {
      // TODO: Replace with actual API call
      console.log('Updating order status to:', newStatus)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setOrder(prev => ({ ...prev, status: newStatus }))
      toast.success('Order status updated successfully!')
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null
    const Icon = config.icon
    return <Icon className={`h-4 w-4 ${config.color}`} />
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="outline" size="icon">
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-secondary">Order Details</h1>
            <p className="text-muted-foreground">Order #{order.id}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <Badge variant={statusConfig[order.status as keyof typeof statusConfig]?.variant}>
                {statusConfig[order.status as keyof typeof statusConfig]?.label}
              </Badge>
            </div>
            
            <Select 
              value={order.status} 
              onValueChange={handleStatusUpdate}
              disabled={updating}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Metal:</span> {item.specifications.metal}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Purity:</span> {item.specifications.purity}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Weight:</span> {item.specifications.weight}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Stones:</span> {item.specifications.stones.join(', ')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.price)}</div>
                        <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        {index < order.timeline.length - 1 && (
                          <div className="w-px h-8 bg-border mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.status}</h4>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(event.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">{order.customer.name}</h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.customer.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{order.customer.phone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <div>{order.address.line1}</div>
                  {order.address.line2 && <div>{order.address.line2}</div>}
                  <div>{order.address.city}, {order.address.state}</div>
                  <div>{order.address.pincode}</div>
                  <div>{order.address.country}</div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Payment Method</span>
                  <span className="text-sm font-medium">{order.paymentMethod}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Transaction ID</span>
                  <span className="text-sm font-medium">{order.transactionId}</span>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.amount.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatCurrency(order.amount.tax)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{order.amount.shipping === 0 ? 'Free' : formatCurrency(order.amount.shipping)}</span>
                  </div>
                  
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(order.amount.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Order Placed</div>
                  <div className="text-sm text-muted-foreground">{formatDate(order.dates.ordered)}</div>
                </div>
                
                {order.dates.shipped && (
                  <div>
                    <div className="text-sm font-medium">Shipped</div>
                    <div className="text-sm text-muted-foreground">{formatDate(order.dates.shipped)}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm font-medium">Estimated Delivery</div>
                  <div className="text-sm text-muted-foreground">{formatDate(order.dates.estimated)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

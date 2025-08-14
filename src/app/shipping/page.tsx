import { Truck, RotateCcw, Shield, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4">Shipping & Delivery</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We ensure your precious jewelry reaches you safely and on time with our reliable shipping options.
        </p>
      </div>

      {/* Shipping Options */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              Free Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Enjoy free shipping on all orders above ₹5,000 across India.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Delivery in 3-5 business days</li>
              <li>• Tracking provided</li>
              <li>• Insured shipment</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Express Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Get your jewelry delivered within 24-48 hours.
            </p>
            <ul className="text-sm space-y-1">
              <li>• ₹250 shipping charge</li>
              <li>• Available in major cities</li>
              <li>• Real-time tracking</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Secure Packaging
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              All jewelry is packaged in secure, tamper-proof boxes.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Bubble wrap protection</li>
              <li>• Premium gift boxes</li>
              <li>• Insurance coverage</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Zones */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Shipping Zones & Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Zone</th>
                  <th className="text-left py-3 px-4">Areas Covered</th>
                  <th className="text-left py-3 px-4">Standard Delivery</th>
                  <th className="text-left py-3 px-4">Express Delivery</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Zone 1</td>
                  <td className="py-3 px-4">Karnataka, Tamil Nadu, Andhra Pradesh</td>
                  <td className="py-3 px-4">2-3 days</td>
                  <td className="py-3 px-4">24-48 hours</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Zone 2</td>
                  <td className="py-3 px-4">Maharashtra, Gujarat, Kerala, Telangana</td>
                  <td className="py-3 px-4">3-4 days</td>
                  <td className="py-3 px-4">48-72 hours</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Zone 3</td>
                  <td className="py-3 px-4">Delhi, Mumbai, Pune, Hyderabad</td>
                  <td className="py-3 px-4">3-5 days</td>
                  <td className="py-3 px-4">48-72 hours</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-medium">Zone 4</td>
                  <td className="py-3 px-4">Rest of India</td>
                  <td className="py-3 px-4">5-7 days</td>
                  <td className="py-3 px-4">Not Available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium mb-1">Order Processing</h4>
              <p className="text-sm text-muted-foreground">
                Orders are processed within 24 hours on business days.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Delivery Attempts</h4>
              <p className="text-sm text-muted-foreground">
                We make up to 3 delivery attempts before returning to warehouse.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Signature Required</h4>
              <p className="text-sm text-muted-foreground">
                All deliveries require signature confirmation for security.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Holiday Delays</h4>
              <p className="text-sm text-muted-foreground">
                Delivery may be delayed during festivals and public holidays.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Track Your Order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Once your order is shipped, you'll receive a tracking number via SMS and email.
            </p>
            <div className="space-y-2">
              <h4 className="font-medium">How to Track:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Visit our website and go to "Track Order"</li>
                <li>• Enter your order number and registered phone number</li>
                <li>• Get real-time updates on your shipment</li>
                <li>• Receive SMS notifications for key milestones</li>
              </ul>
            </div>
            <div className="pt-3">
              <p className="text-sm text-muted-foreground">
                <strong>Need help?</strong> Contact our shipping support at +91 98765 43210
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

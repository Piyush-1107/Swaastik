import { RotateCcw, ShieldCheck, Clock, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4">Returns & Exchange</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your satisfaction is our priority. We offer hassle-free returns and exchanges 
          to ensure you're completely happy with your purchase.
        </p>
      </div>

      {/* Return Policy Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">30-Day Returns</h3>
            <p className="text-sm text-muted-foreground">
              Return within 30 days of delivery
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <RotateCcw className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Free Returns</h3>
            <p className="text-sm text-muted-foreground">
              No questions asked returns
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-sm text-muted-foreground">
              Full refund if not satisfied
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Easy Process</h3>
            <p className="text-sm text-muted-foreground">
              Simple online return process
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Return Conditions */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Return Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-600 mb-3">✓ Eligible for Return</h4>
              <ul className="space-y-2 text-sm">
                <li>• Items returned within 30 days of delivery</li>
                <li>• Jewelry in original condition with tags</li>
                <li>• Original packaging and certificates included</li>
                <li>• Items not worn or damaged</li>
                <li>• All accessories and boxes included</li>
                <li>• Purchase receipt or order number provided</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-3">✗ Not Eligible for Return</h4>
              <ul className="space-y-2 text-sm">
                <li>• Custom or personalized jewelry</li>
                <li>• Items damaged due to misuse</li>
                <li>• Jewelry altered or resized</li>
                <li>• Items returned after 30 days</li>
                <li>• Missing original packaging</li>
                <li>• Sale or clearance items (marked final sale)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Process */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>How to Return</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Initiate Return</h4>
              <p className="text-sm text-muted-foreground">
                Contact us at +91 98765 43210 or email returns@swastikgems.com 
                with your order details.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Pack & Ship</h4>
              <p className="text-sm text-muted-foreground">
                We'll provide a prepaid return label. Pack the item securely 
                in original packaging.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Get Refund</h4>
              <p className="text-sm text-muted-foreground">
                Once we receive and inspect the item, your refund will be 
                processed within 5-7 business days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Policy */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Exchange Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              We offer exchanges for size adjustments and style preferences within 30 days of purchase.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Size Exchange</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Free size exchange for rings</li>
                  <li>• Adjustment within available sizes</li>
                  <li>• One-time exchange per item</li>
                  <li>• Original condition required</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Style Exchange</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Exchange for items of equal or higher value</li>
                  <li>• Pay difference if applicable</li>
                  <li>• Subject to availability</li>
                  <li>• Shipping charges may apply</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refund Information */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Refund Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Refund Timeline</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Credit/Debit Card: 5-7 business days</li>
                <li>• Net Banking: 5-7 business days</li>
                <li>• UPI/Wallets: 3-5 business days</li>
                <li>• Cash on Delivery: Bank transfer within 7-10 days</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Refund Method</h4>
              <p className="text-sm text-muted-foreground">
                Refunds are processed using the same payment method used for purchase. 
                For cash on delivery orders, refunds are made via bank transfer to your provided account.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact for Returns */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help with Returns?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-1">Phone Support</h4>
              <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              <p className="text-xs text-muted-foreground">Mon-Sat: 10 AM - 8 PM</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Email Support</h4>
              <p className="text-sm text-muted-foreground">returns@swastikgems.com</p>
              <p className="text-xs text-muted-foreground">Response within 24 hours</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Live Chat</h4>
              <p className="text-sm text-muted-foreground">Available on website</p>
              <p className="text-xs text-muted-foreground">Instant assistance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

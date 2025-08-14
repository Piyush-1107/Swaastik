import { Ruler, Circle, Users, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SizeGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4">Size Guide</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find your perfect fit with our comprehensive size guide for rings, necklaces, 
          bracelets, and other jewelry pieces.
        </p>
      </div>

      {/* Ring Size Guide */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Circle className="h-5 w-5 mr-2 text-primary" />
            Ring Size Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">How to Measure Ring Size</h4>
              <ol className="space-y-3 text-sm">
                <li className="flex">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                  <span>Wrap a string or paper strip around your finger</span>
                </li>
                <li className="flex">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                  <span>Mark where the string overlaps</span>
                </li>
                <li className="flex">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                  <span>Measure the length with a ruler</span>
                </li>
                <li className="flex">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                  <span>Compare with our size chart below</span>
                </li>
              </ol>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h5 className="font-semibold mb-2">Pro Tips:</h5>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Measure when your hands are at normal temperature</li>
                  <li>• Measure the finger you plan to wear the ring on</li>
                  <li>• Consider the width of the ring band</li>
                  <li>• When in doubt, choose a slightly larger size</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Ring Size Chart</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left">US Size</th>
                      <th className="border border-border p-2 text-left">UK Size</th>
                      <th className="border border-border p-2 text-left">Diameter (mm)</th>
                      <th className="border border-border p-2 text-left">Circumference (mm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-border p-2">4</td><td className="border border-border p-2">H</td><td className="border border-border p-2">14.9</td><td className="border border-border p-2">46.8</td></tr>
                    <tr><td className="border border-border p-2">5</td><td className="border border-border p-2">J</td><td className="border border-border p-2">15.7</td><td className="border border-border p-2">49.3</td></tr>
                    <tr><td className="border border-border p-2">6</td><td className="border border-border p-2">L</td><td className="border border-border p-2">16.5</td><td className="border border-border p-2">51.8</td></tr>
                    <tr><td className="border border-border p-2">7</td><td className="border border-border p-2">N</td><td className="border border-border p-2">17.3</td><td className="border border-border p-2">54.4</td></tr>
                    <tr><td className="border border-border p-2">8</td><td className="border border-border p-2">P</td><td className="border border-border p-2">18.1</td><td className="border border-border p-2">56.9</td></tr>
                    <tr><td className="border border-border p-2">9</td><td className="border border-border p-2">R</td><td className="border border-border p-2">19.0</td><td className="border border-border p-2">59.5</td></tr>
                    <tr><td className="border border-border p-2">10</td><td className="border border-border p-2">T</td><td className="border border-border p-2">19.8</td><td className="border border-border p-2">62.1</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Necklace Size Guide */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Necklace Length Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Necklace Lengths</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">Choker</span>
                  <span className="text-muted-foreground">14-16 inches</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">Princess</span>
                  <span className="text-muted-foreground">17-19 inches</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">Matinee</span>
                  <span className="text-muted-foreground">20-24 inches</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">Opera</span>
                  <span className="text-muted-foreground">28-34 inches</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <span className="font-medium">Rope</span>
                  <span className="text-muted-foreground">35+ inches</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">How to Measure</h4>
              <ol className="space-y-2 text-sm">
                <li>1. Use a flexible measuring tape</li>
                <li>2. Wrap around your neck where you want the necklace to sit</li>
                <li>3. Add 2-4 inches for comfortable wearing</li>
                <li>4. For layering, choose different lengths</li>
              </ol>
              
              <div className="mt-6">
                <h5 className="font-semibold mb-2">Popular Choices:</h5>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <strong>16":</strong> Classic choice for most people</li>
                  <li>• <strong>18":</strong> Most versatile length</li>
                  <li>• <strong>20":</strong> Great for business wear</li>
                  <li>• <strong>24":</strong> Perfect for layering</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bracelet Size Guide */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>Bracelet Size Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">How to Measure Wrist</h4>
              <ol className="space-y-2 text-sm">
                <li>1. Use a flexible measuring tape or string</li>
                <li>2. Wrap around your wrist below the wrist bone</li>
                <li>3. The tape should be snug but not tight</li>
                <li>4. Add 0.5-1 inch for comfortable fit</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Standard Sizes</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 border rounded">
                  <span>Small</span>
                  <span>6.5 - 7 inches</span>
                </div>
                <div className="flex justify-between p-2 border rounded">
                  <span>Medium</span>
                  <span>7 - 7.5 inches</span>
                </div>
                <div className="flex justify-between p-2 border rounded">
                  <span>Large</span>
                  <span>7.5 - 8 inches</span>
                </div>
                <div className="flex justify-between p-2 border rounded">
                  <span>Extra Large</span>
                  <span>8 - 8.5 inches</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-primary" />
            Need Additional Help?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Personal Consultation</h4>
              <p className="text-sm text-muted-foreground">
                Visit our store for professional sizing assistance
              </p>
            </div>
            <div className="text-center">
              <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Call Us</h4>
              <p className="text-sm text-muted-foreground">
                +91 98765 43210 for sizing guidance
              </p>
            </div>
            <div className="text-center">
              <Ruler className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Free Resize</h4>
              <p className="text-sm text-muted-foreground">
                One-time free resizing within 30 days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

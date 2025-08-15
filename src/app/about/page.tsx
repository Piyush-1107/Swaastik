import Image from 'next/image'
import { Award, Shield, Heart, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      {/* Hero Section */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-3">About Swaastik Gems & Jewels</h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto">
          Manufacturers of premium Gold and Diamond Jewellery, crafting exquisite jewelry pieces 
          that celebrate life's precious moments with quality and authenticity.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary mb-4">Our Story</h2>
          <div className="space-y-3 text-sm sm:text-base text-muted-foreground">
            <p>
              Founded by Mr. Abhishek Kumar Gupta, Swaastik Gems & Jewels began as a vision 
              to create beautiful, authentic Gold and Diamond Jewellery that people could treasure for generations.
            </p>
            <p>
              Located in the heart of Gorakhpur at Nahar Road, Azad Chowk, Rustampur, we have established 
              ourselves as trusted manufacturers of premium jewelry. Our journey has been marked by 
              continuous innovation, exceptional craftsmanship, and an unwavering commitment to quality.
            </p>
            <p>
              Today, we proudly serve customers with our expertise in Gold and Diamond Jewellery manufacturing, 
              offering a diverse collection that combines traditional artistry with contemporary designs. 
              Every piece in our collection is carefully crafted to meet the highest standards of quality and authenticity.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-muted">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              [Jewelry Workshop Image]
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary text-center mb-6">Our Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Quality Assurance</h3>
              <p className="text-sm text-muted-foreground">
                100% BIS hallmarked gold and certified diamonds ensure authenticity and purity
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Trust & Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Honest pricing, transparent policies, and ethical business practices
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Customer First</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated customer service and lifetime support for all our jewelry
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Family Tradition</h3>
              <p className="text-sm text-muted-foreground">
                Three generations of jewelry expertise passed down through our family
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary text-center mb-6">Leadership</h2>
        <div className="flex justify-center">
          <Card className="text-center max-w-md">
            <CardContent className="pt-6">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-1">Mr. Abhishek Kumar Gupta</h3>
              <p className="text-primary font-medium mb-2">Founder & Owner</p>
              <p className="text-sm text-muted-foreground">
                Expert manufacturer of Gold and Diamond Jewellery with extensive experience in 
                creating premium jewelry pieces that blend traditional craftsmanship with modern designs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-secondary text-center mb-8">Our Journey in Numbers</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">25+</div>
            <div className="text-muted-foreground">Years of Excellence</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">50K+</div>
            <div className="text-muted-foreground">Happy Customers</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
            <div className="text-muted-foreground">Jewelry Pieces</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">99%</div>
            <div className="text-muted-foreground">Customer Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary mb-8">Certifications & Memberships</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-2">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="text-sm font-medium">BIS Hallmark</div>
          </Card>
          <Card className="p-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-2">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="text-sm font-medium">GIA Certified</div>
          </Card>
          <Card className="p-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-2">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="text-sm font-medium">ISO 9001:2015</div>
          </Card>
          <Card className="p-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-2">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="text-sm font-medium">Jewellers Association</div>
          </Card>
        </div>
      </div>
    </div>
  )
}

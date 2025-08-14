import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FeaturedProductsCarousel } from '@/components/home/FeaturedProductsCarousel'

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-primary font-medium text-sm uppercase tracking-wider">
                Trusted Since 1995
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-secondary leading-tight">
                Exquisite Indian
                <span className="text-primary block">Jewelry Collection</span>
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Discover our handcrafted jewelry collection featuring authentic designs, 
              100% BIS hallmarked gold and silver pieces that celebrate timeless elegance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link href="/products">
                  Explore Collection
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link href="/about">
                  Our Story
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <span className="text-sm font-medium">BIS Hallmarked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <span className="text-sm font-medium">Lifetime Exchange</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <span className="text-sm font-medium">Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
              
              {/* Main image container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
                {/* Featured Products Carousel */}
                <FeaturedProductsCarousel />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-8 right-8 bg-white rounded-lg shadow-lg p-3 hidden lg:block">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium">1000+ Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-secondary rounded-full animate-pulse delay-100"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-primary rounded-full animate-pulse delay-200"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-secondary rounded-full animate-pulse delay-300"></div>
      </div>
    </section>
  )
}

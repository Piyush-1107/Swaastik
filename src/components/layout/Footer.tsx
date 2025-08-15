import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Newsletter section */}
      <div className="border-b border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-2xl font-semibold mb-4">
              Stay Updated with Our Latest Collections
            </h3>
            <p className="text-secondary-foreground/80 mb-6">
              Subscribe to our newsletter and be the first to know about new arrivals, 
              exclusive offers, and jewelry care tips.
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10">
                <Image
                  src="/swaastik-logo.png"
                  alt="Swaastik Gems & Jewels"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Swaastik</h3>
                <p className="text-xs text-secondary-foreground/70 tracking-wider">GEMS & JEWELS</p>
              </div>
            </div>
            <p className="text-secondary-foreground/80 mb-4 text-sm">
              Manufacturer of premium Gold and Diamond Jewellery located in Gorakhpur. 
              Led by Abhishek Kumar Gupta, we specialize in authentic, BIS hallmarked jewelry with exceptional craftsmanship.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-secondary-foreground/60 hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-secondary-foreground/60 hover:text-white">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-secondary-foreground/60 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-secondary-foreground/60 hover:text-white">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/rings" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/category/earrings" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/category/necklaces" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/category/bangles" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Bangles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/care-guide" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  Jewelry Care
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <div>
                  <p className="text-secondary-foreground/80">
                    Nahar Road, Azad Chowk<br />
                    Rustampur, Gorakhpur<br />
                    Uttar Pradesh, India
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+919616999929" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  +91 96169 99929
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:abhishek@swaastikgems.com" className="text-secondary-foreground/80 hover:text-white transition-colors">
                  abhishek@swaastikgems.com
                </a>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6">
              <h5 className="font-medium mb-3 text-sm">We Accept</h5>
              <div className="flex space-x-2">
                <div className="bg-white rounded px-2 py-1 text-xs text-gray-800">UPI</div>
                <div className="bg-white rounded px-2 py-1 text-xs text-gray-800">Cards</div>
                <div className="bg-white rounded px-2 py-1 text-xs text-gray-800">COD</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="text-secondary-foreground/80 mb-4 md:mb-0">
              © {currentYear} Swaastik Gems & Jewels. All rights reserved. | Abhishek Kumar Gupta
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-secondary-foreground/80 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-secondary-foreground/80 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-secondary-foreground/80 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

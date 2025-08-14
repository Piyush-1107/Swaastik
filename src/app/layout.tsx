import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { AuthProvider } from '@/context/AuthContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'sonner'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Swaastik Gems & Jewels - Gold & Diamond Jewellery Manufacturer',
    template: '%s | Swaastik Gems & Jewels'
  },
  description: 'Manufacturer of premium Gold and Diamond Jewellery in Gorakhpur. Expert craftsmanship by Abhishek Kumar Gupta. 100% BIS Hallmarked jewelry with authentic quality.',
  keywords: [
    'Gold jewellery manufacturer',
    'Diamond jewellery manufacturer',
    'BIS hallmarked gold',
    'Gorakhpur jeweller',
    'Abhishek Kumar Gupta',
    'custom jewelry',
    'gold manufacturing',
    'diamond jewelry',
    'authentic jewelry',
    'Swaastik Gems'
  ],
  authors: [{ name: 'Abhishek Kumar Gupta - Swaastik Gems & Jewels' }],
  creator: 'Swaastik Gems & Jewels',
  publisher: 'Abhishek Kumar Gupta',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://swaastikgems.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://swaastikgems.com',
    title: 'Swaastik Gems & Jewels - Gold & Diamond Jewellery Manufacturer',
    description: 'Manufacturer of premium Gold and Diamond Jewellery in Gorakhpur. Expert craftsmanship by Abhishek Kumar Gupta. 100% BIS Hallmarked jewelry.',
    siteName: 'Swaastik Gems & Jewels',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swaastik Gems & Jewels - Gold & Diamond Jewellery Manufacturer',
    description: 'Manufacturer of premium Gold and Diamond Jewellery in Gorakhpur. Expert craftsmanship by Abhishek Kumar Gupta. 100% BIS Hallmarked jewelry.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster position="top-right" richColors />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

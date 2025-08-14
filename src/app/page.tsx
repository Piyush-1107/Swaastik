import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { TrustBadges } from '@/components/home/TrustBadges'
import { Testimonials } from '@/components/home/Testimonials'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBadges />
      <CategoryGrid />
      <FeaturedProducts />
      <Testimonials />
    </>
  )
}

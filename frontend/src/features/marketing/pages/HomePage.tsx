//src/features/marketing/pages/HomePage.tsx
import { PageContainer } from '@/components/layout/PageContainer'
import { Hero } from '../components/Hero'
import { FeatureGrid } from '../components/FeatureGrid'
import { CtaBanner } from '../components/CtaBanner'
import { RentalCategories } from '../components/RentalCategories'
import { RentalProcess } from '../components/RentalProcess'

export default function HomePage() {
  return (
    <PageContainer width="wide" className="space-y-16 py-4 md:py-8">
      <Hero />
      <FeatureGrid />
      <RentalCategories />
      <RentalProcess />
      <CtaBanner />
    </PageContainer>
  )
}

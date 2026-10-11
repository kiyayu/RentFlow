//src/features/marketing/pages/HomePage.tsx
import { PageContainer } from '@/components/layout/PageContainer'
import { Hero } from '../components/Hero'
import { FeatureGrid } from '../components/FeatureGrid'
import { CtaBanner } from '../components/CtaBanner'

export default function HomePage() {
  return (
    <PageContainer width="wide" className="space-y-12">
      <Hero />
      <FeatureGrid />
      <CtaBanner />
    </PageContainer>
  )
}
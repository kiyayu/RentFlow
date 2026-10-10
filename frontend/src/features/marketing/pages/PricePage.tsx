import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { Price } from "../components/Price"

export default function PricePage() {
  return (
    <PageContainer width="wide">
      <PageHeader
        title="Pricing"
        description="Compare plans and find the right fit for your business."
      />

      <Price />
    </PageContainer>
  )
}
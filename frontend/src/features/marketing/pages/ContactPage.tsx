//src/features/marketing/pages/ContactPage.tsx
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { site } from "@/config/site"

export default function ContactPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader title="Contact" description="Questions, feedback or support requests." />
      <div className="p-6 space-y-4 bg-card border border-border rounded-xl shadow-sm">
        <p className="text-sm text-foreground">
          Email us and we will reply as soon as we can.
        </p>
        <Button asChild icon={<Mail />}>
          <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
        </Button>
      </div>
    </PageContainer>
  )
}
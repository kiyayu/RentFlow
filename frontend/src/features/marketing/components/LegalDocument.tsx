//src/features/marketing/components/LegalDocument.tsx
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { site } from "@/config/site"
import type { LegalSection } from "../legal.content"

export function LegalDocument({
  title,
  sections,
}: {
  title: string
  sections: LegalSection[]
}) {
  return (
    <PageContainer width="narrow">
      <PageHeader title={title} description={`Last updated: ${site.legalUpdated}`} />
      <article className="p-6 space-y-6 bg-card border border-border rounded-xl shadow-sm">
        {sections.map(({ heading, body }) => (
          <section key={heading} className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">{heading}</h2>
            {body.map((paragraph, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </article>
    </PageContainer>
  )
}
//src/features/marketing/pages/TermsPage.tsx
import { LegalDocument } from "../components/LegalDocument"
import { termsSections } from "../legal.content"

export default function TermsPage() {
  return <LegalDocument title="Terms of Service" sections={termsSections} />
}
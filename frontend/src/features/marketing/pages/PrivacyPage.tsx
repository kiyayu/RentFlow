//src/features/marketing/pages/PrivacyPage.tsx
import { LegalDocument } from "../components/LegalDocument"
import { privacySections } from "../legal.content"

export default function PrivacyPage() {
  return <LegalDocument title="Privacy Policy" sections={privacySections} />
}
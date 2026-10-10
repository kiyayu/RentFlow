//src/features/dashboard/pages/Dashboard.tsx
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"

export default function Dashboard() {
  return (
    <PageContainer width="wide">
      <PageHeader
        title="Dashboard"
        description="An overview of your account."
        actions={<Button>New note</Button>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Notes", "Sessions", "Activity"].map((label) => (
          <div key={label} className="p-6 space-y-1 bg-card border border-border rounded-xl shadow-sm">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-semibold text-foreground">0</p>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
//src/features/settings/SettingsLayout.tsx
import { Outlet } from "react-router-dom"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { SettingsNav } from "./SettingsNav"
import { settingsConfig } from "./settings.config"

export default function SettingsLayout() {
  return (
    <PageContainer>
      <PageHeader title={settingsConfig.title} description={settingsConfig.description} />
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <SettingsNav />
        </aside>
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </PageContainer>
  )
}
//src/store/layout.ui.store.ts
import { create } from "zustand"

type LayoutStore = {
  sidebarOpen: boolean           
  sidebarCollapsed: boolean      
  openSidebar: () => void
  closeSidebar: () => void
  collapseSidebar: () => void
  expandSidebar: () => void
}

export const useLayoutStore = create<LayoutStore>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  collapseSidebar: () => set({ sidebarCollapsed: true }),
  expandSidebar: () => set({ sidebarCollapsed: false }),
}))
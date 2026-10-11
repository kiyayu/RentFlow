//src/components/layout/MobileSidebar.tsx
import { useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useLayoutStore } from '@/store/layout.ui.store'
import { NavList } from './NavList'
import { appConfig } from './nav.config'

export function MobileSidebar() {
  const open = useLayoutStore((s) => s.sidebarOpen)
  const close = useLayoutStore((s) => s.closeSidebar)

  // if the window grows to desktop while the drawer is open, close it
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) close()
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [close])

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && close()}>
      <SheetContent side="left" className="w-64 p-4 lg:hidden">
        <SheetHeader>
          <SheetTitle>{appConfig.brand}</SheetTitle>
        </SheetHeader>
        <NavList onNavigate={close} />
      </SheetContent>
    </Sheet>
  )
}
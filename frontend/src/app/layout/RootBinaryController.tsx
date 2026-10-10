// src/app/layout/RootBinaryController.tsx
import { DocumentTitle } from '@/components/layout/DocumentTitle'
import { Outlet } from 'react-router-dom'

export default function RootBinaryController() {
  <DocumentTitle />
  return <Outlet />
}
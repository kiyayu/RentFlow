import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { paths } from '@/config/paths'
import { sessionQueryOptions } from '@/features/auth'
import { useTranslation } from '@/lib/i18n'
import { ProductManagement } from '../components/ProductManagement'

export default function ManageProductsPage() {
  const { t } = useTranslation('product')
  const { data: user } = useQuery(sessionQueryOptions)

  if (user?.role !== 'staff' && user?.role !== 'admin') return <Navigate to={paths.app.dashboard} replace />

  return <PageContainer width="wide" className="space-y-8 py-8"><PageHeader title={t('manage.title')} description={t('manage.description')} /><ProductManagement /></PageContainer>
}

import { Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { paths } from '@/config/paths'
import { sessionQueryOptions } from '@/features/auth'
import { useTranslation } from '@/lib/i18n'
import { ProductForm } from '../components/ProductForm'
import { useCreateProduct } from '../hooks/useProducts'

export default function CreateProductPage() {
  const { t } = useTranslation('product')
  const navigate = useNavigate()
  const { data: user } = useQuery(sessionQueryOptions)
  const createProduct = useCreateProduct()

  if (user?.role !== 'staff' && user?.role !== 'admin') return <Navigate to={paths.app.dashboard} replace />

  return (
    <PageContainer width="narrow" className="space-y-8 py-8">
      <PageHeader title={t('create.title')} description={t('create.description')} />
      <ProductForm
        isPending={createProduct.isPending}
        error={createProduct.error}
        onSubmit={(input) => createProduct.mutate(input, {
          onSuccess: () => {
            toast.success(t('create.success'))
            navigate(paths.app.products)
          },
        })}
      />
    </PageContainer>
  )
}

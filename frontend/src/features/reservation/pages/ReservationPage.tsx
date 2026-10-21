import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getErrorMessage } from '@/lib/errors'
import { paths } from '@/config/paths'
import { useProduct } from '@/features/product'
import { useCreateReservation } from '../hooks/useReservations'
import { useQuery } from '@tanstack/react-query'
import { sessionQueryOptions } from '@/features/auth'
import { useTranslation } from '@/lib/i18n'
import { useState } from 'react'

const schema = z.object({ quantity: z.number().int().min(1).max(20), startAt: z.string().min(1), endAt: z.string().min(1) }).refine((v) => new Date(v.startAt) < new Date(v.endAt), { path: ['endAt'], message: 'End date must be after start date' })
type Values = z.infer<typeof schema>

const toDateTimeLocal = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)

export default function ReservationPage() {
  const { t } = useTranslation('reservation')
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const product = useProduct(slug)
  const { data: user } = useQuery(sessionQueryOptions)
  const create = useCreateReservation()
  const [minimumStartAt] = useState(() => toDateTimeLocal(new Date(Date.now() + 15 * 60_000)))
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { quantity: 1, startAt: minimumStartAt } })
  if (!user) return <Navigate to={`${paths.login}?redirect=${encodeURIComponent(paths.app.reserveEquipment(slug))}`} replace />
  if (product.isError) return <Navigate to={paths.productCatalog} replace />
  if (!product.data) return <PageContainer><p className="text-sm text-muted-foreground">{t('create.loading')}</p></PageContainer>
  return <PageContainer width="narrow" className="space-y-8 py-8"><PageHeader title={t('create.title', { name: product.data.name })} description={t('create.description')} /><form className="space-y-5 rounded-xl border border-border bg-card p-6" onSubmit={handleSubmit((values) => create.mutate({ items: [{ productId: product.data!.id, quantity: values.quantity }], startAt: new Date(values.startAt).toISOString(), endAt: new Date(values.endAt).toISOString() }, { onSuccess: () => { toast.success(t('create.success')); navigate(paths.app.reservations) }, onError: (error) => toast.error(getErrorMessage(error)) }))}><Input label={t('create.quantity')} type="number" min="1" {...register('quantity', { valueAsNumber: true })} error={errors.quantity?.message} /><div className="space-y-1.5"><Input label={t('create.startAt')} type="datetime-local" min={minimumStartAt} {...register('startAt')} error={errors.startAt?.message} /><p className="text-xs text-muted-foreground">{t('create.futureHint')}</p></div><Input label={t('create.endAt')} type="datetime-local" min={minimumStartAt} {...register('endAt')} error={errors.endAt?.message} /><Button type="submit" disabled={create.isPending}>{create.isPending ? t('create.submitting') : t('create.submit')}</Button></form></PageContainer>
}

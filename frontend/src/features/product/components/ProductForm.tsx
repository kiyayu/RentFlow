import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/errors'
import { useTranslation } from '@/lib/i18n'
import type { CreateProductInput, Product } from '../types/product.types'
import { productFormSchema, type ProductFormValues } from '../schemas/product.schema'
import { ProductImageUploader } from './ProductImageUploader'

type Props = {
  onSubmit: (input: CreateProductInput) => void
  isPending: boolean
  error: unknown
  product?: Product
  submitLabel?: string
  pendingLabel?: string
}

export function ProductForm({ onSubmit, isPending, error, product, submitLabel, pendingLabel }: Props) {
  const { t } = useTranslation('product')
  const [imagesBusy, setImagesBusy] = useState(false)
  const { control, register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      brand: product?.brand ?? '',
      amount: product?.rentalPricing.amount,
      images: product?.images ?? [],
      specifications: product ? Object.entries(product.specifications).map(([key, value]) => ({ key, value })) : [],
    },
  })
  const specifications = useFieldArray({ control, name: 'specifications' })
  const images = useWatch({ control, name: 'images' }) ?? []

  const submit = (values: ProductFormValues) => onSubmit({
    name: values.name,
    description: values.description,
    brand: values.brand || undefined,
    images: values.images,
    specifications: Object.fromEntries(values.specifications.map(({ key, value }) => [key, value])),
    rentalPricing: { amount: values.amount, currency: 'ETB', billingUnit: 'day' },
  })

  return (
    <form className="space-y-8" onSubmit={handleSubmit(submit)} noValidate>
      {Boolean(error) && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{getErrorMessage(error)}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        <Input label={t('form.name')} autoComplete="off" {...register('name')} error={errors.name?.message} />
        <Input label={t('form.brand')} autoComplete="organization" {...register('brand')} error={errors.brand?.message} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="product-description" className="text-sm font-medium text-foreground">{t('form.description')}</label>
        <Textarea id="product-description" rows={6} {...register('description')} aria-invalid={!!errors.description} />
        {errors.description && <p className="text-xs font-medium text-destructive">{errors.description.message}</p>}
      </div>
      <div className="max-w-xs">
        <Input label={t('form.price')} type="number" min="0.01" step="0.01" inputMode="decimal" {...register('amount', { valueAsNumber: true })} error={errors.amount?.message} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{t('form.images')}</p>
        <ProductImageUploader value={images} onChange={(next) => setValue('images', next, { shouldDirty: true, shouldValidate: true })} onBusyChange={setImagesBusy} disabled={isPending} />
        {errors.images && <p className="text-xs font-medium text-destructive">{errors.images.message}</p>}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-foreground">{t('form.specifications')}</p>
          <Button type="button" variant="outline" size="sm" onClick={() => specifications.append({ key: '', value: '' })} disabled={isPending} icon={<Plus />}>{t('form.addSpecification')}</Button>
        </div>
        {specifications.fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
            <Input label={index === 0 ? t('form.specificationName') : undefined} {...register(`specifications.${index}.key`)} error={errors.specifications?.[index]?.key?.message} />
            <Input label={index === 0 ? t('form.specificationValue') : undefined} {...register(`specifications.${index}.value`)} error={errors.specifications?.[index]?.value?.message} />
            <Button type="button" variant="ghost" size="icon" aria-label={t('form.removeSpecification')} onClick={() => specifications.remove(index)} disabled={isPending} icon={<Trash2 />} />
          </div>
        ))}
      </div>
      <Button type="submit" disabled={isPending || imagesBusy}>{isPending ? (pendingLabel ?? t('form.creating')) : (submitLabel ?? t('form.submit'))}</Button>
    </form>
  )
}

import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { ProductCard } from '../components/ProductCard'
import { useProductList } from '../hooks/useProducts'
import { paths } from '@/config/paths'
import { useMemo, useState } from 'react'

type Sort = 'newest' | 'price-low' | 'price-high' | 'name'
const controlClassName = 'h-11 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export default function ProductCatalogPage({ detailPath }: { detailPath?: (slug: string) => string }) {
  const { t } = useTranslation('product')
  const { data, isPending, isError, refetch } = useProductList({ page: 1, limit: 24 })
  const [query, setQuery] = useState('')
  const [manufacturer, setManufacturer] = useState('')
  const [sort, setSort] = useState<Sort>('newest')
  const manufacturers = useMemo(() => [...new Set(data?.products.flatMap((product) => product.brand ? [product.brand] : []) ?? [])].sort((a, b) => a.localeCompare(b)), [data?.products])
  const products = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return (data?.products ?? []).filter((product) => {
      const searchable = [product.name, product.brand, product.description, ...Object.values(product.specifications)].filter(Boolean).join(' ').toLocaleLowerCase()
      return (!normalizedQuery || searchable.includes(normalizedQuery)) && (!manufacturer || product.brand === manufacturer)
    }).sort((a, b) => {
      if (sort === 'price-low') return a.rentalPricing.amount - b.rentalPricing.amount
      if (sort === 'price-high') return b.rentalPricing.amount - a.rentalPricing.amount
      if (sort === 'name') return a.name.localeCompare(b.name)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [data?.products, manufacturer, query, sort])

  return (
    <PageContainer width="wide" className="space-y-8 py-10">
      <PageHeader title={t('catalog.title')} description={t('catalog.description')} />
      {isPending && <p className="text-sm text-muted-foreground">{t('catalog.loading')}</p>}
      {isError && (
        <div className="space-y-3 rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">{t('catalog.loadFailed')}</p>
          <Button variant="outline" onClick={() => refetch()}>{t('catalog.tryAgain')}</Button>
        </div>
      )}
      {data && data.products.length > 0 && <section className="grid gap-3 rounded-xl border border-border bg-card p-4 lg:grid-cols-[minmax(0,1fr)_12rem_12rem]"><label className="grid gap-1.5 text-sm font-medium text-foreground">{t('catalog.search')}<input className={controlClassName} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('catalog.searchPlaceholder')} /></label><label className="grid gap-1.5 text-sm font-medium text-foreground">{t('catalog.manufacturer')}<select className={controlClassName} value={manufacturer} onChange={(event) => setManufacturer(event.target.value)}><option value="">{t('catalog.allManufacturers')}</option>{manufacturers.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="grid gap-1.5 text-sm font-medium text-foreground">{t('catalog.sort')}<select className={controlClassName} value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="newest">{t('catalog.sortNewest')}</option><option value="price-low">{t('catalog.sortPriceLow')}</option><option value="price-high">{t('catalog.sortPriceHigh')}</option><option value="name">{t('catalog.sortName')}</option></select></label></section>}
      {data && data.products.length === 0 && <p className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">{t('catalog.empty')}</p>}
      {data && data.products.length > 0 && (
        <><p className="text-sm text-muted-foreground">{t('catalog.results', { count: products.length })}</p>{products.length === 0 ? <p className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">{t('catalog.noMatches')}</p> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} detailPath={detailPath?.(product.slug) ?? paths.productDetail(product.slug)} />)}
        </div>
        }</>
      )}
    </PageContainer>
  )
}

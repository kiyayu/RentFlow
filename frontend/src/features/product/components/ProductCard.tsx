import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Product } from '../types/product.types'
import { Link } from 'react-router-dom'
import { paths } from '@/config/paths'
import { useTranslation } from '@/lib/i18n'

export function ProductCard({ product, detailPath = paths.productDetail(product.slug) }: { product: Product; detailPath?: string }) {
  const { t } = useTranslation('product')
  const price = new Intl.NumberFormat(undefined, { style: 'currency', currency: product.rentalPricing.currency, maximumFractionDigits: 2 }).format(product.rentalPricing.amount)

  return (
    <Card className="h-full">
      {product.images[0] ? (
        <img src={product.images[0]} alt={product.name} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="aspect-[4/3] bg-muted" />
      )}
      <CardHeader>
        {product.brand && <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>}
        <CardTitle><Link to={detailPath} className="hover:text-primary">{product.name}</Link></CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
        <p className="font-semibold text-foreground">{price}<span className="font-normal text-muted-foreground"> / {product.rentalPricing.billingUnit}</span></p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full"><Link to={detailPath}>{t('catalog.details')}</Link></Button>
      </CardFooter>
    </Card>
  )
}

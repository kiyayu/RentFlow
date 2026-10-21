import { Link, useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useProduct } from "../hooks/useProducts";
import { paths } from '@/config/paths'
import { sessionQueryOptions } from '@/features/auth'

export default function ProductDetailPage() {
  const { slug = "" } = useParams();
  const product = useProduct(slug);
  const { data: user } = useQuery(sessionQueryOptions)
  if (!product.data)
    return (
      <PageContainer>
        <p className="text-sm text-muted-foreground">Loading equipment...</p>
      </PageContainer>
    );
  return (
    <PageContainer width="wide" className="grid gap-8 py-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-border bg-muted aspect-[4/3]">
        {product.data.images[0] && (
          <img
            src={product.data.images[0]}
            alt={product.data.name}
            className="size-full object-cover"
          />
        )}
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">
            {product.data.brand}
          </p>
          <h1 className="text-3xl font-semibold text-foreground">
            {product.data.name}
          </h1>
          <p className="leading-7 text-muted-foreground">
            {product.data.description}
          </p>
        </div>
        <p className="text-xl font-semibold text-foreground">
          ETB {product.data.rentalPricing.amount.toLocaleString()}{" "}
          <span className="text-base font-normal text-muted-foreground">
            / day
          </span>
        </p>
        <Button asChild>
          <Link to={user ? paths.app.reserveEquipment(product.data.slug) : `${paths.login}?redirect=${encodeURIComponent(paths.app.reserveEquipment(product.data.slug))}`}>
            Reserve equipment
          </Link>
        </Button>
        <dl className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
          {Object.entries(product.data.specifications).map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs font-medium uppercase text-muted-foreground">
                {key}
              </dt>
              <dd className="text-sm text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PageContainer>
  );
}

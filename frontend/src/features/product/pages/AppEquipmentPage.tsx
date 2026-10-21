import { paths } from '@/config/paths'
import ProductCatalogPage from './ProductCatalogPage'

export default function AppEquipmentPage() {
  return <ProductCatalogPage detailPath={paths.app.equipmentDetail} />
}

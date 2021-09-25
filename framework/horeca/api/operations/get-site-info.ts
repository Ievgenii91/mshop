import { OperationContext } from '@commerce/api/operations'
import { normalizeCategory } from '@framework/lib/normalize'
import { HorecaCategory, Category } from '@framework/types/site'
import { routes } from '@framework/api/endpoints/catalog/products'
import { LocalConfig } from '../index'
import { HorecaProduct } from '@framework/types/product'

export type GetSiteInfoResult<
  T extends { categories: any[]; brands: any[] } = {
    categories: Category[]
    brands: any[]
  }
> = T

export default function getSiteInfoOperation({
  commerce,
}: OperationContext<any>) {
  async function getSiteInfo({
    query,
    variables,
    config,
  }: {
    query?: string
    variables?: any
    config?: Partial<LocalConfig>
    preview?: boolean
  } = {}): Promise<GetSiteInfoResult> {
    const cnf = commerce.getConfig(config)

    const { data } = await cnf.storeApiFetch(routes.categoriesApiRoute)
    const { data: products } = await cnf.storeApiFetch(
      routes.allProductsApiRoute
    )

    const categories = data.map((v: HorecaCategory) => normalizeCategory(v))
    const categoryIds = products
      .filter((v: HorecaProduct) => v.available && v.visible)
      .map((v: HorecaProduct) => v.category)

    return Promise.resolve({
      categories: categories.filter((v: Category) =>
        categoryIds.includes(v.id)
      ),
      brands: [],
    })
  }

  return getSiteInfo
}

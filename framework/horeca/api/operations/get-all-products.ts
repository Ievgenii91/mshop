import { Product } from '@commerce/types/product'
import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import type { LocalConfig } from '../index'
import { routes } from '../endpoints/catalog/products'
import { normalizeProduct } from 'framework/horeca/lib/normalize'
import { HorecaProduct } from 'framework/horeca/types/product'

export default function getAllProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables'] | any
    config?: Partial<LocalConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] | any[] }> {
    const cnf = commerce.getConfig(config)

    const { data } = await cnf.storeApiFetch(routes.allProductsApiRoute)
    const products = data.filter((v: HorecaProduct) => !!v.path && v.visible).filter((v: HorecaProduct, index: number) => {
      // TODO: implement correct filter
      if(variables?.first) {
        return index < variables?.first;
      }
      return true;
    }).map((product: HorecaProduct) =>
      normalizeProduct(product)
    )

    return {
      products,
    }
  }
  return getAllProducts
}

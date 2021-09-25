import type { LocalConfig } from '../index'
import { Product } from '@commerce/types/product'
import { GetProductOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'
import { routes } from '../endpoints/catalog/products'
import { normalizeProduct } from '@framework/lib/normalize'

export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getProduct<T extends GetProductOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<LocalConfig>
    preview?: boolean
  } = {}): Promise<Product | {} | any> {
    const cnf = commerce.getConfig(config)

    const { data } = await cnf.storeApiFetch(`${routes.productBySlug}/${variables?.slug}`)

    return {
      product: normalizeProduct(data),
    }
  }

  return getProduct
}

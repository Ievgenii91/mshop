import { OperationContext } from '@commerce/api/operations'
import { GetAllProductsOperation } from '@commerce/types/product'
import { LocalConfig } from '@framework/api'
import { HorecaProduct } from 'framework/horeca/types/product'
import { routes } from '../endpoints/catalog/products'

export type GetAllProductPathsResult = {
  products: Array<{ path: string }>
}

export default function getAllProductPathsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProductPaths<T extends GetAllProductsOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<LocalConfig>
    preview?: boolean
  } = {}): Promise<GetAllProductPathsResult> {
    const cnf = commerce.getConfig(config)
    const { data } = await cnf.storeApiFetch(routes.allProductsApiRoute)

    return {
      products: data
        .filter((v: Partial<HorecaProduct>) => !!v.path && v.visible)
        .map(({ path }: Partial<HorecaProduct>) => ({ path })),
    }
  }

  return getAllProductPaths
}

import { SWRHook } from '@commerce/utils/types'
import useSearch, { UseSearch } from '@commerce/product/use-search'
import type { SearchProductsHook } from '../types/product'

export default useSearch as UseSearch<typeof handler>

export type SearchProductsInput = {
  search?: string
  categoryId?: string
  sort?: string
  locale?: string
}

export const handler: SWRHook<SearchProductsHook> = {
  fetchOptions: {
    url: '/api/v1/products/search',
    method: 'GET',
  },
  fetcher({ input, options, fetch }) {
    const { categoryId, query } = input as any
    // Use a dummy base as we only care about the relative path
    const url = new URL(options.url!, process.env.NEXT_PUBLIC_API_URL)
    if (query) {
      for (let key in query) {
        url.searchParams.set(key, query[key])
      }
    }
    if (categoryId) url.searchParams.set('category', String(categoryId))
    url.searchParams.set('clientId', process.env.NEXT_PUBLIC_CLIENT_ID + '')
    return fetch({
      url: url.href,
      method: options.method,
    })
  },
  useHook:
    ({ useData }) =>
    (input = {}) => {
      return useData({
        input: [
          ['search', input.search],
          ['categoryId', input.categoryId],
          ['query', input.query],
        ],
        swrOptions: {
          revalidateOnFocus: false,
          ...input.swrOptions,
        },
      })
    },
}

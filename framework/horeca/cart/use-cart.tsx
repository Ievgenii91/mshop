import type { GetCartHook } from '@commerce/types/cart'
import { HookFetcherFn, SWRHook } from '@commerce/utils/types'
import { useHook, useSWRHook } from '@commerce/utils/use-hook'
import { useMemo } from 'react'
import { LocalProvider } from '..'

export type UseCart<
  H extends SWRHook<GetCartHook<any>> = SWRHook<GetCartHook>
> = ReturnType<H['useHook']>

const fn = (provider: LocalProvider) => provider.cart?.useCart!

export const fetcher: HookFetcherFn<GetCartHook> = async ({
  options,
  input: { cartId },
  fetch,
}) => {
  return cartId && cartId !== 'null'
    ? await fetch({ ...options, query: `&cartId=${cartId}` })
    : null
}

const useCart: UseCart = (input) => {
  const hook = useHook(fn)
  const fetcherFn = hook.fetcher ?? fetcher
  const wrapper: typeof fetcher = (context) => {
    context.input.cartId = globalThis.localStorage.getItem('bc_cartId') + ''
    return fetcherFn(context)
  }
  return useSWRHook({ ...hook, fetcher: wrapper })(input)
}

export default useCart

export const handler: SWRHook<GetCartHook> = {
  fetchOptions: {
    url: '/api/v1/cart',
    method: 'GET',
  },
  fetcher,
  useHook:
    ({ useData }) =>
    (input) => {
      const response = useData({
        swrOptions: { revalidateOnFocus: false, ...input?.swrOptions },
      })

      return useMemo(
        () =>
          Object.create(response, {
            isEmpty: {
              get() {
                return (response.data?.lineItems.length ?? 0) <= 0
              },
              enumerable: true,
            },
          }),
        [response]
      )
    },
}

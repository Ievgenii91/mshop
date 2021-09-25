import fetcher from '@framework/fetcher'

export default function useCheckout() {
  return async (body: any) => {
    return fetcher({
      url: '/api/v1/orders',
      method: 'POST',
      variables: null,
      body: {
        ...body,
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      },
    })
  }
}
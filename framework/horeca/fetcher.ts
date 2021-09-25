import type { Fetcher } from '@commerce/utils/types'
import { HorecaApiError } from './api/utils/errors'

async function getError(res: Response) {
  const data = await res.json()
  const [message] = data.message
  return new HorecaApiError(message, data)
}

const fetcher: Fetcher = async ({
  url,
  method = 'GET',
  variables,
  query,
  body: bodyObj,
}) => {
  const hasBody = Boolean(variables || bodyObj)
  const body = hasBody
    ? JSON.stringify(variables ? { variables } : bodyObj)
    : undefined
  const headers = hasBody ? { 'Content-Type': 'application/json' } : undefined

  const updatedUrl = new URL(url!, process.env.NEXT_PUBLIC_API_URL)
  updatedUrl.searchParams.set(
    'clientId',
    process.env.NEXT_PUBLIC_CLIENT_ID + ''
  )

  const res = await fetch(updatedUrl.href + (query || ''), {
    method,
    body,
    headers,
  })

  if (res.ok) {
    const { data } = await res.json()
    return data
  }

  throw await getError(res)
}

export default fetcher

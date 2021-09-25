import type { RequestInit, Response } from '@vercel/fetch'
import type { LocalConfig } from '../index'
import { HorecaApiError, HorecaNetworkError } from './errors'
import fetch from './fetch'

const fetchStoreApi =
  <T>(getConfig: () => LocalConfig) =>
  async (endpoint: string, options?: RequestInit): Promise<T> => {
    const config = getConfig()
    let res: Response

    try {
      res = await fetch(config.commerceUrl + endpoint, {
        ...options,
        headers: {
          ...options?.headers,
          'Content-Type': 'application/json',
          'X-Auth-Token': config.apiToken,
          'X-Auth-Client': config.clientId,
        },
      })
    } catch (error: any) {
      throw new HorecaNetworkError(
        `Fetch to Horeca failed: ${error.message}`
      )
    }

    const contentType = res.headers.get('Content-Type')
    const isJSON = contentType?.includes('application/json')

    if (!res.ok) {
      const data = isJSON ? await res.json() : await getTextOrNull(res)
      const headers = getRawHeaders(res)
      const msg = `Horeca API error (${
        res.status
      }) \nHeaders: ${JSON.stringify(headers, null, 2)}\n${
        typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }`

      throw new HorecaApiError(msg, res)
    }

    if (res.status !== 204 && !isJSON) {
      throw new HorecaApiError(
        `Fetch to Horeca API failed, expected JSON content but found: ${contentType}`,
        res
      )
    }

    // If something was removed, the response will be empty
    return res.status === 204 ? null : await res.json()
  }
export default fetchStoreApi

function getRawHeaders(res: Response) {
  const headers: { [key: string]: string } = {}

  res.headers.forEach((value, key) => {
    headers[key] = value
  })

  return headers
}

function getTextOrNull(res: Response) {
  try {
    return res.text()
  } catch (err) {
    return null
  }
}

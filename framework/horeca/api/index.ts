import type { RequestInit } from '@vercel/fetch'
import type { CommerceAPI, CommerceAPIConfig } from '@commerce/api'
import { getCommerceApi as commerceApi } from '@commerce/api'

import getAllPages from './operations/get-all-pages'
import getPage from './operations/get-page'
import getSiteInfo from './operations/get-site-info'
import getCustomerWishlist from './operations/get-customer-wishlist'
import getAllProductPaths from './operations/get-all-product-paths'
import getAllProducts from './operations/get-all-products'
import getProduct from './operations/get-product'
import { API_URL, AUTH_TOKEN, CLIENT_ID, API_TOKEN } from '../const'
import createFetchStoreApi from './utils/fetch-store-api'
import fetchGraphqlApi from './utils/fetch-local'

export interface LocalConfig extends CommerceAPIConfig {
  clientId: string;
  authToken: string;
  storeApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T>
}
const config: LocalConfig = {
  commerceUrl: API_URL as string,
  apiToken: API_TOKEN as string,
  authToken: AUTH_TOKEN as string,
  clientId: CLIENT_ID as string,
  cartCookie: '',
  customerCookie: '',
  cartCookieMaxAge: 2592000,
  storeApiFetch: createFetchStoreApi(() => getCommerceApi().getConfig()),
  fetch: fetchGraphqlApi(() => getCommerceApi().getConfig()),
}

const operations = {
  getAllPages,
  getPage,
  getSiteInfo,
  getCustomerWishlist,
  getAllProductPaths,
  getAllProducts,
  getProduct,
}

export const provider = { config, operations }

export type Provider = typeof provider
export type LocalAPI<P extends Provider = Provider> = CommerceAPI<P | any>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): LocalAPI<P> {
  return commerceApi(customProvider as any)
}

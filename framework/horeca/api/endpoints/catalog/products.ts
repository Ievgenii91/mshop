export default function noopApi(...args: any[]): void {}

export const routes = {
  allProductsApiRoute: 'products',
  searchProductsApiRoute: 'products/search',
  categoriesApiRoute: 'categories',
  productAvailableApiRoute: 'products/available',
  product: 'products',
  productBySlug: 'products/slug',
  cart: 'cart',
}

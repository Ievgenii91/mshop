export type Category = {
  id: string
  name: string
  slug: string
  path: string
  description: string
}

export type HorecaCategory = {
  entityId: number
  path: string
  children: HorecaCategory[]
  description: string
  imageUrl: string
  name: string
  clientId: string
  id: string;
  _id: string;
}

export type Brand = any

export type SiteTypes = {
  category: Category
  brand: Brand
}

export type GetSiteInfoOperation<T extends SiteTypes = SiteTypes> = {
  data: {
    categories: T['category'][]
    brands: T['brand'][]
  }
}

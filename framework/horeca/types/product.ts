import { HorecaImage } from './image'

export * from '@commerce/types/product'

export type HorecaProduct = {
  clientId: string
  id: string
  name: string
  description: string
  descriptionHTML: string
  count: number
  price: number
  total: number
  type: string
  action: string
  bonus: boolean
  available: boolean
  addedCrossSales: HorecaProduct[]
  crossSales: HorecaProduct[]
  usedForCrossSales: boolean
  rating: number
  order: number
  additionalText: string
  fancyName: string
  category: string
  subCategory: string
  images: HorecaImage[]
  slug: string
  path: string
  weight: number
  capacity: number
  tags: string;
  visible: boolean;
}

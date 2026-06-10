export type AdminProduct = {
  id: number
  name: string
  description: string | null
  price: number
  categoryId: number | null
  categoryName: string | null
}

export type AdminCategory = {
  id: number
  name: string
  productCount: number
}

export type CategoryOption = {
  id: number
  name: string
}

import { ApiResponse } from 'types/common/apiResponse'

export type ProductsResponse = ApiResponse<Products>
type Products = Product[]
type Product = {
  id: string
  title: string
  genre: string
  updatedAt: string
}

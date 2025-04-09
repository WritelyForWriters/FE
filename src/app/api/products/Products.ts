import AuthAxios from 'api/core/AuthInstance'
import { PlannerTemplatesResponse } from 'types/planner/plannerTemplatesResponse'
import { ProductsResponse } from 'types/products/productsResponse'

export const fetchProducts = async () => {
  const res = await AuthAxios.get<ProductsResponse>(`/products`)
  return res.data.result
}

export const fetchProductsTemplates = async (productId: string) => {
  const res = await AuthAxios.get<PlannerTemplatesResponse>(`/products/${productId}/templates`)
  return res.data.result
}

export const createProductsTemplates = async (
  productId: string,
  request: PlannerTemplatesResponse,
) => {
  const res = await AuthAxios.post(`/products/${productId}/templates`, { ...request })
  return res.data
}

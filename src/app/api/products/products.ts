import { default as AuthAxios, default as authInstance } from 'api/core/AuthInstance'
import { IdeaNotePresignedUrlRequest } from 'types/planner/ideaNotePresignedUrl'
import { PlannerTemplatesRequest } from 'types/planner/plannerTemplatesRequest'
import { PlannerTemplatesResponse } from 'types/planner/plannerTemplatesResponse'
import {
  ProductDetailResponseType,
  ProductIdResponseType,
  ProductListResponseType,
  SaveProductRequestType,
} from 'types/products'

// 작품 ID 생성
export const postProducts = async () => {
  const res = await authInstance.post<ProductIdResponseType>('/products')
  return res.data.result
}

// 작품 목록 조회
export const getProductList = async () => {
  const res = await authInstance.get<ProductListResponseType>('/products')
  return res.data.result
}

// 작품 저장
export const saveProduct = async ({ productId, product }: SaveProductRequestType) => {
  const res = await authInstance.post(`/products/${productId}`, product)
  return res.data.result as string
}

export const getProductDetail = async (productId: string) => {
  const res = await authInstance.get<ProductDetailResponseType>(`/products/${productId}`)
  return res.data.result
}

export const fetchProductsTemplates = async (productId: string) => {
  const res = await AuthAxios.get<PlannerTemplatesResponse>(`/products/${productId}/templates`)
  return res.data.result
}

export const createProductsTemplates = async (
  productId: string,
  request: PlannerTemplatesRequest,
) => {
  const res = await AuthAxios.post(`/products/${productId}/templates`, { ...request })
  return res.data
}

export const createFilesPresignedUrl = async (request: IdeaNotePresignedUrlRequest) => {
  const res = await AuthAxios.post(`/files/presigned-url`, { ...request })
  return res.data
}

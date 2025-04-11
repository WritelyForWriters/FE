import authInstance from 'api/core/AuthInstance'
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

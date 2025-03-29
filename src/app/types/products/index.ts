import { ApiResponse } from 'types/common/apiResponse'

import { ProductDetailDto, ProductDto } from './productsDto'

export * from './productsDto'

export type ProductIdResponseType = ApiResponse<string>
export type ProductListResponseType = ApiResponse<ProductDto[]>
export type ProductDetailResponseType = ApiResponse<ProductDetailDto>

// 작품 저장 데이터 타입
export interface SaveProductDataType {
  title?: string
  content?: string
  isAutoSave: boolean
}

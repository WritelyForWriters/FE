import { ApiResponse } from 'types/common/apiResponse'

import { ProductDto } from './productsDto'

export * from './productsDto'

export type ProductIdResponseType = ApiResponse<string>
export type ProductListResponseType = ApiResponse<ProductDto[]>

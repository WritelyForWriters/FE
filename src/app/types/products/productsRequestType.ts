export * from './productsResponseType'

// 작품 저장 데이터 타입
export interface SaveProductValues {
  title?: string
  content?: string
  isAutoSave: boolean
}

export interface SaveProductRequestType {
  productId: string
  product: SaveProductValues
}

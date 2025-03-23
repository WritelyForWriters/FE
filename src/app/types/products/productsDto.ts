// TODO(Sohyun): Response code, message 공통 DTO만들기 (리팩토링) 및 code 종류
export interface ProductIdDto {
  code: string
  message: string
  result: string
}

export interface ProductType {
  id: string
  title: string | null
  genre: string | null
  updatedAt: string
}

export interface ProductListDto {
  code: string
  message: string
  result: ProductType[]
}

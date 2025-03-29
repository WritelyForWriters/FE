export interface ProductDto {
  id: string
  title: string | null
  genre: string | null
  updatedAt: string
}

interface MemoDto {
  id: string
  content: string
}

export type ProductDetailDto = Omit<ProductDto, 'genre'> & {
  content: string
  memos: MemoDto[] // TODO: 메모 type 리팩토링
}

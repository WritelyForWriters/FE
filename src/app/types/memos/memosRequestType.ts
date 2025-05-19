import { MemosDto } from './memosResponseType'

export interface SavedMemosRequestType {
  productId: string
  data: MemosValues
}

export type UpdateMemosCompletedRequestType = {
  productId: string
  memoId: string
  data: Pick<MemosDto, 'isCompleted'>
}

export interface MemosValues {
  title?: string
  content: string
  selectedText: string
  startIndex: number
  endIndex: number
}

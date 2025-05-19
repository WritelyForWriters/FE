export interface SavedMemosRequestType {
  productId: string
  data: MemosValues
}

export interface MemosValues {
  title?: string
  content: string
  selectedText: string
  startIndex: number
  endIndex: number
}

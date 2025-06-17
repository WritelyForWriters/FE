import { ApiResponse } from 'types/common/apiResponse'

export type MemoList = ApiResponse<MemosDto[]>

export interface MemosDto {
  id: string
  title: string
  content: string
  selectedText: string
  startIndex: number
  endIndex: number
  isCompleted: boolean
  updatedAt: string
}

export type CreateMemosResponse = ApiResponse<string>

import authInstance from 'api/core/AuthInstance'
import {
  CreateMemosResponse,
  MemoList,
  SavedMemosRequestType,
  UpdateMemosCompletedRequestType,
  UpdateMemosRequestType,
} from 'types/memos'

// 메모 생성
export const createMemos = async ({ productId, data }: SavedMemosRequestType) => {
  const res = await authInstance.post<CreateMemosResponse>(`/products/${productId}/memos`, data)
  return res.data.result
}

// 메모 목록 조회
export const getMemoList = async (productId: string) => {
  const res = await authInstance.get<MemoList>(`/products/${productId}/memos`)
  return res.data.result
}

// 메모 완료 여부 수정
export const updateMemosCompleted = async ({
  productId,
  memoId,
  data,
}: UpdateMemosCompletedRequestType) => {
  const res = await authInstance.put(`/products/${productId}/memos/${memoId}/completed`, data)
  return res.data.result
}

// 메모 삭제
export const deleteMemosById = async ({ productId, memoId }: UpdateMemosCompletedRequestType) => {
  await authInstance.delete(`/products/${productId}/memos/${memoId}`)
}

// 메모 수정
export const updateMemos = async ({ productId, memoId, data }: UpdateMemosRequestType) => {
  const res = await authInstance.put(`/products/${productId}/memos/${memoId}`, data)
  return res.data.result
}

import authInstance from 'api/core/AuthInstance'
import { SavedMemosRequestType } from 'types/memos'
import { MemoList } from 'types/memos/memosResponseType'

// 메모 생성
export const createMemos = async ({ productId, data }: SavedMemosRequestType) => {
  const res = await authInstance.post(`/products/${productId}/memos`, data)
  return res.data.result
}

// 메모 목록 조회
export const getMemoList = async (productId: string) => {
  const res = await authInstance.get<MemoList>(`/products/${productId}/memos`)
  return res.data.result
}

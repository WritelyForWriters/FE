import authInstance from 'api/core/AuthInstance'
import { MemosValues } from 'types/memos'

// 메모 생성
export const createMemos = async (productId: string, data: MemosValues) => {
  const res = await authInstance.post(`/products/${productId}/memos`, data)
  return res.data.result
}

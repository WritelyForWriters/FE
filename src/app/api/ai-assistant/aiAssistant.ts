import { default as authInstance } from 'api/core/AuthInstance'

interface PromptData {
  productId: string
  content: string
  prompt: string
}

// 수동 수정
export const postUserModify = async (promptData: PromptData) => {
  const res = await authInstance.post('/assistant/user-modify', promptData)
  return res.data.result
}

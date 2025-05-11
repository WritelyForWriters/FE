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

interface FeedbackResult {
  result: {
    id: string
    answer: string
  }
}

// 구간 피드백
export const postFeedback = async (promptData: Omit<PromptData, 'prompt'>) => {
  const res = await authInstance.post<FeedbackResult>('/assistant/feedback', promptData)
  return res.data.result
}

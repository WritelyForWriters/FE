import { default as authInstance } from 'api/core/AuthInstance'

interface PromptData {
  productId: string
  content: string
  prompt: string
  shouldApplySetting?: boolean
}

// 자동 수정
export const postAutoModify = async (promptData: Omit<PromptData, 'prompt'>) => {
  const res = await authInstance.post('/assistant/auto-modify', promptData)
  return res.data.result
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

// 어시스턴트 답변 영구 보관
export const archivedAnswer = async (assistantId: string) => {
  const res = await authInstance.put(`/assistant/${assistantId}/archive`)
  return res.data.result
}

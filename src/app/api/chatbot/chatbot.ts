import authInstance from 'api/core/AuthInstance'
import { ChatbotFormData, ChatbotWebSearchFormData, FeedbackFormData } from 'types/chatbot/chatbot'

// AI 어시스턴트 사용 내역 조회
// TODO
// [ ] 무한 스크롤 구현
export const getAssistantHistory = async (productId: string) => {
  const res = await authInstance.get(`/assistant/histories?productId=${productId}`)

  return res.data
}

// 즐겨찾는 프롬프트 조회
export const getFavoritePrompts = async (productId: string) => {
  const res = await authInstance.get(`/products/${productId}/favorite-prompts`)

  return res.data
}

// 프롬프트 즐겨찾기 추가
export const addFavoriteMessage = async ({
  productId,
  assistantId,
}: {
  productId: string
  assistantId: string
}) => {
  await authInstance.post(`/products/${productId}/favorite-prompts/${assistantId}`)
}

// 프롬프트 즐겨찾기 삭제
export const removeFavoriteMessage = async ({
  productId,
  messageId,
}: {
  productId: string
  messageId: string
}) => {
  await authInstance.delete(`/products/${productId}/favorite-prompts/${messageId}`)
}

// 고정 메시지 조회
export const getFixedMessage = async (productId: string) => {
  const res = await authInstance.get(`/products/${productId}/fixed-messages`)

  return res.data
}

// 고정 메시지 설정
export const pinMessage = async ({
  productId,
  assistantId,
}: {
  productId: string
  assistantId: string
}) => {
  await authInstance.post(`/products/${productId}/fixed-messages/${assistantId}`)
}

// 고정 메시지 해제
export const unPinMessage = async (productId: string) => {
  await authInstance.delete(`/products/${productId}/fixed-messages`)
}

// 응답 평가
export const submitFeedback = async ({
  assistantId,
  formData,
}: {
  assistantId: string
  formData: FeedbackFormData
}) => {
  await authInstance.post(`/assistant/${assistantId}/evaluate`, formData)
}

// 자유 대화 메시지 전송
export const submitDefaultChatMessage = async (formData: ChatbotFormData) => {
  const res = await authInstance.post('/assistant/chat/messages', formData)

  const { assistantId } = res.data.result

  // TODO: sessionId에 대해 논의 필요
  await authInstance.get(`/assistant/chat/stream?assistantId=${assistantId}&sessionId=1`)
}

// 자유 대화 메시지 전송(웹 검색 모드)
export const submitWebSearchChatMessage = async (formData: ChatbotWebSearchFormData) => {
  await authInstance.post('/assistant/chat/research', formData)
}

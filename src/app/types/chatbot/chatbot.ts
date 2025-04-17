export interface ChatbotFormData {
  productId: string
  content: string
  prompt: string
}

export type MemberMessageType = 'auto modify' | 'user modify' | 'feedback' | 'chat'

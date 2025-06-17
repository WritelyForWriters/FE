export interface ChatbotFormData {
  productId: string
  content: string
  prompt: string
  shouldApplySetting: boolean
  sessionId: string
}

export type MemberMessageType = 'auto modify' | 'user modify' | 'feedback' | 'chat'

export interface ChatItem {
  id: string
  type: MemberMessageType
  memberMessage: {
    id: string
    content: string
    prompt: string | null
    isFavoritedPrompt: boolean
  }
  assistantMessage: {
    id: string
    content: string
    isApplied: boolean
    isGood: boolean
  }
  createdAt: string
}

export interface RecommendPrompt {
  prompt: string
  requiresSection: boolean
}

export type FeedbackOptionType =
  | 'AWKWARD_SENTENCE'
  | 'INACCURATE_INFO'
  | 'UNAPPLIED_SETTING'
  | 'ETC'

export interface FeedbackFormData {
  isGood: boolean
  feedbackType?: FeedbackOptionType
  feedback?: string
}

import { RecommendPrompt } from 'types/chatbot/chatbot'

export const RECOMMEND_PROMPTS: RecommendPrompt[] = [
  {
    prompt: '문장을 나눠줘',
    requiresSection: true,
  },
  {
    prompt: '더 자세히 써줘',
    requiresSection: true,
  },
  {
    prompt: '더 간결히 써줘',
    requiresSection: true,
  },
  {
    prompt: '더 ~하게 써줘',
    requiresSection: true,
  },
  {
    prompt: '맞춤법을 수정해줘',
    requiresSection: true,
  },
  {
    prompt: '유의어를 알려줘',
    requiresSection: true,
  },
  {
    prompt: '다음 장면에 대한 아이디어를 줘',
    requiresSection: false,
  },
]

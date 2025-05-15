import { useQuery } from '@tanstack/react-query'
import { getAssistantHistory } from 'api/chatbot/chatbot'
import { QUERY_KEY } from 'constants/common/queryKeys'

export const useGetAssistantHistory = (productId: string, assistantId?: string, size?: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.ASSISTANT_HISTORY, productId, assistantId, size],
    queryFn: () => getAssistantHistory(productId, assistantId, size),
  })
}

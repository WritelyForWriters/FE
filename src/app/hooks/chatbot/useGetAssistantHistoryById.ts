import { useQuery } from '@tanstack/react-query'
import { getAssistantHistoryById } from 'api/chatbot/chatbot'
import { QUERY_KEY } from 'constants/common/queryKeys'

export const useGetAssistantHistoryById = (productId: string, assistantId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.ASSISTANT_HISTORY_LATEST, productId, assistantId],
    queryFn: () => getAssistantHistoryById(productId, assistantId),
  })
}

import { useQuery } from '@tanstack/react-query'
import { getAssistantHistory } from 'api/chatbot/chatbot'
import { QUERY_KEY } from 'constants/common/queryKeys'

export const useGetAssistantHistory = (productId: string) => {
  return useQuery({
    queryKey: QUERY_KEY.ASSISTANT_HISTORY(productId),
    queryFn: () => getAssistantHistory(productId),
  })
}

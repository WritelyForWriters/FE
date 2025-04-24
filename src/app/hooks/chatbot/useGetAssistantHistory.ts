import { useQuery } from '@tanstack/react-query'
import { getAssistantHistory } from 'api/chatbot/chatbot'

export const useGetAssistantHistory = (productId: string) => {
  return useQuery({
    queryKey: ['assistant-history', productId],
    queryFn: () => getAssistantHistory(productId),
  })
}

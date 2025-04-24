import { useQuery } from '@tanstack/react-query'
import { getFixedMessage } from 'api/chatbot/chatbot'

export const useGetFixedMessage = (productId: string) => {
  return useQuery({
    queryKey: ['fixed-message', productId],
    queryFn: () => getFixedMessage(productId),
  })
}

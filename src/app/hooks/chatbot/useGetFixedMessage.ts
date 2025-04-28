import { useQuery } from '@tanstack/react-query'
import { getFixedMessage } from 'api/chatbot/chatbot'
import { QUERY_KEY } from 'constants/common/queryKeys'

export const useGetFixedMessage = (productId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.FIXED_MESSAGE, productId],
    queryFn: () => getFixedMessage(productId),
  })
}

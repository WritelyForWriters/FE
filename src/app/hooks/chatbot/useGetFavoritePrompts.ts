import { useQuery } from '@tanstack/react-query'
import { getFavoritePrompts } from 'api/chatbot/chatbot'
import { QUERY_KEY } from 'constants/common/queryKeys'

export const useGetFavoritePrompts = (productId: string) => {
  return useQuery({
    queryKey: QUERY_KEY.FAVORITE_PROMPTS(productId),
    queryFn: () => getFavoritePrompts(productId),
  })
}

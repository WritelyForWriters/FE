import { useQuery } from '@tanstack/react-query'
import { getFavoritePrompts } from 'api/chatbot/chatbot'

export const useGetFavoritePrompts = (productId: string) => {
  return useQuery({
    queryKey: ['favorite-prompts', productId],
    queryFn: () => getFavoritePrompts(productId),
  })
}

import { useMutation } from '@tanstack/react-query'
import { removeFavoriteMessage } from 'api/chatbot/chatbot'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const useRemoveFavoriteMessage = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: removeFavoriteMessage,
    ...mutationOptions,
  })
}

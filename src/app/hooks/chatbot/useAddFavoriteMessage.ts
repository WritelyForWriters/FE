import { useMutation } from '@tanstack/react-query'
import { addFavoriteMessage } from 'api/chatbot/chatbot'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const useAddFavoriteMessage = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: addFavoriteMessage,
    ...mutationOptions,
  })
}

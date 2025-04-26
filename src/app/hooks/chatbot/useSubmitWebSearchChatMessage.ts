import { useMutation } from '@tanstack/react-query'
import { submitWebSearchChatMessage } from 'api/chatbot/chatbot'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const useSubmitWebSearchChatMessage = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: submitWebSearchChatMessage,
    ...mutationOptions,
  })
}

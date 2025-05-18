import { useMutation } from '@tanstack/react-query'
import { submitDefaultChatMessage } from 'api/chatbot/chatbot'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const useSubmitDefaultChatMessage = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: submitDefaultChatMessage,
    ...mutationOptions,
  })
}

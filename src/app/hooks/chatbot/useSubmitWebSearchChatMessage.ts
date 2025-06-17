import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { submitWebSearchChatMessage } from 'api/chatbot/chatbot'

type MessagePayload = {
  prompt: string
  content?: string
}

export const useSubmitWebSearchChatMessage = (
  options?: UseMutationOptions<string, unknown, MessagePayload>,
) => {
  return useMutation({
    mutationFn: submitWebSearchChatMessage,
    ...options,
  })
}

import { UseMutationOptions, useMutation } from '@tanstack/react-query'
import { submitDefaultChatMessage } from 'api/chatbot/chatbot'

type MessagePayload = {
  prompt: string
  content?: string
}

export const useSubmitDefaultChatMessage = (
  options?: UseMutationOptions<string, unknown, MessagePayload>,
) => {
  return useMutation({
    mutationFn: submitDefaultChatMessage,
    ...options,
  })
}

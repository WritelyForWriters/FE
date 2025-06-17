import { useMutation } from '@tanstack/react-query'
import { submitFeedback } from 'api/chatbot/chatbot'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const useSubmitFeedback = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: submitFeedback,
    ...mutationOptions,
  })
}

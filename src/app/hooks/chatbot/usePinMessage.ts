import { useMutation } from '@tanstack/react-query'
import { pinMessage } from 'api/chatbot/chatbot'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const usePinMessage = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: pinMessage,
    ...mutationOptions,
  })
}

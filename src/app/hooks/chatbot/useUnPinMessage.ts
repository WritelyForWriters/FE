import { useMutation } from '@tanstack/react-query'
import { unPinMessage } from 'api/chatbot/chatbot'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const useUnPinMessage = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: unPinMessage,
    ...mutationOptions,
  })
}

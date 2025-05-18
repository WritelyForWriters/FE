import { useMutation } from '@tanstack/react-query'
import { createMemos } from 'api/memos/memos'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const useSavedMemos = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: createMemos,
    ...mutationOptions,
  })
}

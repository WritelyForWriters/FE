import { useMutation } from '@tanstack/react-query'
import { createMemos, deleteMemosById, updateMemosCompleted } from 'api/memos/memos'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const useSavedMemos = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: createMemos,
    ...mutationOptions,
  })
}

export const useUpdateMemosCompleted = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: updateMemosCompleted,
    ...mutationOptions,
  })
}

export const useDeleteMemosById = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: deleteMemosById,
    ...mutationOptions,
  })
}

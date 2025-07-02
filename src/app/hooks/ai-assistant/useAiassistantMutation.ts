import { useMutation } from '@tanstack/react-query'
import { postFeedback, postPlannerUserModify, postUserModify } from 'api/ai-assistant/aiAssistant'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'

export const usePostUserModify = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: postUserModify,
    ...mutationOptions,
  })
}

export const usePostPlannerUserModify = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: postPlannerUserModify,
    ...mutationOptions,
  })
}

export const usePostFeedback = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: postFeedback,
    ...mutationOptions,
  })
}

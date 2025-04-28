import { useMutation } from '@tanstack/react-query'
import { createFilesPresignedUrl } from 'api/products/products'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'
import { IdeaNotePresignedUrlRequest } from 'types/planner/ideaNotePresignedUrl'

export const useCreateFilesPresignedUrl = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: ({ request }: { request: IdeaNotePresignedUrlRequest }) =>
      createFilesPresignedUrl(request),
    ...mutationOptions,
  })
}

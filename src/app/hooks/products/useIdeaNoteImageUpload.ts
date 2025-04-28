import { useMutation } from '@tanstack/react-query'
import { createFilesPresignedUrl, updateIdeaNoteImage } from 'api/products/products'
import { UseMutationCustomOptions } from 'types/common/reactQueryCustomOption'
import {
  IdeaNotePresignedUrlRequest,
  IdeaNotePresignedUrlResponse,
} from 'types/planner/ideaNotePresignedUrl'

export const useCreateFilesPresignedUrl = (mutationOptions?: UseMutationCustomOptions) => {
  return useMutation({
    mutationFn: async ({ request, file }: { request: IdeaNotePresignedUrlRequest; file: File }) => {
      const res: IdeaNotePresignedUrlResponse = await createFilesPresignedUrl(request)
      await updateIdeaNoteImage(res.result.filePutUrl, file)
      return res.result.fileGetUrl
    },
    ...mutationOptions,
  })
}

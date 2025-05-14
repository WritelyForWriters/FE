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
      /* NOTE(hajae)
       * 이미지 업로드 순서
       * 1. 이미지 붙여넣기 || 이미지 첨부
       * 2. POST files/presigned-url 요청
       * 3. (files/presigned-url 요청의) response.filePutUrl로 이미지 PUT (서버에 저장)
       * 4. response.fileGetUrl로 이미지 표시 (예시. <img src={fileGetUrl} ...>)
       */
      const res: IdeaNotePresignedUrlResponse = await createFilesPresignedUrl(request)
      await updateIdeaNoteImage(res.result.filePutUrl, file)
      return res.result.fileGetUrl
    },
    ...mutationOptions,
  })
}

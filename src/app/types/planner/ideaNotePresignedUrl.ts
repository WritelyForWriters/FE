import { ApiResponse } from 'types/common/apiResponse'

export type IdeaNotePresignedUrlResponse = ApiResponse<IdeaNotePresignedUrl>
export type IdeaNotePresignedUrl = {
  filePutUrl: string
  fileGetUrl: string
}

export type IdeaNotePresignedUrlRequest = {
  fileUploadType: 'idea-note'
  originalFileName: string
  contentType: 'image/png'
  contentLength: number
}

export const IdeaNotePresignedUrlRequest = {
  from: (name: string, contentLength: number): IdeaNotePresignedUrlRequest => {
    return {
      fileUploadType: 'idea-note',
      originalFileName: name,
      contentType: 'image/png',
      contentLength: contentLength,
    }
  },
}

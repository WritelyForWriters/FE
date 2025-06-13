import { ApiResponse } from 'types/common/apiResponse'

interface CommonAiResultType {
  id: string
  answer: string
}

export type AiassistantResponseType = ApiResponse<CommonAiResultType>

import { ApiResponse } from 'types/common/apiResponse'

import { ProfileDto } from './membersDto'

export * from './membersDto'

export type ProfileResponseType = ApiResponse<ProfileDto>

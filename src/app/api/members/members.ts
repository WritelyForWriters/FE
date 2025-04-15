import authInstance from 'api/core/AuthInstance'
import { ProfileResponseType } from 'types/members'

export const getMeProfile = async () => {
  const res = await authInstance.get<ProfileResponseType>('/members/me/profile')
  return res.data.result
}

import { useQuery } from '@tanstack/react-query'
import { getMeProfile } from 'api/members/members'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { getCookie } from 'cookies-next/client'
import { UseQueryCustomOptions } from 'types/common/reactQueryCustomOption'
import { ProfileDto } from 'types/members'

export const useGetMeProfile = (queryOptions?: UseQueryCustomOptions<ProfileDto>) => {
  return useQuery({
    queryKey: [QUERY_KEY.ME_PROFILE],
    queryFn: getMeProfile,
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!getCookie('isLoggedIn'),
    ...queryOptions,
  })
}

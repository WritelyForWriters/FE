import { useMutation } from '@tanstack/react-query'
import { refreshAccessToken } from 'api/auth/Auth'
import axios from 'axios'
import { deleteCookie } from 'cookies-next'
import { useSetAtom } from 'jotai'
import { accessTokenAtom } from 'store/accessTokenAtom'

interface UseRefreshProps {
  onSuccessHandler?: () => void
  onErrorHandler: () => void
}

export const useRefresh = ({ onSuccessHandler, onErrorHandler }: UseRefreshProps) => {
  const setAccessToken = useSetAtom(accessTokenAtom)

  return useMutation({
    mutationFn: refreshAccessToken,
    onSuccess: (accessToken) => {
      setAccessToken(accessToken)
      if (onSuccessHandler) {
        onSuccessHandler()
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        deleteCookie('isLoggedIn')
        deleteCookie('refreshToken')
        deleteCookie('isRememberMe')
      }
      onErrorHandler()
    },
  })
}

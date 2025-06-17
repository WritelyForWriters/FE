import { useMutation } from '@tanstack/react-query'
import { refreshAccessToken } from 'api/auth/Auth'
import axios from 'axios'
import { deleteCookie } from 'cookies-next'

interface UseRefreshProps {
  onSuccessHandler?: () => void
  onErrorHandler: () => void
}

export const useRefresh = ({ onSuccessHandler, onErrorHandler }: UseRefreshProps) => {
  return useMutation({
    mutationFn: refreshAccessToken,
    onSuccess: () => {
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

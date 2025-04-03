import { useMutation } from '@tanstack/react-query'
import { login } from 'api/auth/Auth'
import axios from 'axios'
import { NUMERICS } from 'constants/common/numberValue'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { setCookie } from 'cookies-next'
import { useSetAtom } from 'jotai'
import { accessTokenAtom } from 'store/accessTokenAtom'

import { useToast } from '@components/toast/ToastProvider'

interface UseLoginProps {
  onSuccessHandler: () => void
}

export const useLogin = ({ onSuccessHandler }: UseLoginProps) => {
  const showToast = useToast()

  const setAccessToken = useSetAtom(accessTokenAtom)

  return useMutation({
    mutationFn: login,
    onSuccess: (data, { isRememberMe }) => {
      const date = new Date()
      date.setTime(date.getTime() + NUMERICS.COOKIE_EXPIRE)

      setAccessToken(data.result.accessToken! as string)

      if (isRememberMe) {
        setCookie('isRememberMe', true, { expires: date, path: '/' })
      }

      setCookie('isLoggedIn', true, isRememberMe ? { expires: date, path: '/' } : {})

      onSuccessHandler()
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const { code, status, response } = error

        if (code === 'ERR_NETWORK') {
          showToast('warning', TOAST_MESSAGE.NETWORK_ERROR)
        }

        if (status === 401) {
          showToast('warning', response?.data.message)
        }
      }
    },
  })
}

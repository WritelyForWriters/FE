import { useMutation } from '@tanstack/react-query'
import { login } from 'api/auth/Auth'
import { NUMERICS } from 'constants/common/numberValue'
import { setCookie } from 'cookies-next'
import { useSetAtom } from 'jotai'
import { accessTokenAtom } from 'store/accessTokenAtom'

import { useToast } from '@components/toast/ToastProvider'

import { handleAxiosError } from '@utils/handleAxiosError'

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
      handleAxiosError(error, showToast)
    },
  })
}

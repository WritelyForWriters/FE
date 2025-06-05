import { useMutation } from '@tanstack/react-query'
import { login } from 'api/auth/Auth'
import { NUMERICS } from 'constants/common/numberValue'
import { setCookie } from 'cookies-next/client'
import { useSetAtom } from 'jotai'
import { trackEvent } from 'lib/amplitude'
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
    onSuccess: (data, { email, isRememberMe }) => {
      const date = new Date()
      date.setTime(date.getTime() + NUMERICS.COOKIE_EXPIRE)

      setAccessToken(data.result.accessToken! as string)

      if (isRememberMe) {
        setCookie('isRememberMe', true, { expires: date, path: '/' })
      }

      setCookie('isLoggedIn', true, isRememberMe ? { expires: date, path: '/' } : {})
      trackEvent('login_complete', {
        user_id: email,
      })

      onSuccessHandler()
    },
    onError: (error) => {
      handleAxiosError(error, showToast)
    },
  })
}

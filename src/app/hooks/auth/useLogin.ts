import { useMutation } from '@tanstack/react-query'
import { login } from 'api/auth/Auth'
import { NUMERICS } from 'constants/common/numberValue'
import { setCookie } from 'cookies-next/client'
import { useSetAtom } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { accessTokenAtom } from 'store/accessTokenAtom'
import { isCompleteJoinAtom } from 'store/isCompleteJoinAtom'
import { isFirstLoginAtom } from 'store/isFirstLoginAtom'
import { isLoggedInAtom } from 'store/isLoggedInAtom'

import { useToast } from '@components/toast/ToastProvider'

import { handleAxiosError } from '@utils/handleAxiosError'

interface UseLoginProps {
  onSuccessHandler: () => void
}

export const useLogin = ({ onSuccessHandler }: UseLoginProps) => {
  const showToast = useToast()

  const setAccessToken = useSetAtom(accessTokenAtom)
  const setIsLoggedIn = useSetAtom(isLoggedInAtom)
  const setIsCompleteJoin = useSetAtom(isCompleteJoinAtom)
  const setIsFirstLogin = useSetAtom(isFirstLoginAtom)

  return useMutation({
    mutationFn: login,
    onSuccess: (data, { email, isRememberMe }) => {
      const date = new Date()
      date.setTime(date.getTime() + NUMERICS.COOKIE_EXPIRE)

      setIsLoggedIn(true)
      setAccessToken(data.result.accessToken! as string)
      setIsCompleteJoin(false)

      if (isRememberMe) {
        setCookie('isRememberMe', true, { expires: date, path: '/', sameSite: 'lax', secure: true })
      }

      setCookie('isLoggedIn', true, {
        path: '/',
        ...(isRememberMe && { expires: date }),
        sameSite: 'lax',
        secure: true,
      })
      trackEvent('login_complete', {
        user_id: email,
      })

      setIsFirstLogin(!data.result.previousTokenIssuedAt)

      onSuccessHandler()
    },
    onError: (error) => {
      handleAxiosError(error, showToast)
    },
  })
}

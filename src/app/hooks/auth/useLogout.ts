import { useRouter } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'
import { logout } from 'api/auth/Auth'
import { deleteCookie } from 'cookies-next/client'
import { useAtom, useSetAtom } from 'jotai'
import { accessTokenAtom } from 'store/accessTokenAtom'
import { isLoggedInAtom } from 'store/isLoggedInAtom'

export const useLogout = () => {
  const router = useRouter()

  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)
  const setIsLoggedIn = useSetAtom(isLoggedInAtom)

  return useMutation({
    mutationFn: () => logout(accessToken as string),
    onSuccess: () => {
      deleteCookie('isLoggedIn')
      deleteCookie('isRememberMe')
      setIsLoggedIn(false)
      setAccessToken(null)

      router.replace('/login')
    },
    onError: (error) => {
      console.log(error)
    },
  })
}

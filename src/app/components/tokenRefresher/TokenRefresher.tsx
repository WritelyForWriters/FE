'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useState } from 'react'

import { refreshAccessToken } from '(before-login)/login/services/loginService'
import { NUMERICS } from 'constants/common/numberValue'
import { deleteCookie, setCookie } from 'cookies-next'
import { useAtom, useAtomValue } from 'jotai'
import { accessTokenAtom } from 'store/accessTokenAtom'
import { isLoggedInAtom } from 'store/isLoggedInAtom'
import { isRemberMeAtom } from 'store/isRemberMeAtom'

interface TokenRefresherProps {
  children: ReactNode
}

export default function TokenRefresher({ children }: TokenRefresherProps) {
  const router = useRouter()

  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom)
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)
  const isRemberMe = useAtomValue(isRemberMeAtom)

  const [isLoading, setIsLoading] = useState(isLoggedIn && !accessToken)

  useEffect(() => {
    if (!isLoading) {
      return
    }

    // 로그인한 경우에만 리프레시 요청
    const refresh = async () => {
      try {
        const result = await refreshAccessToken()

        setAccessToken(result.accessToken)
        setIsLoggedIn(true)

        const date = new Date()
        date.setTime(date.getTime() + NUMERICS.COOKIE_EXPIRE)

        setCookie('isLoggedIn', true, isRemberMe ? { expires: date, path: '/' } : {})
      } catch {
        deleteCookie('isLoggedIn')
        deleteCookie('refreshToken')
        deleteCookie('isRememberMe')
        router.replace('/login')
      } finally {
        setIsLoading(false)
      }
    }

    refresh()
  }, [isLoading, accessToken, router, setAccessToken, setIsLoggedIn, isRemberMe])

  if (isLoading) {
    return <></>
  }

  return <>{children}</>
}

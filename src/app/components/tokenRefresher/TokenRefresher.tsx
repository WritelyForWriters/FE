'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useState } from 'react'

import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { useAtom, useAtomValue } from 'jotai'
import { refreshAccessToken } from 'service/auth/auth'
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
        // API 수정 후 RT 관련 코드 삭제
        const refreshToken = (await getCookie('refreshToken')!) as string

        const result = await refreshAccessToken(refreshToken)

        setAccessToken(result.accessToken)
        setIsLoggedIn(true)

        // TODO: 영구 쿠키 expire 의사 결정 필요
        const date = new Date()
        date.setTime(date.getTime() + 60 * 60 * 1000)

        setCookie(
          'refreshToken',
          result.refreshToken,
          isRemberMe ? { expires: date, path: '/' } : {},
        )
        setCookie('isLoggedIn', true, isRemberMe ? { expires: date, path: '/' } : {})
      } catch {
        deleteCookie('isLoggedIn')
        deleteCookie('refreshToken')
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

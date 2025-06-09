'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useState } from 'react'

import { useAtom, useAtomValue } from 'jotai'
import { accessTokenAtom } from 'store/accessTokenAtom'
import { isLoggedInAtom } from 'store/isLoggedInAtom'

import { useRefresh } from '@hooks/index'

interface TokenRefresherProps {
  children: ReactNode
}
export default function TokenRefresher({ children }: TokenRefresherProps) {
  const router = useRouter()
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)

  const [isLoading, setIsLoading] = useState(true)
  const { mutateAsync: tokenRefresh } = useRefresh({
    onErrorHandler: () => router.replace('/login'),
  })

  useEffect(() => {
    if (isLoggedIn && !accessToken) {
      const refresh = async () => {
        try {
          const newAccessToken = await tokenRefresh()
          setAccessToken(newAccessToken)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }
      refresh()
    } else {
      setIsLoading(false)
    }
  }, [isLoggedIn, accessToken, tokenRefresh])

  if (isLoading) {
    return <>로딩중</>
  }
  return <>{children}</>
}

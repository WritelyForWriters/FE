'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useState } from 'react'

import { useAtomValue } from 'jotai'
import { accessTokenAtom } from 'store/accessTokenAtom'
import { isLoggedInAtom } from 'store/isLoggedInAtom'

import { useRefresh } from '@hooks/index'

interface TokenRefresherProps {
  children: ReactNode
}

export default function TokenRefresher({ children }: TokenRefresherProps) {
  const router = useRouter()
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const accessToken = useAtomValue(accessTokenAtom)

  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync: tokenRefresh } = useRefresh({
    onErrorHandler: () => router.replace('/login'),
  })

  useEffect(() => {
    if (isLoggedIn && !accessToken) {
      setIsLoading(true)
    }
  }, [isLoggedIn, accessToken])

  useEffect(() => {
    if (!isLoading) return

    const refresh = async () => {
      try {
        await tokenRefresh()
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    refresh()
  }, [isLoading, tokenRefresh])

  if (isLoading) {
    return <>로딩중</>
  }

  return <>{children}</>
}

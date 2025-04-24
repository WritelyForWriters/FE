'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect } from 'react'

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

  const needsRefresh = !isLoggedIn || !accessToken

  const { mutate: tokenRefresh } = useRefresh({
    onErrorHandler: () => router.replace('/login'),
  })

  useEffect(() => {
    if (needsRefresh) {
      tokenRefresh()
    }
  }, [needsRefresh, tokenRefresh])

  if (needsRefresh) {
    return null
  }

  return <>{children}</>
}

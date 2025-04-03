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

  const [isLoading] = useState(isLoggedIn && !accessToken)

  const { mutate } = useRefresh({
    onErrorHandler: () => {
      router.replace('/login')
    },
  })

  useEffect(() => {
    if (!isLoading) {
      return
    }

    mutate()
  }, [])

  return <>{children}</>
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect } from 'react'

import { useSetAtom } from 'jotai'
import { accessToken } from 'store/accessTokenAtom'

export default function CompleteJoinPage() {
  const router = useRouter()
  const params = useSearchParams()

  const joinToken = params.get('joinToken')

  const setAccessToken = useSetAtom(accessToken)

  useEffect(() => {
    const completeJoin = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/join/complete`, {
          method: 'POST',
          body: JSON.stringify({ joinToken }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()

        if (data.code === 'RESULT-001') {
          setAccessToken(data.result.accessToken)
        } else {
          router.push('/login')
        }
      } catch {
        router.push('/login')
      }
    }

    completeJoin()
  }, [joinToken])

  return <></>
}

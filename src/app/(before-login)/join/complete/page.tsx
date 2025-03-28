'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect } from 'react'

import { TOAST_MESSAGE } from 'constants/common/toastMessage'

import { useToast } from '@components/toast/ToastProvider'

export default function CompleteJoinPage() {
  const showToast = useToast()

  const router = useRouter()
  const params = useSearchParams()

  const joinToken = params.get('joinToken')

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

        if (data.code !== 'RESULT-001') {
          showToast('warning', data.message)
        }
      } catch {
        showToast('warning', TOAST_MESSAGE.NETWORK_ERROR)
      } finally {
        router.push('/login')
      }
    }

    completeJoin()
  }, [joinToken])

  return <></>
}

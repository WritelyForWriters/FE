'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { useEffect } from 'react'

import { useCompleteJoin } from '@hooks/index'

export default function CompleteJoinPage() {
  const router = useRouter()
  const params = useSearchParams()

  const joinToken = params.get('joinToken')!

  const { mutate } = useCompleteJoin({
    onSettledHandler: () => {
      router.replace('/login')
    },
  })

  useEffect(() => {
    mutate(joinToken)
  }, [joinToken])

  return <></>
}

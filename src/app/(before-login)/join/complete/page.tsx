'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Suspense, useEffect } from 'react'

import { useCompleteJoin } from '@hooks/index'

function CompleteJoin() {
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

export default function CompleteJoinPage() {
  return (
    <Suspense>
      <CompleteJoin />
    </Suspense>
  )
}

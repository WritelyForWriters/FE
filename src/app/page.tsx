'use client'

import { useEffect } from 'react'

import Dashboard from '(after-login)/(bookself)/_components/Dashboard'
import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { useAtomValue } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { hasWatchedTutorialAtom } from 'store/hasWatchedTutorial'

import AfterLoginTutorial from '@components/tutorial/AfterLoginTutorial'
import BeforeLoginTutorial from '@components/tutorial/BeforeLoginTutorial'

import { usePageExitTracking } from '@hooks/amplitude/usePageExitTracking'

import { isLoggedInAtom } from './store/isLoggedInAtom'

export default function Home() {
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const hasWatchedTutorial = useAtomValue(hasWatchedTutorialAtom)

  useEffect(() => {
    trackEvent('page_view', {
      page_name: 'library',
    })
  }, [])

  usePageExitTracking('library')

  if (!isLoggedIn && !hasWatchedTutorial) {
    return <BeforeLoginTutorial />
  } else if (isLoggedIn) {
    // TODO(선우): 첫 로그인 여부 전달받기
    return <AfterLoginTutorial />
  } else {
    return (
      <>
        <MainHeader />
        <Dashboard />
      </>
    )
  }
}

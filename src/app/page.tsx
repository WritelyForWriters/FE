'use client'

import { useEffect } from 'react'

import Dashboard from '(after-login)/(bookself)/_components/Dashboard'
import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { useAtomValue } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { hasWatchedBookSelfTutorialAtom } from 'store/hasWatchedBookSelfTutorialAtom'
import { hasWatchedTutorialAtom } from 'store/hasWatchedTutorialAtom'
import { isFirstLoginAtom } from 'store/isFirstLoginAtom'

import AfterLoginTutorial from '@components/tutorial/AfterLoginTutorial'
import BeforeLoginTutorial from '@components/tutorial/BeforeLoginTutorial'

import { usePageExitTracking } from '@hooks/amplitude/usePageExitTracking'

import { isLoggedInAtom } from './store/isLoggedInAtom'

export default function Home() {
  const isLoggedIn = useAtomValue(isLoggedInAtom)
  const hasWatchedTutorial = useAtomValue(hasWatchedTutorialAtom)
  const isFirstLogin = useAtomValue(isFirstLoginAtom)
  const hasWatchedBookSelfTutorial = useAtomValue(hasWatchedBookSelfTutorialAtom)

  useEffect(() => {
    trackEvent('page_view', {
      page_name: 'library',
    })
  }, [])

  usePageExitTracking('library')

  if (!isLoggedIn && !hasWatchedTutorial) {
    // CASE 1: 유저가 로그인하지 않았고 튜토리얼을 시청하지 않은 경우
    return <BeforeLoginTutorial />
  } else if (isLoggedIn && isFirstLogin && !hasWatchedBookSelfTutorial) {
    // CASE 2: 첫 로그인이고 튜토리얼 시청하지 않은 경우
    return <AfterLoginTutorial />
  }

  return (
    <>
      <MainHeader />
      <Dashboard />
    </>
  )
}

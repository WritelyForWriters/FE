'use client'

import { useEffect } from 'react'

import Dashboard from '(after-login)/(bookself)/_components/Dashboard'
import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { trackEvent } from 'lib/amplitude'

import { usePageExitTracking } from '@hooks/amplitude/usePageExitTracking'

/**
 * TODO
 * [ ] UI 점검
 * [ ] 인가 처리 -> 로그인 기능 완료 후
 * [ ] 로그인 여부에 따른 버튼 UI -> 로그인 기능 완료 후
 */

export default function Home() {
  useEffect(() => {
    trackEvent('page_view', {
      page_name: 'library',
    })
  }, [])

  usePageExitTracking('library')

  return (
    <>
      <MainHeader />
      <Dashboard />
    </>
  )
}

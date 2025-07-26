/**
 * 로그인 후 내 서재 튜토리얼
 * @author 선우
 */
import { useCallback, useEffect, useState } from 'react'

import Dashboard from '(after-login)/(bookself)/_components/Dashboard'
import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { AFTER_LOGIN_TUTORIAL_STEPS } from 'constants/tutorial/steps'
import { useSetAtom } from 'jotai'
import { CallBackProps, STATUS } from 'react-joyride'
import { hasWatchedBookSelfTutorialAtom } from 'store/hasWatchedBookSelfTutorialAtom'

import ProductTour from '@components/product-tour/ProductTour'

export default function AfterLoginTutorial() {
  const [stepIndex, setStepIndex] = useState(0)
  const [run, setRun] = useState(true)

  const setHasWatchedBookSelfTutorial = useSetAtom(hasWatchedBookSelfTutorialAtom)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRun(false)
      }

      setStepIndex((prev) => prev + 1)
    }

    if (run) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [run])

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, index, type } = data

    if (status === STATUS.FINISHED || status === STATUS.PAUSED) {
      setRun(false)
      localStorage.setItem('hasWatchedBookSelfTutorial', 'true')
      setHasWatchedBookSelfTutorial(true)
    }

    if (type === 'step:after') {
      setStepIndex(index + 1)
    }
  }, [])

  return (
    <>
      <ProductTour
        run={run}
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        steps={AFTER_LOGIN_TUTORIAL_STEPS}
      />
      <MainHeader stepIndex={stepIndex} />
      <Dashboard />
    </>
  )
}

/**
 * 로그인 전 내 서재 튜토리얼
 * @author 선우
 */
import { useCallback, useEffect, useState } from 'react'

import Dashboard from '(after-login)/(bookself)/_components/Dashboard'
import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { BEFORE_LOGIN_TUTORIAL_STEPS } from 'constants/tutorial/steps'
import { useAtom, useSetAtom } from 'jotai'
import { CallBackProps, STATUS } from 'react-joyride'
import { hasWatchedTutorialAtom } from 'store/hasWatchedTutoriaAtom'
import { isTutorialRunningAtom } from 'store/isTutorialRunningAtom'

import ProductTour from '@components/product-tour/ProductTour'

import LibraryBackground from './LibraryBackground'

export default function BeforeLoginTutorial() {
  const [stepIndex, setStepIndex] = useState(0)

  const [isTutorialRunning, setIsTutorialRunning] = useAtom(isTutorialRunningAtom)
  const setHasWatchedTutorial = useSetAtom(hasWatchedTutorialAtom)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsTutorialRunning(false)
      }

      setStepIndex((prev) => prev + 1)
    }

    if (isTutorialRunning) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isTutorialRunning])

  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const writeButton = document.querySelector<HTMLButtonElement>('.library-step-1')

    const { status, index, type } = data

    if (status === STATUS.FINISHED || status === STATUS.PAUSED) {
      setIsTutorialRunning(false)
      localStorage.setItem('hasWatchedTutorial', 'true')
      setHasWatchedTutorial(true)
    }

    if (type === 'step:after' && index === 1) {
      writeButton?.click()
      setStepIndex(index + 1)
    }

    if (type === 'error:target_not_found') {
      writeButton?.click()
      setStepIndex(index + 1)
    }

    if (type === 'step:after') {
      setStepIndex(index + 1)
    }
  }, [])

  return (
    <>
      <ProductTour
        run={isTutorialRunning}
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        steps={BEFORE_LOGIN_TUTORIAL_STEPS}
      />

      {!stepIndex ? (
        <>
          <MainHeader />
          <Dashboard />
        </>
      ) : (
        <LibraryBackground />
      )}
    </>
  )
}

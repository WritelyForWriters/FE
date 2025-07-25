/**
 * 로그인 후 내 서재 튜토리얼
 * @author 선우
 */
import { useCallback, useEffect, useState } from 'react'

import Dashboard from '(after-login)/(bookself)/_components/Dashboard'
import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { AFTER_LOGIN_TUTORIAL_STEPS } from 'constants/tutorial/steps'
import { useAtom } from 'jotai'
import { CallBackProps, STATUS } from 'react-joyride'

import ProductTour from '@components/product-tour/ProductTour'

import { isTutorialRunningAtom } from './../../store/isTutorialRunningAtom'

export default function AfterLoginTutorial() {
  const [stepIndex, setStepIndex] = useState(0)
  const [isTutorialRunning, setIsTutorialRunning] = useAtom(isTutorialRunningAtom)

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
    const { status, index, type } = data

    if (status === STATUS.FINISHED || status === STATUS.PAUSED) {
      setIsTutorialRunning(false)
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
        steps={AFTER_LOGIN_TUTORIAL_STEPS}
      />
      <MainHeader stepIndex={stepIndex} />
      <Dashboard />
    </>
  )
}

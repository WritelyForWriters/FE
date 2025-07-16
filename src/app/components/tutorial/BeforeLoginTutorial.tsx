/**
 * 로그인 전 내 서재 튜토리얼
 * @author 선우
 */
import { useCallback, useEffect, useState } from 'react'

import Dashboard from '(after-login)/(bookself)/_components/Dashboard'
import MainHeader from '(after-login)/(bookself)/_components/MainHeader'
import { useSetAtom } from 'jotai'
import { CallBackProps, Placement, STATUS } from 'react-joyride'
import { hasWatchedTutorialAtom } from 'store/hasWatchedTutorial'

import ProductTour from '@components/product-tour/ProductTour'

import LibraryBackground from './LibraryBackground'

const BEFORE_LOGIN_TUTORIAL_STEPS = [
  {
    target: 'body',
    title: '라이트온에 오신 것을 환영합니다! \n 같이 한 번 둘러볼까요?',
    content: '튜토리얼을 시작하려면 아무 키나 눌러주세요.',
    placement: 'center' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-1',
    content: '여기서 글쓰기를 시작할 수 있어요.',
    placement: 'bottom' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-2',
    content: '바로 작품 쓰기를 시작할 수 있어요.',
    placement: 'left' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-3',
    content: '작품을 먼저 기획할 수 있어요.',
    placement: 'left' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-4',
    content: '작품 본문을 읽고 편집할 수 있어요.',
    placement: 'right' as Placement,
    disableBeacon: true,
  },
  {
    target: '.library-step-5',
    content: '작품 설정을 읽고 편집할 수 있어요.',
    placement: 'right' as Placement,
    disableBeacon: true,
  },
  {
    target: 'body',
    title: '이제 진짜 작품을 \n 만들어 볼까요?',
    content: null,
    placement: 'center' as Placement,
    disableBeacon: true,
  },
]

export default function BeforeLoginTutorial() {
  const [run, setRun] = useState(true)
  const [stepIndex, setStepIndex] = useState(0)

  const setHasWatchedTutorial = useSetAtom(hasWatchedTutorialAtom)

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
      localStorage.setItem('hasWatchedTutorial', 'true')
      setHasWatchedTutorial(true)
    }

    if (type === 'step:after' && index === 1) {
      const writeButton = document.querySelector<HTMLButtonElement>('.library-step-1')
      writeButton?.click()
      setStepIndex(index + 1)
    }

    if (type === 'error:target_not_found') {
      const writeButton = document.querySelector<HTMLButtonElement>('.library-step-1')
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
        run={run}
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

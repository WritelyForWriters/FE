import { useRouter } from 'next/navigation'

import { useSetAtom } from 'jotai'
import { TooltipRenderProps } from 'react-joyride'
import { hasWatchedTutorialAtom } from 'store/hasWatchedTutorialAtom'
import { isTutorialRunningAtom } from 'store/isTutorialRunningAtom'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'

import classNames from 'classnames/bind'

import styles from './FullscreenTooltip.module.scss'

const cx = classNames.bind(styles)

export default function FullscreenTooltip(props: TooltipRenderProps) {
  const { isLastStep, step, tooltipProps, closeProps } = props

  const router = useRouter()

  const setHasWatchedTutorial = useSetAtom(hasWatchedTutorialAtom)
  const setIsTutorialRunning = useSetAtom(isTutorialRunningAtom)

  const handleButtonClick = () => {
    router.push('/login')
    localStorage.setItem('hasWatchedTutorial', 'true')
    setIsTutorialRunning(false)
    setHasWatchedTutorial(true)
  }

  return (
    <div className={cx('fullscreen-tooltip')} {...tooltipProps}>
      <div className={cx('header')}>
        <h1 className={cx('title')}>{step.title}</h1>
        {step.content && <h3 className={cx('content')}>{step.content}</h3>}
      </div>
      {isLastStep && (
        <div className={cx('footer')}>
          <FillButton size="large" onClick={handleButtonClick}>
            첫 작품 시작하기
          </FillButton>
          <TextButton {...closeProps} size="large">
            나중에 만들게요
          </TextButton>
        </div>
      )}
    </div>
  )
}

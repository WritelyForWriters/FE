import { useRouter } from 'next/navigation'

import { useSetAtom } from 'jotai'
import { TooltipRenderProps } from 'react-joyride'
import { hasWatchedTutorialAtom } from 'store/hasWatchedTutorial'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'

import classNames from 'classnames/bind'

import styles from './FullscreenTooltip.module.scss'

const cx = classNames.bind(styles)

export default function FullscreenTooltip(props: TooltipRenderProps) {
  const router = useRouter()
  const setHasWatchedTutorial = useSetAtom(hasWatchedTutorialAtom)

  const { isLastStep, step, tooltipProps, closeProps } = props

  return (
    <div className={cx('fullscreen-tooltip')} {...tooltipProps}>
      <div className={cx('header')}>
        <h1 className={cx('title')}>{step.title}</h1>
        {step.content && <h3 className={cx('content')}>{step.content}</h3>}
      </div>
      {isLastStep && (
        <div className={cx('footer')}>
          <FillButton
            size="large"
            onClick={() => {
              router.push('/login')
              setHasWatchedTutorial(true)
            }}
          >
            첫 작품 시작하기
          </FillButton>
          <TextButton size="large" {...closeProps}>
            나중에 만들게요
          </TextButton>
        </div>
      )}
    </div>
  )
}

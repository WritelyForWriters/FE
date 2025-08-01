/**
 * Joyride용 custom tooltip
 * @author 선우
 */
import { TooltipRenderProps } from 'react-joyride'

import FullscreenTooltip from '@components/fullscreen-tooltip/FullscreenTooltip'

import classNames from 'classnames/bind'

import styles from './CustomTooltip.module.scss'

const cx = classNames.bind(styles)

export default function CustomTooltip(props: TooltipRenderProps) {
  const { step, tooltipProps } = props

  if (step.target === 'body') {
    return <FullscreenTooltip {...props} />
  }

  return (
    <div className={cx('tooltip__body')} {...tooltipProps}>
      <p className={cx('tooltip__title')}>{step.content}</p>
    </div>
  )
}

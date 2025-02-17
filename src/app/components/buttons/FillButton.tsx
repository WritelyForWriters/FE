/**
 *  버튼 공통 컴포넌트 - Fill Button
 * @author 선우
 */
import { HTMLAttributes, ReactNode } from 'react'

import classNames from 'classnames/bind'

import styles from './FillButton.module.scss'

const cx = classNames.bind(styles)

interface FillButtonProps extends HTMLAttributes<HTMLButtonElement> {
  shape?: 'square' | 'pill'
  variant?: 'primary' | 'secondary'
  size: 'large' | 'medium' | 'small' | 'xsmall'
  iconPosition?: 'leading' | 'trailing' | 'only'
  iconType?: ReactNode
  onClick?: () => void
  disabled?: boolean
}

export default function FillButton({
  shape = 'square',
  variant = 'primary',
  size,
  iconPosition,
  iconType,
  onClick,
  disabled,
  children,
  ...rest
}: FillButtonProps) {
  return (
    <button
      className={cx('fill-button', variant, shape, size, iconPosition)}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {iconType && iconPosition === 'leading' && iconType}
      {iconType && iconPosition === 'only' ? iconType : children}
      {iconType && iconPosition === 'trailing' && iconType}
    </button>
  )
}

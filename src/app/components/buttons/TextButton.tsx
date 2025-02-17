/**
 *  버튼 공통 컴포넌트 - Text Button
 * @author 선우
 */
import { HTMLAttributes, ReactNode } from 'react'

import classNames from 'classnames/bind'

import styles from './TextButton.module.scss'

const cx = classNames.bind(styles)

interface TextButtonProps extends HTMLAttributes<HTMLButtonElement> {
  shape?: 'square' | 'pill'
  variant?: 'primary' | 'secondary'
  size: 'large' | 'medium' | 'small'
  iconPosition?: 'leading' | 'trailing' | 'only'
  iconType?: ReactNode
  onClick?: () => void
  disabled?: boolean
}

export default function TextButton({
  shape = 'square',
  variant = 'primary',
  size,
  iconPosition,
  iconType,
  onClick,
  disabled,
  children,
  ...rest
}: TextButtonProps) {
  return (
    <button
      className={cx('text-button', shape, variant, size, iconPosition)}
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

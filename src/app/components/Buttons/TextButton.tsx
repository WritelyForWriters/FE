/**
 * 텍스트 버튼 컴포넌트
 * @author 선우
 */
import { HTMLAttributes, ReactNode } from 'react'

import classNames from 'classnames/bind'

import styles from './TextButton.module.scss'

const cx = classNames.bind(styles)

interface TextButtonProps extends HTMLAttributes<HTMLButtonElement> {
  disabled: boolean
  size: 'large' | 'medium' | 'small'
  iconPosition?: 'leading' | 'trailing'
  iconType?: ReactNode
  onClick?: () => void
}

export default function TextButton({
  disabled,
  size,
  iconPosition,
  iconType,
  onClick,
  children,
  ...rest
}: TextButtonProps) {
  return (
    <div
      className={cx('text-button-container', size, iconPosition, { disabled: disabled })}
      onClick={onClick}
    >
      {iconType && iconPosition === 'leading' && iconType}
      <button className={cx('text-button')} disabled={disabled} {...rest}>
        {children}
      </button>
      {iconType && iconPosition === 'trailing' && iconType}
    </div>
  )
}

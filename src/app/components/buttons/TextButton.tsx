/**
 *  버튼 공통 컴포넌트 - Text Button
 * @author 선우
 */
import { ButtonHTMLAttributes, ReactNode } from 'react'

import {
  ButtonIconPositionType,
  ButtonShapeType,
  ButtonSizeType,
  ButtonVariantType,
} from 'types/common/button'

import classNames from 'classnames/bind'

import styles from './TextButton.module.scss'

const cx = classNames.bind(styles)

interface TextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shape?: ButtonShapeType
  variant?: ButtonVariantType
  size: Exclude<ButtonSizeType, 'xsmall'>
  iconPosition?: ButtonIconPositionType
  iconType?: ReactNode
}

export default function TextButton({
  shape = 'square',
  variant = 'primary',
  size,
  iconPosition,
  iconType,
  children,
  ...rest
}: TextButtonProps) {
  return (
    <button className={cx('text-button', shape, variant, size, iconPosition)} {...rest}>
      {iconType && iconPosition === 'leading' && iconType}
      {iconType && iconPosition === 'only' ? iconType : children}
      {iconType && iconPosition === 'trailing' && iconType}
    </button>
  )
}

/**
 *  버튼 공통 컴포넌트 - Fill Button
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

import styles from './FillButton.module.scss'

const cx = classNames.bind(styles)

interface FillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  shape?: ButtonShapeType
  variant?: ButtonVariantType
  size: ButtonSizeType
  iconPosition?: ButtonIconPositionType
  iconType?: ReactNode
}

export default function FillButton({
  shape = 'square',
  variant = 'primary',
  size,
  iconPosition,
  iconType,
  children,
  ...rest
}: FillButtonProps) {
  return (
    <button className={cx('fill-button', variant, shape, size, iconPosition)} {...rest}>
      {iconType && iconPosition === 'leading' && iconType}
      {iconType && iconPosition === 'only' ? iconType : children}
      {iconType && iconPosition === 'trailing' && iconType}
    </button>
  )
}

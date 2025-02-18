/**
 *  버튼 공통 컴포넌트 - Text Button
 * @author 선우
 */
import { ButtonPropsBase } from 'types/common/button'

import classNames from 'classnames/bind'

import styles from './TextButton.module.scss'

const cx = classNames.bind(styles)

export default function TextButton({
  size,
  shape = 'square',
  variant = 'primary',
  iconPosition,
  iconType,
  children,
  ...rest
}: ButtonPropsBase) {
  return (
    <button className={cx('text-button', shape, variant, size, iconPosition)} {...rest}>
      {iconType && iconPosition === 'leading' && iconType}
      {iconType && iconPosition === 'only' ? iconType : children}
      {iconType && iconPosition === 'trailing' && iconType}
    </button>
  )
}

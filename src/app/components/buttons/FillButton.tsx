/**
 *  버튼 공통 컴포넌트 - Fill Button
 * @author 선우
 */
import { ButtonPropsBase, ButtonSizeType } from 'types/common/button'

import classNames from 'classnames/bind'

import styles from './FillButton.module.scss'

const cx = classNames.bind(styles)

export default function FillButton({
  size,
  shape = 'square',
  variant = 'primary',
  className,
  iconPosition,
  iconType,
  children,
  ...rest
}: Omit<ButtonPropsBase, 'size'> & { size: ButtonSizeType }) {
  return (
    <button className={cx('fill-button', variant, shape, size, iconPosition, className)} {...rest}>
      {iconType && iconPosition === 'leading' && iconType}
      {iconType && iconPosition === 'only' ? iconType : children}
      {iconType && iconPosition === 'trailing' && iconType}
    </button>
  )
}

/**
 *  버튼 공통 컴포넌트 - OutLined Button
 * @author 선우
 */
import { ReactNode } from 'react'

import classNames from 'classnames/bind'

import styles from './OutLinedButton.module.scss'

const cx = classNames.bind(styles)

interface OutLinedButtonProps {
  size: 'large'
  shape?: 'square'
  variant?: 'primary'
  children: ReactNode
}

export default function OutLinedButton({
  size,
  shape = 'square',
  variant = 'primary',
  children,
}: OutLinedButtonProps) {
  return <button className={cx('outlined-button', size, shape, variant)}>{children}</button>
}

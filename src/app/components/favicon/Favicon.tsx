/**
 * 공통 컴포넌트 - favicon
 * @author 선우
 */
import { ButtonHTMLAttributes, ReactNode } from 'react'

import classNames from 'classnames/bind'

import styles from './Favicon.module.scss'

const cx = classNames.bind(styles)

interface FaviconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function Favicon({ children, ...rest }: FaviconProps) {
  return (
    <button type="button" className={cx('favicon')} {...rest}>
      {children}
    </button>
  )
}

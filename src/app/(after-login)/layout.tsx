import { ReactNode } from 'react'

import classNames from 'classnames/bind'

import styles from './layout.module.scss'

const cx = classNames.bind(styles)

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return <div className={cx('container')}>{children}</div>
}

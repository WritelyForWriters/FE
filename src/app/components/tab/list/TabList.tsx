import { PropsWithChildren } from 'react'

import classNames from 'classnames/bind'

import styles from './TabList.module.scss'

const cx = classNames.bind(styles)

interface TabListProps {
  size?: 'large' | 'medium'
}

export default function TabList({ children, size = 'medium' }: PropsWithChildren<TabListProps>) {
  return <div className={cx`${size}`}>{children}</div>
}

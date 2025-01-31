import { PropsWithChildren } from 'react'

import classNames from 'classnames/bind'

import styles from './TabList.module.scss'

const cx = classNames.bind(styles)

export default function TabList({ children }: PropsWithChildren) {
  return <div className={cx('list')}>{children}</div>
}

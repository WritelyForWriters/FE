import { PropsWithChildren } from 'react'

import classNames from 'classnames/bind'

import styles from './PanelHeader.module.scss'

const cx = classNames.bind(styles)

interface Props {
  isOpen?: boolean
}

export default function PanelHeader({ children, isOpen }: PropsWithChildren<Props>) {
  return <div className={cx('container', { 'is-open': isOpen })}>{children}</div>
}

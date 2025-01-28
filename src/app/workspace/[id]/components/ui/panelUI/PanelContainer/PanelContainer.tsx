import { PropsWithChildren } from 'react'

import styles from './PanelContainer.module.scss'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function PanelContainer({ children }: PropsWithChildren) {
  return <div className={cx('container')}>{children}</div>
}

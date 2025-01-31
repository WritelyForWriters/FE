import { PropsWithChildren } from 'react'

import classNames from 'classnames/bind'

import styles from './PanelBody.module.scss'

const cx = classNames.bind(styles)

export default function PanelBody({ children }: PropsWithChildren) {
  return <div className={cx('container')}>{children}</div>
}

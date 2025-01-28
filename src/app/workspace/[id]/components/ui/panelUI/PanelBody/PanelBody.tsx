import { PropsWithChildren } from 'react'

import styles from './PanelBody.module.scss'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function PanelBody({ children }: PropsWithChildren) {
  return <div className={cx('container')}>{children}</div>
}

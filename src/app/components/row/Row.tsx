import { PropsWithChildren } from 'react'

import classNames from 'classnames/bind'

import styles from './Row.module.scss'

const cx = classNames.bind(styles)

interface Props {
  spaceBetween?: boolean
  gap?: 2 | 4 | 8
}

export default function Row({ children, spaceBetween, gap }: PropsWithChildren<Props>) {
  return (
    <div className={cx('row', `gap-${gap}`, { 'space-between': spaceBetween })}>{children}</div>
  )
}

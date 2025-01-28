import { PropsWithChildren } from 'react'

import styles from './Row.module.scss'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface Props {
  spaceBetween?: boolean
  gap?: 2 | 4
}

export default function Row({ children, spaceBetween, gap }: PropsWithChildren<Props>) {
  return (
    <div className={cx('row', `gap-${gap}`, { 'space-between': spaceBetween })}>{children}</div>
  )
}

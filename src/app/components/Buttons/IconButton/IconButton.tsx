import { HTMLAttributes, PropsWithChildren } from 'react'

import styles from './IconButton.module.scss'

import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface Props extends HTMLAttributes<HTMLButtonElement> {
  activeColor?: string
}

export default function IconButton({ children, ...rest }: PropsWithChildren<Props>) {
  return (
    <button className={cx('icon-button')} {...rest}>
      {children}
    </button>
  )
}

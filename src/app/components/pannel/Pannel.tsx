import { HTMLAttributes, MouseEvent, PropsWithChildren } from 'react'

import { FaMinus } from 'react-icons/fa6'

import classNames from 'classnames/bind'

import styles from './Pannel.module.scss'

const cx = classNames.bind(styles)

interface PannelProps extends HTMLAttributes<HTMLElement> {
  title: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  variant?: boolean
}

export default function Pannel({
  children,
  onClick,
  title,
  variant,
  ...rest
}: PropsWithChildren<PannelProps>) {
  return (
    <section className={cx('pannel', { 'pannel--variant': variant })} {...rest}>
      <div className={cx('title')}>
        <h2>{title}</h2>
        <button onClick={onClick}>
          <FaMinus color="#B3B3B3" size={16} />
        </button>
      </div>

      {children}
    </section>
  )
}

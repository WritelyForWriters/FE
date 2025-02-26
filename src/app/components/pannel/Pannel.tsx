import { MouseEvent, PropsWithChildren } from 'react'

import { FaMinus } from 'react-icons/fa6'

import classNames from 'classnames/bind'

import styles from './Pannel.module.scss'

const cx = classNames.bind(styles)

interface PannelProps {
  title: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
}

export default function Pannel({ children, onClick, title }: PropsWithChildren<PannelProps>) {
  return (
    <section className={cx('pannel')}>
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

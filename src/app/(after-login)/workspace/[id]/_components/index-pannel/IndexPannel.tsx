'use client'

import { MouseEvent } from 'react'

import Pannel from '@components/pannel/Pannel'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './IndexPannel.module.scss'

const cx = classNames.bind(styles)

export default function IndexPannel() {
  const { isOpen, onClose, onOpen } = useCollapsed(false)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClose()
  }

  return (
    <div>
      {isOpen ? (
        <Pannel onClick={handleCollapsedPannel} title="목차">
          <ul className={cx('index-list')}>
            {Array.from({ length: 5 }, (_, index) => index + 1).map((v) => (
              <li key={v}>{`제목 ${v}`}</li>
            ))}
          </ul>
        </Pannel>
      ) : (
        <button onClick={onOpen} className={cx('container')}>
          목차
        </button>
      )}
    </div>
  )
}

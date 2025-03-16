'use client'

import { MouseEvent } from 'react'

import Pannel from '@components/pannel/Pannel'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './IndexPannel.module.scss'

const cx = classNames.bind(styles)

interface TocItem {
  id: string
  title: string
}

interface IndexPannelProps {
  toc: TocItem[]
}

export default function IndexPannel({ toc }: IndexPannelProps) {
  const { isOpen, onClose, onOpen } = useCollapsed(false)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClose()
  }

  return (
    <div className={cx('wrapper')}>
      {isOpen ? (
        <Pannel onClick={handleCollapsedPannel} title="목차">
          <ul className={cx('index-list')}>
            {toc.map(({ id, title }) => (
              <li key={id}>{title}</li>
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

'use client'

import { MouseEvent } from 'react'

import Pannel from '@components/pannel/Pannel'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './IndexPannel.module.scss'

const cx = classNames.bind(styles)

// mock data
// TODO data 받아서 표시, 공통 컴포넌트로
const datas = ['시놉시스', '세계관', '등장인물', '줄거리', '아이디어 노트']

export default function IndexPannel() {
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
            {datas.map((data) => (
              <li key={data}>{data}</li>
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

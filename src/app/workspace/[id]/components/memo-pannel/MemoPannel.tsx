'use client'

import { MouseEvent, useState } from 'react'

import Pannel from '@components/pannel/Pannel'
import Tab from '@components/tab/Tab'

import MemoItem from './MemoItem'

import classNames from 'classnames/bind'

import styles from './MemoPannel.module.scss'

const cx = classNames.bind(styles)

export default function MemoPannel() {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsExpanded(false)
  }

  return (
    <>
      {isExpanded ? (
        <Pannel onClick={handleCollapsedPannel} title="메모">
          <Tab defaultTab="progress">
            <Tab.Button value="progress">진행중</Tab.Button>
            <Tab.Button value="all">전체</Tab.Button>
          </Tab>

          <ul className={cx('memo-list')}>
            {Array.from({ length: 4 }, (_, index) => (
              <MemoItem key={index} />
            ))}
          </ul>
        </Pannel>
      ) : (
        // TODO 공통 버튼 컴포넌트로 변경
        <button onClick={() => setIsExpanded(true)} className={cx('container')}>
          메모
        </button>
      )}
    </>
  )
}

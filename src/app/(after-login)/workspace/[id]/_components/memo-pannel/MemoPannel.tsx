'use client'

import { MouseEvent } from 'react'

import { MemosDto } from 'types/memos/memosResponseType'

import Pannel from '@components/pannel/Pannel'
import Tab from '@components/tab/Tab'

import { useCollapsed } from '@hooks/common/useCollapsed'

import MemoItem from './MemoItem'

import classNames from 'classnames/bind'

import styles from './MemoPannel.module.scss'

const cx = classNames.bind(styles)

interface MemoPannelProps {
  memoList?: MemosDto[]
}

export default function MemoPannel({ memoList }: MemoPannelProps) {
  const { isOpen, onClose, onOpen } = useCollapsed(false)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClose()
  }

  console.log(memoList)

  return (
    <>
      {isOpen ? (
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
        <button onClick={onOpen} className={cx('container')}>
          메모
        </button>
      )}
    </>
  )
}

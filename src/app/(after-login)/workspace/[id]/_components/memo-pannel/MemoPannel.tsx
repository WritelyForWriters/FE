'use client'

import { MouseEvent, useState } from 'react'

import { trackEvent } from 'lib/amplitude'
import { MemosDto } from 'types/memos'

import Pannel from '@components/pannel/Pannel'
import Tab from '@components/tab/Tab'

import { useCollapsed } from '@hooks/common/useCollapsed'

import MemoList from './MemoList'

import classNames from 'classnames/bind'

import styles from './MemoPannel.module.scss'

const cx = classNames.bind(styles)

interface MemoPannelProps {
  memoList?: MemosDto[]
}

export default function MemoPannel({ memoList }: MemoPannelProps) {
  const { isOpen, onClose, onOpen } = useCollapsed(false)
  const [startTime, setStartTime] = useState<number>(0)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    trackEvent('panel_close', {
      panel_name: '메모',
      open_duration: Date.now() - startTime,
    })
    e.stopPropagation()
    onClose()
  }

  const handleButtonClick = () => {
    setStartTime(Date.now())
    trackEvent('panel_open', {
      panel_name: '메모',
    })
    onOpen()
  }

  return (
    <>
      {isOpen ? (
        <Pannel onClick={handleCollapsedPannel} title="메모">
          <Tab defaultTab="progress" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={cx('button-wrapper')}>
              <Tab.Button value="progress">진행중</Tab.Button>
              <Tab.Button value="all">전체</Tab.Button>
            </div>

            <MemoList memoList={memoList} />
          </Tab>
        </Pannel>
      ) : (
        <button onClick={handleButtonClick} className={cx('container')}>
          메모
        </button>
      )}
    </>
  )
}

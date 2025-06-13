'use client'

import { MouseEvent } from 'react'

import { Editor } from '@tiptap/react'
import { MemosDto } from 'types/memos'

import Pannel from '@components/pannel/Pannel'
import Tab from '@components/tab/Tab'

import { useCollapsed } from '@hooks/common/useCollapsed'
import { useMemoTracking } from '@hooks/editor/useMemosTracking'

import MemoList from './MemoList'

import classNames from 'classnames/bind'

import styles from './MemoPannel.module.scss'

const cx = classNames.bind(styles)

interface MemoPannelProps {
  memoList?: MemosDto[]
  editor: Editor
}

export default function MemoPannel({ memoList, editor }: MemoPannelProps) {
  const { isOpen, onClose, onOpen } = useCollapsed(false)

  useMemoTracking(editor, memoList)

  const handleCollapsedPannel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClose()
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

            <MemoList memoList={memoList} editor={editor} />
          </Tab>
        </Pannel>
      ) : (
        <button onClick={onOpen} className={cx('container')}>
          메모
        </button>
      )}
    </>
  )
}

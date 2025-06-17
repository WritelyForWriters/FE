'use client'

import { MouseEvent, useState } from 'react'

import { trackEvent } from 'lib/amplitude'
import { Editor } from '@tiptap/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Rnd } from 'react-rnd'
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
  const [startTime, setStartTime] = useState<number>(0)

  useMemoTracking(editor, memoList)

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
        <div style={{ width: '100%', position: 'relative' }}>
          <Rnd
            disableDragging
            bounds="parent"
            enableResizing={{ left: true }}
            minWidth={244}
            default={{
              x: 0,
              y: 0,
              width: '100%',
              height: 416,
            }}
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.25 }}
                style={{
                  width: '100%',
                  height: 416,
                }}
              >
                <Pannel
                  onClick={handleCollapsedPannel}
                  title="메모"
                  style={{
                    height: '100%',
                  }}
                >
                  <Tab defaultTab="progress" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={cx('button-wrapper')}>
                      <Tab.Button value="progress">진행중</Tab.Button>
                      <Tab.Button value="all">전체</Tab.Button>
                    </div>

                    <MemoList memoList={memoList} editor={editor} />
                  </Tab>
                </Pannel>
              </motion.div>
            </AnimatePresence>
          </Rnd>
          <div className={cx('placeholder')}></div>
        </div>
      ) : (
        <button onClick={handleButtonClick} className={cx('container')}>
          메모
        </button>
      )}
    </>
  )
}

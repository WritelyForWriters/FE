'use client'

import { useState } from 'react'

import { useSetAtom } from 'jotai'
import { BsFillPinFill } from 'react-icons/bs'
import { BsPin } from 'react-icons/bs'
import { LuThumbsUp } from 'react-icons/lu'
import { LuThumbsDown } from 'react-icons/lu'
import { chatbotModeAtom } from 'store/chatbotModeAtom'

import classNames from 'classnames/bind'

import styles from './ChatbotAssistantMessage.module.scss'

const cx = classNames.bind(styles)

interface ChatbotAssistantMessageProps {
  id: string
  type: string
  message: {
    content: string
    isApplied: boolean
  }
  quote: string
}

export default function ChatbotAssistantMessage({
  id,
  type,
  message,
  quote,
}: ChatbotAssistantMessageProps) {
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const setChatbotMode = useSetAtom(chatbotModeAtom)

  const ellipsisQuote = quote.length > 20 ? quote.slice(0, 20) + '...' : quote

  // TODO: 탐색 모드 전환 시 id 사용 예정
  console.log(id)

  const handlePin = () => {
    if (isPinned) {
      // 메시지 고정 해제
    } else {
      // 메시지 고정
    }
    setIsPinned(!isPinned)
  }

  const handleFeedback = (direction: 'up' | 'down') => {
    // TODO: 평가 API 연동
    console.log(direction)
  }

  return (
    <div
      className={cx('assistant-message')}
      onClick={() => setChatbotMode('search')}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <div
        className={cx('assistant-message__body', {
          'assistant-message__body--hover': isMouseOver,
        })}
      >
        {quote && (
          <div className={cx('assistant-message__body-meta')}>
            <blockquote>{ellipsisQuote}</blockquote>
          </div>
        )}
        <div className={cx('assistant-message__body-content')}>
          <p>{message.content}</p>
          {type !== 'chat' && <p>{message.isApplied ? '적용됨' : '적용 안 됨'}</p>}
        </div>
      </div>
      <div className={cx('assistant-message__footer')}>
        {isMouseOver && (
          <>
            <button type="button" onClick={handlePin}>
              {isPinned ? (
                <BsFillPinFill color="#CCCCCC" size={20} />
              ) : (
                <BsPin color="#CCCCCC" size={20} />
              )}
            </button>
            <button type="button" onClick={() => handleFeedback('up')}>
              <LuThumbsUp color="#CCCCCC" size={20} />
            </button>
            <button type="button" onClick={() => handleFeedback('down')}>
              <LuThumbsDown color="#CCCCCC" size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

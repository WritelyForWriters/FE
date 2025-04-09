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
  messages: {
    content: string
    isApplied: boolean
  }
  quote: string
}

export default function ChatbotAssistantMessage({
  id,
  type,
  messages,
  quote,
}: ChatbotAssistantMessageProps) {
  const [isPinned, setIsPinned] = useState(false)
  const setChatbotMode = useSetAtom(chatbotModeAtom)

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

  return (
    <div className={cx('assistant-message')} onClick={() => setChatbotMode('search')}>
      <div className={cx('assistant-message__body')}>
        {quote && (
          <div className={cx('assistant-message__body-meta')}>
            <blockquote>{quote}</blockquote>
          </div>
        )}
        <div className={cx('assistant-message__body-content')}>
          <p>{messages.content}</p>
          {type !== 'chat' && <p>{messages.isApplied ? '적용됨' : '적용 안 됨'}</p>}
        </div>
      </div>
      <div className={cx('assistant-message__footer')}>
        <button onClick={handlePin}>
          {isPinned ? (
            <BsFillPinFill color="#CCCCCC" size={20} />
          ) : (
            <BsPin color="#CCCCCC" size={20} />
          )}
        </button>
        <button>
          <LuThumbsUp color="#CCCCCC" size={20} />
        </button>
        <button>
          <LuThumbsDown color="#CCCCCC" size={20} />
        </button>
      </div>
    </div>
  )
}

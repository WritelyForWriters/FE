'use client'

import { useState } from 'react'

import classNames from 'classnames/bind'

import styles from './ChatbotAssistantMessage.module.scss'

const cx = classNames.bind(styles)

interface ChatbotAssistantMessageProps {
  messages: {
    content: string
    isApplied: boolean
  }
  quote: string
}

export default function ChatbotAssistantMessage({ messages, quote }: ChatbotAssistantMessageProps) {
  const [isMouseOver, setIsMouseOver] = useState(false)
  console.log(isMouseOver)

  return (
    <div
      className={cx('assistant-message')}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <div className={cx('assistant-message__body')}>
        {quote && <blockquote>{quote}</blockquote>}
        <div className={cx('assistant-message__body-content')}>
          <p>{messages.content}</p>
          <p>{messages.isApplied ? '적용됨' : '적용 안 됨'}</p>
        </div>
      </div>
      <div className={cx('assistant-message__footer')}>
        <div className={cx('assistant-message__buttons')}></div>
      </div>
    </div>
  )
}

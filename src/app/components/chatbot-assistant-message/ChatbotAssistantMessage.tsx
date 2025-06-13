'use client'

import { useState } from 'react'

import { QueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from 'constants/common/queryKeys'
import 'highlight.js/styles/github.css'
import { useAtom, useAtomValue } from 'jotai'
import { BsFillPinFill } from 'react-icons/bs'
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import { chatInputModeAtom } from 'store/chatInputModeAtom'
import { chatbotFixedMessageAtom } from 'store/chatbotFixedMessageAtom'
import { chatbotSelectedIndexAtom } from 'store/chatbotSelectedIndexAtom'
import { productIdAtom } from 'store/productsAtoms'

import { usePinMessage } from '@hooks/chatbot/usePinMessage'
import { useSubmitFeedback } from '@hooks/chatbot/useSubmitFeedback'
import { useUnPinMessage } from '@hooks/chatbot/useUnPinMessage'

import classNames from 'classnames/bind'

import styles from './ChatbotAssistantMessage.module.scss'

const cx = classNames.bind(styles)

interface ChatbotAssistantMessageProps {
  index: number
  assistantId: string
  type: string
  quote: string
  message: {
    id: string
    content: string
    isApplied: boolean
  }
}

export default function ChatbotAssistantMessage({
  index,
  assistantId,
  type,
  quote,
  message,
}: ChatbotAssistantMessageProps) {
  const queryClient = new QueryClient()

  const [isMouseOver, setIsMouseOver] = useState(false)

  const [selectedIndex, setSelectedIndex] = useAtom(chatbotSelectedIndexAtom)
  const [fixedMessage, setFixedMessage] = useAtom(chatbotFixedMessageAtom)
  const [inputMode, setInputMode] = useAtom(chatInputModeAtom)
  const productId = useAtomValue(productIdAtom)

  const { mutate: submitFeedback } = useSubmitFeedback()

  const ellipsisQuote = quote.length > 20 ? quote.slice(0, 20) + '...' : quote

  const { mutate: pinMessage, isSuccess: isPinSuccess } = usePinMessage()
  const { mutate: unPinMessage, isSuccess: isUnPinSuccess } = useUnPinMessage()

  const handlePin = () => {
    if (!fixedMessage) {
      pinMessage({ productId, assistantId })

      setFixedMessage({ messageId: message.id, content: message.content })
    } else {
      unPinMessage(productId)
      setFixedMessage(null)

      if (fixedMessage.messageId !== message.id) {
        pinMessage({ productId, assistantId })
        setFixedMessage({ messageId: message.id, content: message.content })
      }
    }

    if (isPinSuccess || isUnPinSuccess) {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FIXED_MESSAGE, productId] })
    }
  }

  const handleSubmitFeedback = (isGood: boolean) => {
    if (isGood) {
      submitFeedback({
        assistantId,
        formData: {
          isGood,
        },
      })
    } else {
      // TODO: 피드백 입력창 디자인 추가되면 수정
    }
  }

  const handleChatMessageSelect = (index: number) => {
    setInputMode('search')
    setSelectedIndex(index)
  }

  return (
    <div
      className={cx('assistant-message')}
      onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      <div
        onClick={() => handleChatMessageSelect(index)}
        className={cx('assistant-message__body', {
          'assistant-message__body--selected': selectedIndex === index,
        })}
      >
        {quote && (
          <div className={cx('assistant-message__body-meta')}>
            <blockquote>{ellipsisQuote}</blockquote>
          </div>
        )}
        <div className={cx('assistant-message__body-content')}>
          <ReactMarkdown rehypePlugins={[rehypeSanitize, rehypeHighlight]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
      <div className={cx('assistant-message__footer')}>
        {isMouseOver && inputMode === 'input' && (
          <>
            <button type="button" onClick={handlePin}>
              <BsFillPinFill color="#CCCCCC" size={20} />
            </button>
            {type === 'chat' && (
              <>
                <button type="button" onClick={() => handleSubmitFeedback(true)}>
                  <LuThumbsUp color="#CCCCCC" size={20} />
                </button>
                <button type="button" onClick={() => handleSubmitFeedback(false)}>
                  <LuThumbsDown color="#CCCCCC" size={20} />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

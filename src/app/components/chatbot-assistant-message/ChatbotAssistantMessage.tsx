'use client'

import { useState } from 'react'

import { QueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { useAtom, useSetAtom } from 'jotai'
import { BsFillPinFill } from 'react-icons/bs'
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu'
import { chatbotFixedMessageAtom } from 'store/chatbotFixedMessageAtom'
import { chatbotModeAtom } from 'store/chatbotModeAtom'

import { usePinMessage } from '@hooks/chatbot/usePinMessage'
import { useSubmitFeedback } from '@hooks/chatbot/useSubmitFeedback'
import { useUnPinMessage } from '@hooks/chatbot/useUnPinMessage'

import classNames from 'classnames/bind'

import styles from './ChatbotAssistantMessage.module.scss'

const cx = classNames.bind(styles)

interface ChatbotAssistantMessageProps {
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
  assistantId,
  type,
  quote,
  message,
}: ChatbotAssistantMessageProps) {
  const queryClient = new QueryClient()

  const [isMouseOver, setIsMouseOver] = useState(false)

  const [fixedMessage, setFixedMessage] = useAtom(chatbotFixedMessageAtom)
  const setChatbotMode = useSetAtom(chatbotModeAtom)

  const { mutate: submitFeedback } = useSubmitFeedback()

  // TODO: 작품 ID 전역 변수에 저장 필요
  const productId = '0196197e-cb29-7798-ae3f-88a1fbb9aed0'

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

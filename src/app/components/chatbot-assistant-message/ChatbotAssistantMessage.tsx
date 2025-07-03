'use client'

import { useState } from 'react'

import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import 'highlight.js/styles/github.css'
import { useAtom, useAtomValue } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { BsFillPinFill } from 'react-icons/bs'
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import { chatInputModeAtom } from 'store/chatInputModeAtom'
import { chatbotFixedMessageAtom } from 'store/chatbotFixedMessageAtom'
import { chatbotSelectedIndexAtom } from 'store/chatbotSelectedIndexAtom'
import { productIdAtom } from 'store/productsAtoms'
import { FeedbackOptionType } from 'types/chatbot/chatbot'

import NegativeFeedbackSelectMenu from '@components/negative-feedback-select-menu/NegativeFeedbackSelectMenu'
import { useToast } from '@components/toast/ToastProvider'

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
    sources?: string[]
  }
}

const NAGATIVE_FEEDBACK_MENU: { feedbackType: FeedbackOptionType; title: string }[] = [
  {
    feedbackType: 'AWKWARD_SENTENCE',
    title: '어색한 문장',
  },
  {
    feedbackType: 'INACCURATE_INFO',
    title: '부정확한 정보',
  },
  {
    feedbackType: 'UNAPPLIED_SETTING',
    title: '설정 미반영',
  },
  {
    feedbackType: 'ETC',
    title: '기타 (직접 입력)',
  },
]

export default function ChatbotAssistantMessage({
  index,
  assistantId,
  type,
  quote,
  message,
}: ChatbotAssistantMessageProps) {
  const queryClient = new QueryClient()

  const showToast = useToast()

  const [isMouseOver, setIsMouseOver] = useState(false)
  const [isFeedbackMenuOpen, setIsFeedbackMenuOpen] = useState(false)

  const [selectedIndex, setSelectedIndex] = useAtom(chatbotSelectedIndexAtom)
  const [fixedMessage, setFixedMessage] = useAtom(chatbotFixedMessageAtom)
  const [inputMode, setInputMode] = useAtom(chatInputModeAtom)
  const productId = useAtomValue(productIdAtom)

  const { mutate: submitFeedback } = useSubmitFeedback({
    onSuccess: () => {
      trackEvent('ai_feedback_rating', {
        rating_score: true,
      })
      showToast('success', TOAST_MESSAGE.SUCCESS_SUBMIT_FEEDBACK)
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast('warning', error.response?.data.message)
      }
    },
  })

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
      setIsFeedbackMenuOpen(false)
      submitFeedback({
        assistantId,
        formData: {
          isGood,
        },
      })
    } else {
      setIsFeedbackMenuOpen(!isFeedbackMenuOpen)
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
        {message.sources && message.sources.length > 0 && (
          <div className={cx('assistant-message__body-source')}>
            <span>출처: </span>
            {message.sources.map((source, idx) => (
              <>
                <a href={source} target="_blank" onClick={(e) => e.stopPropagation()}>
                  [{idx + 1}]
                </a>
              </>
            ))}
          </div>
        )}
      </div>
      <div className={cx('assistant-message__footer')}>
        {(isMouseOver || isFeedbackMenuOpen) && inputMode === 'input' && (
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
      {inputMode === 'input' && isFeedbackMenuOpen && (
        <NegativeFeedbackSelectMenu>
          {NAGATIVE_FEEDBACK_MENU.map(({ feedbackType, title }, idx) => (
            <NegativeFeedbackSelectMenu.Option
              key={idx}
              assistantId={assistantId}
              feedbackType={feedbackType}
              title={title}
              onClick={() => setIsFeedbackMenuOpen(false)}
            />
          ))}
        </NegativeFeedbackSelectMenu>
      )}
    </div>
  )
}

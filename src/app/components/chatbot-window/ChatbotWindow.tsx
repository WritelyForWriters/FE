/**
 * AI 어시스턴트 인터페이스 2 채팅 화면
 * @author 선우
 */
import Image from 'next/image'

import { useEffect, useState } from 'react'

import { CHATBOT_DEFAULT_SIZE } from 'constants/chatbot/number'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import { Direction } from 're-resizable/lib/resizer'
import { FiInfo } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { Rnd } from 'react-rnd'
import { chatbotAbsolutePositionAtom } from 'store/chatbotAbsolutePositionAtom'
import { chatbotFixedMessageAtom } from 'store/chatbotFixedMessageAtom'
import { chatbotRelativePositionAtom } from 'store/chatbotRelativePositionAtom'
import { isChatbotOpenAtom } from 'store/isChatbotOpenAtom'

import ChatbotChatInput from '@components/chatbot-chat-input/ChatbotChatInput'
import ChatbotMessageList from '@components/chatbot-message-list/ChatbotMessageList'
import ExpandableContentBox from '@components/expandable-content-box/ExpandableContentBox'

import classNames from 'classnames/bind'

import styles from './ChatbotWindow.module.scss'

const cx = classNames.bind(styles)

type ResizeDirection = Direction

export default function ChatbotWindow() {
  const [chatbotSize, setChatbotSize] = useState(CHATBOT_DEFAULT_SIZE)

  const [isChatbotOpen, setIsChatbotOpen] = useAtom(isChatbotOpenAtom)
  const [chatbotAbsolutePosition, setChatbotAbsolutePosition] = useAtom(chatbotAbsolutePositionAtom)

  const chatbotRelativePosition = useAtomValue(chatbotRelativePositionAtom)
  const chatbotFixedMessage = useAtomValue(chatbotFixedMessageAtom)

  useEffect(() => {
    const updateChatbotPositionFromRatio = () => {
      const x = chatbotRelativePosition.xRatio * window.innerWidth
      const y = chatbotRelativePosition.yRatio * window.innerHeight

      setChatbotAbsolutePosition({ x, y })
      setChatbotSize({
        width: CHATBOT_DEFAULT_SIZE.width,
        height: CHATBOT_DEFAULT_SIZE.height,
      })
    }

    updateChatbotPositionFromRatio()

    window.addEventListener('resize', updateChatbotPositionFromRatio)

    return () => window.removeEventListener('resize', updateChatbotPositionFromRatio)
  }, [chatbotRelativePosition, setChatbotAbsolutePosition])

  const handleResizeStop = (
    _e: MouseEvent | TouchEvent,
    direction: ResizeDirection,
    ref: HTMLElement,
    delta: { width: number; height: number },
  ) => {
    setChatbotSize({ width: ref.offsetWidth, height: ref.offsetHeight })

    if (direction.includes('left') || direction.includes('top')) {
      setChatbotAbsolutePosition((prev) => {
        const newX = direction.includes('left') ? prev.x - delta.width : prev.x
        const newY = direction.includes('top') ? prev.y - delta.height : prev.y
        return { x: newX, y: newY }
      })
    }
  }

  const handleCloseClick = () => setIsChatbotOpen(false)

  return (
    <AnimatePresence>
      {isChatbotOpen && (
        <Rnd
          position={chatbotAbsolutePosition}
          bounds="window"
          enableResizing={true}
          disableDragging={true}
          default={{
            x: chatbotAbsolutePosition.x,
            y: chatbotAbsolutePosition.y,
            width: CHATBOT_DEFAULT_SIZE.width,
            height: CHATBOT_DEFAULT_SIZE.height,
          }}
          size={{ width: chatbotSize.width, height: chatbotSize.height }}
          onResizeStop={handleResizeStop}
          style={{ zIndex: 1000, position: 'fixed' }}
        >
          <motion.div
            className={cx('chatbot-window')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <div className={cx('chatbot-window__header')}>
              <div className={cx('chatbot-window__header-content')}>
                <p>챗봇</p>
                {/* TODO: 아이콘 클릭 시 노션 페이지로 이동 */}
                <button type="button">
                  <FiInfo size={20} color="#CCCCCC" />
                </button>
              </div>
              <button type="button" onClick={handleCloseClick}>
                <IoClose size={20} color="#1A1A1A" />
              </button>
            </div>
            <div className={cx('chatbot-window__body')}>
              {chatbotFixedMessage && (
                <ExpandableContentBox
                  leftIcon={<Image src="/icons/pin.svg" alt="고정" width={20} height={20} />}
                >
                  <p>{chatbotFixedMessage.content}</p>
                </ExpandableContentBox>
              )}
              <ChatbotMessageList />
            </div>
            <div className={cx('chatbot-window__footer')}>
              <ChatbotChatInput />
            </div>
          </motion.div>
        </Rnd>
      )}
    </AnimatePresence>
  )
}

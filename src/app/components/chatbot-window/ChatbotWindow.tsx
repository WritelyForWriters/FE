/**
 * AI 어시스턴트 인터페이스 2 채팅 화면
 * @author 선우
 */
import Image from 'next/image'

import { useEffect } from 'react'

import { CHATBOT_DEFAULT_SIZE } from 'constants/chatbot/number'
import { CHATBOT_URLS } from 'constants/chatbot/urls'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import { Direction } from 're-resizable/lib/resizer'
import { DraggableEvent } from 'react-draggable'
import { FiInfo } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { DraggableData, Rnd } from 'react-rnd'
import { chatbotAbsolutePositionAtom } from 'store/chatbotAbsolutePositionAtom'
import { chatbotFixedMessageAtom } from 'store/chatbotFixedMessageAtom'
import { chatbotRelativePositionAtom } from 'store/chatbotRelativePositionAtom'
import { isChatbotOpenAtom } from 'store/isChatbotOpenAtom'

import ChatbotChatInput from '@components/chatbot-chat-input/ChatbotChatInput'
import ChatbotMessageList from '@components/chatbot-message-list/ChatbotMessageList'
import ExpandableContentBox from '@components/expandable-content-box/ExpandableContentBox'

import { chatbotAbsoluteSizeAtom } from './../../store/chatbotAbsoluteSizeAtom'
import { chatbotRelativeSizeAtom } from './../../store/chatbotRelativeSizeAtom'

import classNames from 'classnames/bind'

import styles from './ChatbotWindow.module.scss'

const cx = classNames.bind(styles)

type ResizeDirection = Direction

export default function ChatbotWindow() {
  const innerWidth = window.innerWidth
  const innerHeight = window.innerHeight

  const [isChatbotOpen, setIsChatbotOpen] = useAtom(isChatbotOpenAtom)

  const [chatbotRelativeSize, setChatbotRelativeSize] = useAtom(chatbotRelativeSizeAtom)
  const [chatbotRelativePosition, setChatbotRelativePosition] = useAtom(chatbotRelativePositionAtom)

  const [chatbotAbsoluteSize, setChatbotAbsoluteSize] = useAtom(chatbotAbsoluteSizeAtom)
  const [chatbotAbsolutePosition, setChatbotAbsolutePosition] = useAtom(chatbotAbsolutePositionAtom)

  const chatbotFixedMessage = useAtomValue(chatbotFixedMessageAtom)

  useEffect(() => {
    const updateSizeAndPositionFromRatio = () => {
      setChatbotAbsoluteSize({
        width: innerWidth * chatbotRelativeSize.widthRatio,
        height: innerHeight * chatbotRelativeSize.heightRatio,
      })

      setChatbotAbsolutePosition({
        x: innerWidth * chatbotRelativePosition.xRatio,
        y: innerHeight * chatbotRelativePosition.yRatio,
      })
    }

    updateSizeAndPositionFromRatio()
    window.addEventListener('resize', updateSizeAndPositionFromRatio)

    return () => window.removeEventListener('resize', updateSizeAndPositionFromRatio)
  }, [
    chatbotRelativeSize,
    chatbotRelativePosition,
    innerWidth,
    innerHeight,
    setChatbotAbsolutePosition,
    setChatbotAbsoluteSize,
  ])

  const handleResizeStop = (
    _e: MouseEvent | TouchEvent,
    direction: ResizeDirection,
    ref: HTMLElement,
    delta: { width: number; height: number },
  ) => {
    const newWidth = ref.offsetWidth
    const newHeight = ref.offsetHeight

    setChatbotAbsoluteSize({ width: newWidth, height: newHeight })

    setChatbotRelativeSize({
      widthRatio: newWidth / innerWidth,
      heightRatio: newHeight / innerHeight,
    })

    if (direction.includes('left') || direction.includes('top')) {
      setChatbotAbsolutePosition((prev) => {
        const newX = direction.includes('left') ? prev.x - delta.width : prev.x
        const newY = direction.includes('top') ? prev.y - delta.height : prev.y

        setChatbotRelativePosition({
          xRatio: newX / innerWidth,
          yRatio: newY / innerHeight,
        })

        return { x: newX, y: newY }
      })
    }
  }

  const handleDragStop = (_: DraggableEvent, data: DraggableData) => {
    setChatbotAbsolutePosition({
      x: data.x,
      y: data.y,
    })

    setChatbotRelativePosition({
      xRatio: data.x / innerWidth,
      yRatio: data.y / innerHeight,
    })
  }

  const handleCloseClick = () => setIsChatbotOpen(false)

  return (
    <>
      {isChatbotOpen && (
        <Rnd
          bounds="window"
          dragAxis="both"
          dragHandleClassName="drag-handle"
          enableResizing
          position={chatbotAbsolutePosition}
          size={{
            width: chatbotAbsoluteSize.width,
            height: chatbotAbsoluteSize.height,
          }}
          default={{
            x: chatbotAbsolutePosition.x,
            y: chatbotAbsolutePosition.y,
            width: chatbotAbsoluteSize.width,
            height: chatbotAbsoluteSize.height,
          }}
          minWidth={CHATBOT_DEFAULT_SIZE.width}
          minHeight={CHATBOT_DEFAULT_SIZE.height}
          onResizeStop={handleResizeStop}
          onDragStop={handleDragStop}
          style={{
            position: 'fixed',
            zIndex: 1000,
          }}
        >
          <AnimatePresence>
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
              <div className={cx('chatbot-window__header', { 'drag-handle': true })}>
                <div className={cx('chatbot-window__header-content')}>
                  <p>챗봇</p>
                  <button
                    type="button"
                    onClick={() => window.open(CHATBOT_URLS.HOW_TO_USE, '_blank')}
                  >
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
          </AnimatePresence>
        </Rnd>
      )}
    </>
  )
}

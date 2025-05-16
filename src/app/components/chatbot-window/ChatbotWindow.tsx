/**
 * AI 어시스턴트 인터페이스 2 채팅 화면
 * @author 선우
 */
import Image from 'next/image'

import { useEffect, useRef, useState } from 'react'

import { CHATBOT_DEFAULT_SIZE } from 'constants/chatbot/number'
import { CHATBOT_URLS } from 'constants/chatbot/urls'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Direction } from 're-resizable/lib/resizer'
import { DraggableEvent } from 'react-draggable'
import { FiInfo } from 'react-icons/fi'
import { IoIosArrowBack } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { DraggableData, Rnd } from 'react-rnd'
import { chatInputModeAtom } from 'store/chatInputModeAtom'
import { chatbotAbsolutePositionAtom } from 'store/chatbotAbsolutePositionAtom'
import { chatbotFixedMessageAtom } from 'store/chatbotFixedMessageAtom'
import { chatbotRelativePositionAtom } from 'store/chatbotRelativePositionAtom'
import { chatbotSelectedIndexAtom } from 'store/chatbotSelectedIndexAtom'
import { isChatbotOpenAtom } from 'store/isChatbotOpenAtom'
import { productIdAtom } from 'store/productsAtoms'

import ChatbotChatInput from '@components/chatbot-chat-input/ChatbotChatInput'
import ChatbotMessageList from '@components/chatbot-message-list/ChatbotMessageList'
import ExpandableContentBox from '@components/expandable-content-box/ExpandableContentBox'

import { useGetInfiniteAssistantHistory } from '@hooks/chatbot/useGetAssistantHistoryInfinite'

import { computeRelativePosition } from '@utils/computeRelativePosition'

import { chatbotAbsoluteSizeAtom } from './../../store/chatbotAbsoluteSizeAtom'
import { chatbotRelativeSizeAtom } from './../../store/chatbotRelativeSizeAtom'

import classNames from 'classnames/bind'

import styles from './ChatbotWindow.module.scss'

const cx = classNames.bind(styles)

type ResizeDirection = Direction

export default function ChatbotWindow() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [isChatbotOpen, setIsChatbotOpen] = useAtom(isChatbotOpenAtom)

  const [chatbotRelativeSize, setChatbotRelativeSize] = useAtom(chatbotRelativeSizeAtom)
  const [chatbotRelativePosition, setChatbotRelativePosition] = useAtom(chatbotRelativePositionAtom)

  const [chatbotAbsoluteSize, setChatbotAbsoluteSize] = useAtom(chatbotAbsoluteSizeAtom)
  const [chatbotAbsolutePosition, setChatbotAbsolutePosition] = useAtom(chatbotAbsolutePositionAtom)

  const [inputMode, setInputMode] = useAtom(chatInputModeAtom) // 입력 모드 | 탐색 모드

  const setSelectedIndex = useSetAtom(chatbotSelectedIndexAtom)

  const productId = useAtomValue(productIdAtom)
  const chatbotFixedMessage = useAtomValue(chatbotFixedMessageAtom)

  const { fetchNextPage } = useGetInfiniteAssistantHistory(productId)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const { width, height } = windowSize

    setChatbotAbsoluteSize({
      width: width * chatbotRelativeSize.widthRatio,
      height: height * chatbotRelativeSize.heightRatio,
    })

    setChatbotAbsolutePosition({
      x: width * chatbotRelativePosition.xRatio,
      y: height * chatbotRelativePosition.yRatio,
    })
  }, [
    chatbotRelativeSize,
    chatbotRelativePosition,
    windowSize,
    setChatbotAbsolutePosition,
    setChatbotAbsoluteSize,
  ])

  const handleScroll = async () => {
    const container = containerRef.current
    if (container && container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
      fetchNextPage()
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)

    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleResizeStop = (
    _e: MouseEvent | TouchEvent,
    direction: ResizeDirection,
    ref: HTMLElement,
    delta: { width: number; height: number },
  ) => {
    const { width, height } = windowSize

    const newWidth = ref.offsetWidth
    const newHeight = ref.offsetHeight

    setChatbotAbsoluteSize({ width: newWidth, height: newHeight })

    setChatbotRelativeSize({
      widthRatio: newWidth / width,
      heightRatio: newHeight / height,
    })

    if (direction.includes('left') || direction.includes('top')) {
      setChatbotAbsolutePosition((prev) => {
        const newX = direction.includes('left') ? prev.x - delta.width : prev.x
        const newY = direction.includes('top') ? prev.y - delta.height : prev.y

        setChatbotRelativePosition(computeRelativePosition(newX, newY, width, height))

        return { x: newX, y: newY }
      })
    }
  }

  const handleDragStop = (_: DraggableEvent, data: DraggableData) => {
    const { width, height } = windowSize

    setChatbotAbsolutePosition({
      x: data.x,
      y: data.y,
    })

    setChatbotRelativePosition(computeRelativePosition(data.x, data.y, width, height))
  }

  const handleCloseClick = () => setIsChatbotOpen(false)

  const handleBackClick = () => {
    setInputMode('input')
    setSelectedIndex(-1)
  }

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
                  {inputMode === 'input' ? (
                    <>
                      <p>챗봇</p>
                      <button
                        type="button"
                        onClick={() => window.open(CHATBOT_URLS.HOW_TO_USE, '_blank')}
                      >
                        <FiInfo size={20} color="#CCCCCC" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={handleBackClick}>
                        <IoIosArrowBack size={20} color="#1A1A1A" />
                      </button>
                      <p>탐색 모드</p>
                    </>
                  )}
                </div>
                <button type="button" onClick={handleCloseClick}>
                  <IoClose size={20} color="#1A1A1A" />
                </button>
              </div>
              <div ref={containerRef} className={cx('chatbot-window__body')}>
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

/**
 * AI 어시스턴트 인터페이스 2 Favicon
 * @author 선우
 */
import Image from 'next/image'

import { useEffect, useState } from 'react'

import { useAtom, useSetAtom } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { DraggableEvent } from 'react-draggable'
import { Rnd } from 'react-rnd'
import { chatbotAbsolutePositionAtom } from 'store/chatbotAbsolutePositionAtom'
import { chatbotRelativePositionAtom } from 'store/chatbotRelativePositionAtom'
import { faviconRelativePositionAtom } from 'store/faviconRelativePositionAtom'
import { isChatbotOpenAtom } from 'store/isChatbotOpenAtom'

import Favicon from '@components/favicon/Favicon'

import { computeChatbotAbsolutePosition } from '@utils/computeChatbotPosition'
import { computeRelativePosition } from '@utils/computeRelativePosition'

import classNames from 'classnames/bind'

import styles from './ChatbotFloatingFavicon.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotFloatingFavicon() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [faviconAbsolutePosition, setFaviconAbsolutePosition] = useState({ x: 0, y: 0 })

  const [faviconRelativePosition, setFaviconRelativePosition] = useAtom(faviconRelativePositionAtom)

  const setIsChatbotOpen = useSetAtom(isChatbotOpenAtom)
  const setChatbotAbsolutePosition = useSetAtom(chatbotAbsolutePositionAtom)
  const setChatbotRelativePosition = useSetAtom(chatbotRelativePositionAtom)

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const { width, height } = windowSize

    const x = faviconRelativePosition.xRatio * width
    const y = faviconRelativePosition.yRatio * height

    setFaviconAbsolutePosition({ x, y })

    const { x: chatbotX, y: chatbotY } = computeChatbotAbsolutePosition(x, y, width, height)

    setChatbotAbsolutePosition({ x: chatbotX, y: chatbotY })
    setChatbotRelativePosition(computeRelativePosition(chatbotX, chatbotY, width, height))
  }, [faviconRelativePosition, windowSize])

  const handleDragStop = (_: DraggableEvent, data: { x: number; y: number }) => {
    const { width, height } = windowSize

    setFaviconAbsolutePosition({ x: data.x, y: data.y })
    setFaviconRelativePosition(computeRelativePosition(data.x, data.y, width, height))

    const { x: chatbotX, y: chatbotY } = computeChatbotAbsolutePosition(
      data.x,
      data.y,
      width,
      height,
    )

    setChatbotAbsolutePosition({ x: chatbotX, y: chatbotY })
    setChatbotRelativePosition(computeRelativePosition(chatbotX, chatbotY, width, height))
  }

  const handleChatbotOpen = () => {
    trackEvent('free_chat_button_click', {
      button_name: '자유 대화',
    })
    setIsChatbotOpen(true)
  }

  return (
    <Rnd
      position={faviconAbsolutePosition}
      onDragStop={handleDragStop}
      enableResizing={false}
      bounds="parent"
      dragHandleClassName="drag-handle"
      style={{
        pointerEvents: 'auto',
      }}
    >
      <div className={cx('favicon-wrapper')}>
        <Favicon onClick={handleChatbotOpen}>
          <Image src="/icons/chat.svg" alt="chatbot favicon" width={20} height={18} />
        </Favicon>
        <div className="drag-handle" style={{ width: 20, height: 56, cursor: 'move' }}></div>
      </div>
    </Rnd>
  )
}

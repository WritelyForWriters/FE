/**
 * AI 어시스턴트 인터페이스 2 Favicon
 * @author 선우
 */
import Image from 'next/image'

import { useEffect, useState } from 'react'

import { useAtom, useSetAtom } from 'jotai'
import { DraggableEvent } from 'react-draggable'
import { Rnd } from 'react-rnd'
import { chatbotAbsolutePositionAtom } from 'store/chatbotAbsolutePositionAtom'
import { chatbotRelativePositionAtom } from 'store/chatbotRelativePositionAtom'
import { faviconRelativePositionAtom } from 'store/faviconRelativePositionAtom'
import { isChatbotOpenAtom } from 'store/isChatbotOpenAtom'

import Favicon from '@components/favicon/Favicon'

import { computeChatbotAbsolutePosition } from '@utils/computeChatbotPosition'

import classNames from 'classnames/bind'

import styles from './ChatbotFloatingFavicon.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotFloatingFavicon() {
  const innerWidth = window.innerWidth
  const innerHeight = window.innerHeight

  const [isLoading, setIsLoading] = useState(true)
  const [faviconAbsolutePosition, setFaviconAbsolutePosition] = useState({ x: 0, y: 0 })

  const [faviconRelativePosition, setFaviconRelativePosition] = useAtom(faviconRelativePositionAtom)

  const setIsChatbotOpen = useSetAtom(isChatbotOpenAtom)
  const setChatbotAbsolutePosition = useSetAtom(chatbotAbsolutePositionAtom)
  const setChatbotRelativePosition = useSetAtom(chatbotRelativePositionAtom)

  useEffect(() => {
    const recalculatePosition = () => {
      const x = faviconRelativePosition.xRatio * innerWidth
      const y = faviconRelativePosition.yRatio * window.innerHeight

      setFaviconAbsolutePosition({ x, y })
      setChatbotAbsolutePosition(computeChatbotAbsolutePosition(x, y, innerWidth, innerHeight))
    }

    recalculatePosition()

    window.addEventListener('resize', recalculatePosition)
    setIsLoading(false)

    return () => window.removeEventListener('resize', recalculatePosition)
  }, [faviconRelativePosition, setChatbotAbsolutePosition])

  const handleDragStop = (_: DraggableEvent, data: { x: number; y: number }) => {
    setFaviconAbsolutePosition({ x: data.x, y: data.y })

    const faviconXRatio = data.x / innerWidth
    const faviconYRatio = data.y / innerHeight
    setFaviconRelativePosition({ xRatio: faviconXRatio, yRatio: faviconYRatio })

    const { x: chatbotX, y: chatbotY } = computeChatbotAbsolutePosition(
      data.x,
      data.y,
      innerWidth,
      innerHeight,
    )
    setChatbotAbsolutePosition({ x: chatbotX, y: chatbotY })

    const chatbotXRatio = chatbotX / innerWidth
    const chatbotYRatio = chatbotY / innerHeight
    setChatbotRelativePosition({ xRatio: chatbotXRatio, yRatio: chatbotYRatio })
  }

  if (!isLoading) {
    return (
      <Rnd
        position={faviconAbsolutePosition}
        onDragStop={handleDragStop}
        enableResizing={false}
        bounds="window"
        dragHandleClassName="drag-handle"
      >
        <div className={cx('favicon-wrapper')}>
          <Favicon onClick={() => setIsChatbotOpen(true)}>
            <Image src="/icons/chat.svg" alt="chatbot favicon" width={20} height={18} />
          </Favicon>
          <div className="drag-handle" style={{ width: 20, height: 56, cursor: 'move' }}></div>
        </div>
      </Rnd>
    )
  }
}

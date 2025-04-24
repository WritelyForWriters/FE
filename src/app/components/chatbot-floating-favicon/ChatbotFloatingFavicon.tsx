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

export default function ChatbotFloatingFavicon() {
  const [isLoading, setIsLoading] = useState(true)
  const [faviconAbsolutePosition, setFaviconAbsolutePosition] = useState({ x: 0, y: 0 })

  const [faviconRelativePosition, setFaviconRelativePosition] = useAtom(faviconRelativePositionAtom)

  const setIsChatbotOpen = useSetAtom(isChatbotOpenAtom)
  const setChatbotAbsolutePosition = useSetAtom(chatbotAbsolutePositionAtom)
  const setChatbotRelativePosition = useSetAtom(chatbotRelativePositionAtom)

  useEffect(() => {
    const recalculatePosition = () => {
      const x = faviconRelativePosition.xRatio * window.innerWidth
      const y = faviconRelativePosition.yRatio * window.innerHeight

      setFaviconAbsolutePosition({ x, y })
      setChatbotAbsolutePosition(computeChatbotAbsolutePosition(x, y))
    }

    recalculatePosition()

    window.addEventListener('resize', recalculatePosition)
    setIsLoading(false)

    return () => window.removeEventListener('resize', recalculatePosition)
  }, [faviconRelativePosition, setChatbotAbsolutePosition])

  const handleDragStop = (_: DraggableEvent, data: { x: number; y: number }) => {
    setFaviconAbsolutePosition({ x: data.x, y: data.y })

    const faviconXRatio = data.x / window.innerWidth
    const faviconYRatio = data.y / window.innerHeight
    setFaviconRelativePosition({ xRatio: faviconXRatio, yRatio: faviconYRatio })

    const { x: chatbotX, y: chatbotY } = computeChatbotAbsolutePosition(data.x, data.y)
    setChatbotAbsolutePosition({ x: chatbotX, y: chatbotY })

    const chatbotXRatio = chatbotX / window.innerWidth
    const chatbotYRatio = chatbotY / window.innerHeight
    setChatbotRelativePosition({ xRatio: chatbotXRatio, yRatio: chatbotYRatio })
  }

  if (!isLoading) {
    return (
      <Rnd
        position={faviconAbsolutePosition}
        size={{ width: 88, height: 88 }}
        onDragStop={handleDragStop}
        enableResizing={false}
        bounds="window"
      >
        <Favicon onClick={() => setIsChatbotOpen(true)}>
          <Image src="/icons/chat.svg" alt="chatbot favicon" width={20} height={18} />
        </Favicon>
      </Rnd>
    )
  }
}

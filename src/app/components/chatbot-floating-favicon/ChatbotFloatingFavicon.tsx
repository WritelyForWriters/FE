/**
 * AI 어시스턴트 인터페이스 2 Favicon
 * @author 선우
 */
import Image from 'next/image'

import { useEffect, useState } from 'react'

import { useAtom, useSetAtom } from 'jotai'
import { DraggableEvent } from 'react-draggable'
import { Rnd } from 'react-rnd'
import { chatbotPositionAtom } from 'store/chatbotPositionAtom'
import { favicionPositionAtom } from 'store/faviconRelativePosition'
import { isChatbotOpenAtom } from 'store/isChatbotOpenAtom'

import Favicon from '@components/favicon/Favicon'

import { computeChatbotPosition } from '@utils/computeChatbotPosition'

export default function ChatbotFloatingFavicon() {
  const [isLoading, setIsLoading] = useState(true)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const [relativePosition, setRelativePosition] = useAtom(favicionPositionAtom)
  const setIsChatbotOpen = useSetAtom(isChatbotOpenAtom)
  const setChatbotPosition = useSetAtom(chatbotPositionAtom)

  const recalculatePosition = () => {
    const x = relativePosition.xRatio * window.innerWidth
    const y = relativePosition.yRatio * window.innerHeight

    setPosition({ x, y })
    setChatbotPosition(computeChatbotPosition(x, y))
  }

  useEffect(() => {
    recalculatePosition()

    setIsLoading(false)
    window.addEventListener('resize', recalculatePosition)
    return () => window.removeEventListener('resize', recalculatePosition)
  }, [])

  const handleDragStop = (_: DraggableEvent, data: { x: number; y: number }) => {
    const xRatio = data.x / window.innerWidth
    const yRatio = data.y / window.innerHeight

    setPosition({ x: data.x, y: data.y })
    setRelativePosition({ xRatio, yRatio })
    setChatbotPosition(computeChatbotPosition(data.x, data.y))
  }

  if (!isLoading) {
    return (
      <Rnd
        position={position}
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

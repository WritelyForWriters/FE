'use client'

import { useSetAtom } from 'jotai'
import { chatbotFixedMessageAtom } from 'store/chatbotFixedMessageAtom'

import ChatbotLauncher from '@components/chatbot-launcher/ChatbotLauncher'

import { useGetFixedMessage } from '@hooks/chatbot/useGetFixedMessage'

/**
 * TODO
 * [ ] UI 점검
 * [ ] 인가 처리 -> 로그인 기능 완료 후
 * [ ] 로그인 여부에 따른 버튼 UI -> 로그인 기능 완료 후
 */

export default function Home() {
  const setFixedMessage = useSetAtom(chatbotFixedMessageAtom)

  // TODO: 작품 ID 전역 변수에 저장 필요
  const productId = '0196197e-cb29-7798-ae3f-88a1fbb9aed0'

  const { data: fixedMessage } = useGetFixedMessage(productId)

  if (fixedMessage?.result) {
    setFixedMessage({
      messageId: fixedMessage.result.messageId,
      content: fixedMessage.result.content,
    })
  }

  return (
    <div style={{ width: 400 }}>
      <ChatbotLauncher />
    </div>
  )
}

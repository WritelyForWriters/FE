import { ChatItem } from 'types/chatbot/chatbot'

import ChatbotChatItem from '@components/chatbot-chat-item/ChatbotChatItem'

import { useGetAssistantHistory } from '@hooks/chatbot/useGetAssistantHistory'

export default function ChatbotChatItems() {
  // 작품 ID 전역 변수에 저장 필요
  const productId = '0196197e-cb29-7798-ae3f-88a1fbb9aed0'

  const { data } = useGetAssistantHistory(productId)

  const chatHistory = data?.result.contents

  return <>{chatHistory?.map((item: ChatItem) => <ChatbotChatItem key={item.id} {...item} />)}</>
}

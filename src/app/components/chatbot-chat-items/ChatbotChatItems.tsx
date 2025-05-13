import { useAtomValue } from 'jotai'
import { productIdAtom } from 'store/productsAtoms'
import { ChatItem } from 'types/chatbot/chatbot'

import ChatbotChatItem from '@components/chatbot-chat-item/ChatbotChatItem'

import { useGetAssistantHistory } from '@hooks/chatbot/useGetAssistantHistory'

export default function ChatbotChatItems() {
  const productId = useAtomValue(productIdAtom)

  const { data } = useGetAssistantHistory(productId)

  const chatHistory = data?.result.contents

  return <>{chatHistory?.map((item: ChatItem) => <ChatbotChatItem key={item.id} {...item} />)}</>
}

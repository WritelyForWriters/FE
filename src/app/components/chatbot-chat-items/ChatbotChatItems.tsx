import { useEffect, useRef } from 'react'

import { useAtomValue } from 'jotai'
import { chatbotHistoryAtom } from 'store/chatbotHistoryAtom'
import { chatbotSelectedIndexAtom } from 'store/chatbotSelectedIndexAtom'
import { ChatItem } from 'types/chatbot/chatbot'

import ChatbotChatItem from '@components/chatbot-chat-item/ChatbotChatItem'

export default function ChatbotChatItems() {
  const divRefs = useRef<HTMLLIElement[]>([])

  const chatbotHistory = useAtomValue(chatbotHistoryAtom)
  const selectedIndex = useAtomValue(chatbotSelectedIndexAtom)

  useEffect(() => {
    const selectedDiv = divRefs.current[selectedIndex]
    if (selectedDiv) {
      selectedDiv.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedIndex])

  return (
    <>
      {chatbotHistory?.map((item: ChatItem, idx) => (
        <ChatbotChatItem
          key={item.id}
          ref={(el) => {
            if (el) divRefs.current[idx] = el
          }}
          index={idx}
          {...item}
        />
      ))}
    </>
  )
}

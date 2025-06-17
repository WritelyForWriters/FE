import { useAtomValue } from 'jotai'

import ChatbotFloatingFavicon from '@components/chatbot-floating-favicon/ChatbotFloatingFavicon'
import ChatbotWindow from '@components/chatbot-window/ChatbotWindow'

import { isChatbotOpenAtom } from './../../store/isChatbotOpenAtom'

export default function ChatbotLauncher() {
  const isChatbotOpen = useAtomValue(isChatbotOpenAtom)

  return <>{isChatbotOpen ? <ChatbotWindow /> : <ChatbotFloatingFavicon />}</>
}

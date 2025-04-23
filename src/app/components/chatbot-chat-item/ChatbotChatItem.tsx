import { MemberMessageType } from 'types/chatbot/chatbot'

import ChatbotAssistantMessage from '@components/chatbot-assistant-message/ChatbotAssistantMessage'
import ChatbotMemberMessage from '@components/chatbot-member-message/ChatbotMemberMessage'

import classNames from 'classnames/bind'

import styles from './ChatbotChatItem.module.scss'

const cx = classNames.bind(styles)

interface ChatbotChatItemProps {
  id: string
  type: MemberMessageType
  memberMessage: {
    content: string
    prompt: string | null
    isFavoritedPrompt: boolean
  }
  assistantMessage: {
    content: string
    isApplied: boolean
  }
}

export default function ChatbotChatItem({
  id,
  type,
  memberMessage,
  assistantMessage,
}: ChatbotChatItemProps) {
  return (
    <li className={cx('chat-item')}>
      <ChatbotMemberMessage type={type} {...memberMessage} />
      <ChatbotAssistantMessage
        id={id}
        type={type}
        message={assistantMessage}
        quote={memberMessage.content}
      />
    </li>
  )
}

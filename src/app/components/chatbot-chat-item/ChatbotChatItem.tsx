import ChatbotAssistantMessage from '@components/chatbot-assistant-message/ChatbotAssistantMessage'
import ChatbotMemberMessage from '@components/chatbot-member-message/ChatbotMemberMessage'

import classNames from 'classnames/bind'

import styles from './ChatbotChatItem.module.scss'

const cx = classNames.bind(styles)

interface ChatbotChatItemProps {
  type: string
  memberMessage: {
    content: string
    prompt: string | null
  }
  assistantMessage: {
    content: string
    isApplied: boolean
  }
}

export default function ChatbotChatItem({
  type,
  memberMessage,
  assistantMessage,
}: ChatbotChatItemProps) {
  return (
    <div className={cx('chat-item')}>
      <ChatbotMemberMessage type={type} {...memberMessage} />
      <ChatbotAssistantMessage messages={assistantMessage} quote={memberMessage.content} />
    </div>
  )
}

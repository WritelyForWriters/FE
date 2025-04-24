import { ChatItem } from 'types/chatbot/chatbot'

import ChatbotAssistantMessage from '@components/chatbot-assistant-message/ChatbotAssistantMessage'
import ChatbotMemberMessage from '@components/chatbot-member-message/ChatbotMemberMessage'

import classNames from 'classnames/bind'

import styles from './ChatbotChatItem.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotChatItem({ id, type, memberMessage, assistantMessage }: ChatItem) {
  return (
    <li className={cx('chat-item')}>
      <ChatbotMemberMessage assistantId={id} type={type} {...memberMessage} />
      <ChatbotAssistantMessage
        assistantId={id}
        type={type}
        quote={memberMessage.content}
        message={assistantMessage}
      />
    </li>
  )
}

import { forwardRef } from 'react'

import { ChatItem } from 'types/chatbot/chatbot'

import ChatbotAssistantMessage from '@components/chatbot-assistant-message/ChatbotAssistantMessage'
import ChatbotMemberMessage from '@components/chatbot-member-message/ChatbotMemberMessage'

import classNames from 'classnames/bind'

import styles from './ChatbotChatItem.module.scss'

const cx = classNames.bind(styles)

interface ChatbotItemProps extends ChatItem {
  index: number
}

const ChatbotChatItem = forwardRef<HTMLLIElement, ChatbotItemProps>(
  ({ index, id, type, memberMessage, assistantMessage }, ref) => {
    return (
      <li ref={ref} className={cx('chat-item')}>
        <ChatbotMemberMessage assistantId={id} type={type} {...memberMessage} />
        <ChatbotAssistantMessage
          index={index}
          assistantId={id}
          type={type}
          quote={memberMessage.content}
          message={assistantMessage}
        />
      </li>
    )
  },
)

ChatbotChatItem.displayName = 'ChatbotChatItem'
export default ChatbotChatItem

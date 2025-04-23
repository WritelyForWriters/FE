import ChatbotChatItems from '@components/chatbot-chat-items/ChatbotChatItems'

import classNames from 'classnames/bind'

import styles from './ChatbotMessageList.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotMessageList() {
  return (
    <ul className={cx('chatbot-message-list')}>
      <ChatbotChatItems />
    </ul>
  )
}

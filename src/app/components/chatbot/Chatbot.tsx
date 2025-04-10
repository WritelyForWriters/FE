import ChatbotChatItems from '@components/chatbot-chat-items/ChatbotChatItems'

import classNames from 'classnames/bind'

import styles from './Chatbot.module.scss'

const cx = classNames.bind(styles)

export default function Chatbot() {
  return (
    <ul className={cx('chatbot')}>
      <ChatbotChatItems />
    </ul>
  )
}

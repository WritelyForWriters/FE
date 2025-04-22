/**
 * AI 어시스턴트 인터페이스 2 채팅 화면
 * @author 선우
 */
import ChatbotChatInput from '@components/chatbot-chat-input/ChatbotChatInput'
import Chatbot from '@components/chatbot/Chatbot'

import classNames from 'classnames/bind'

import styles from './ChatbotWindow.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotWindow() {
  return (
    <div className={cx('chatbot-window')}>
      <div className={cx('chatbot-window__header')}>
        <div className={cx('chatbot-window__header-content')}>
          <p>챗봇</p>
        </div>
        <button></button>
      </div>
      <div className={cx('chatbot-window__body')}>
        <Chatbot />
      </div>
      <div className={cx('chatbot-window__footer')}>
        <ChatbotChatInput />
      </div>
    </div>
  )
}

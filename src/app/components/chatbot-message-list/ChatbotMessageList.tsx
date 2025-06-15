import Image from 'next/image'

import { useAtomValue } from 'jotai'
import { chatbotIsDelayAtom } from 'store/chatbotIsDelayAtom'
import { isAssistantRespondingAtom } from 'store/isAssistantRespondingAtom'

import ChatbotChatItems from '@components/chatbot-chat-items/ChatbotChatItems'

import classNames from 'classnames/bind'

import styles from './ChatbotMessageList.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotMessageList() {
  const isAssistantResponding = useAtomValue(isAssistantRespondingAtom)
  const chatbotIsDelay = useAtomValue(chatbotIsDelayAtom)

  return (
    <ul className={cx('chatbot-message-list')}>
      <ChatbotChatItems />
      {isAssistantResponding && (
        <div className={cx('loading-indicator')}>
          {chatbotIsDelay
            ? '일부 작업은 시간이 오래 걸릴 수 있습니다. 1분 내에 답변이 생성되니 조금만 기다려주세요!'
            : '생각하는 중'}
          <Image
            alt="loading"
            src="/images/loading.gif"
            width={40}
            height={26}
            style={{
              marginLeft: 8,
            }}
          />
        </div>
      )}
    </ul>
  )
}

import Image from 'next/image'

import { useAtomValue } from 'jotai'
import { isAssistantRespondingAtom } from 'store/isAssistantRespondingAtom'

import ChatbotChatItems from '@components/chatbot-chat-items/ChatbotChatItems'

import classNames from 'classnames/bind'

import styles from './ChatbotMessageList.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotMessageList() {
  const isAssistantResponding = useAtomValue(isAssistantRespondingAtom)

  return (
    <>
      {isAssistantResponding && (
        <div>
          <Image alt="loading" src="/images/loading.gif" width={40} height={26} />
        </div>
      )}
      <ul className={cx('chatbot-message-list')}>
        <ChatbotChatItems />
      </ul>
    </>
  )
}

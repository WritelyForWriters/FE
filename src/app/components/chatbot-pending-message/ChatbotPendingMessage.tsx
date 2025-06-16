import { useAtomValue } from 'jotai'
import { chatbotPendingMessageAtom } from 'store/chatbotPendingMessageAtom'

import classNames from 'classnames/bind'

import styles from './ChatbotPendingMessage.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotPendingMessage() {
  const pendingData = useAtomValue(chatbotPendingMessageAtom)

  if (!pendingData) return

  return (
    <div className={cx('pending-message__wrapper')}>
      {pendingData?.content && (
        <div className={cx('pending-message__content')}>
          <blockquote>{pendingData.content}</blockquote>
        </div>
      )}
      <p>{pendingData!.prompt}</p>
    </div>
  )
}

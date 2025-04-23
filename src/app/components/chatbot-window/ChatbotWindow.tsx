/**
 * AI 어시스턴트 인터페이스 2 채팅 화면
 * @author 선우
 */
import Image from 'next/image'

import { CHATBOT_DEFAULT_SIZE } from 'constants/chatbot/number'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import { FiInfo } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { Rnd } from 'react-rnd'
import { chatbotPositionAtom } from 'store/chatbotPositionAtom'
import { isChatbotOpenAtom } from 'store/isChatbotOpenAtom'

import ChatbotChatInput from '@components/chatbot-chat-input/ChatbotChatInput'
import ChatbotMessageList from '@components/chatbot-message-list/ChatbotMessageList'
import ExpandableContentBox from '@components/expandable-content-box/ExpandableContentBox'

import classNames from 'classnames/bind'

import styles from './ChatbotWindow.module.scss'

const cx = classNames.bind(styles)

export default function ChatbotWindow() {
  const [isChatbotOpen, setIsChatbotOpen] = useAtom(isChatbotOpenAtom)
  const position = useAtomValue(chatbotPositionAtom)

  return (
    <AnimatePresence>
      {isChatbotOpen && (
        <Rnd
          bounds="window"
          enableResizing={true}
          dragAxis="none"
          disableDragging={true}
          default={{
            x: position.x,
            y: position.y,
            width: CHATBOT_DEFAULT_SIZE.width,
            height: CHATBOT_DEFAULT_SIZE.height,
          }}
          style={{ zIndex: 1000, position: 'fixed' }}
        >
          <motion.div
            className={cx('chatbot-window')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25 }}
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <div className={cx('chatbot-window__header')}>
              <div className={cx('chatbot-window__header-content')}>
                <p>챗봇</p>
                <button type="button">
                  <FiInfo size={20} color="#CCCCCC" />
                </button>
              </div>
              {/* TODO: 아이콘 클릭 시 노션 페이지로 이동 */}
              <button type="button" onClick={() => setIsChatbotOpen(false)}>
                <IoClose size={20} color="#1A1A1A" />
              </button>
            </div>
            <div className={cx('chatbot-window__body')}>
              <ExpandableContentBox
                leftIcon={<Image src="/icons/pin.svg" alt="고정" width={20} height={20} />}
              >
                <p>
                  동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세 무궁화 삼천리
                  화려강산
                </p>
              </ExpandableContentBox>
              <ChatbotMessageList />
            </div>
            <div className={cx('chatbot-window__footer')}>
              <ChatbotChatInput />
            </div>
          </motion.div>
        </Rnd>
      )}
    </AnimatePresence>
  )
}

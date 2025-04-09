'use client'

import Image from 'next/image'

import { useState } from 'react'

import { FaStar } from 'react-icons/fa6'

import classNames from 'classnames/bind'

import styles from './ChatbotMemberMessage.module.scss'

const cx = classNames.bind(styles)

interface MemberMessageProps {
  type: string
  prompt: string | null
  content?: string
}

export default function ChatbotMemberMessage({ type, prompt, content }: MemberMessageProps) {
  const [mouseOver, setMouseOver] = useState(false)
  const [isFavorite, setIsFavorite] = useState(true)

  let strType = ''
  let imgSrc = ''

  switch (type) {
    case 'auto modify':
      strType = '자동 수정'
      imgSrc = '/icons/ai-option1.svg'
      break
    case 'user modify':
      strType = '수동 수정'
      imgSrc = '/icons/ai-option2.svg'
      break
    case 'feedback':
      strType = '구간 피드백'
      imgSrc = '/icons/ai-option3.svg'
      break
  }

  return (
    <div
      className={cx('member-message')}
      onMouseOver={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <div className={cx('member-message__body')}>
        {type !== 'chat' && (
          <p className={cx('member-message__type')}>
            <Image src={imgSrc} alt={strType} width={20} height={20} />
            {strType}
          </p>
        )}
        {content && <blockquote>{content}</blockquote>}
        <p className={cx('member-message__content')}>{prompt}</p>
      </div>
      {type === 'chat' && (mouseOver || isFavorite) && (
        <div className={cx('member-message__footer')}>
          <button onClick={() => setIsFavorite(!isFavorite)}>
            <FaStar color={isFavorite ? '#1A1A1A' : '#CCCCCC'} size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

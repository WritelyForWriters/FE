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
  const [isFavorite, setIsFavorite] = useState(false)

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

  const handleFavorite = () => {
    if (isFavorite) {
      // 즐겨찾기 삭제
    } else {
      // 즐겨찾기 추가
    }
    setIsFavorite(!isFavorite)
  }

  return (
    <div
      className={cx('member-message')}
      onMouseOver={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
    >
      <div className={cx('member-message__body')}>
        {(type !== 'chat' || content) && (
          <div className={cx('member-message__meta')}>
            {type !== 'chat' && (
              <p className={cx('member-message__meta-type')}>
                <Image src={imgSrc} alt={strType} width={20} height={20} />
                {strType}
              </p>
            )}
            {content && (
              <div className={cx('member-message__meta-content')}>
                <blockquote>{content}</blockquote>
              </div>
            )}
          </div>
        )}
        <p>{prompt}</p>
      </div>
      {type === 'chat' && (mouseOver || isFavorite) && (
        <div className={cx('member-message__footer')}>
          <button onClick={handleFavorite}>
            <FaStar color={isFavorite ? '#1A1A1A' : '#CCCCCC'} size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

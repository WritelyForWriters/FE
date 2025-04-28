'use client'

import Image from 'next/image'

import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { FaStar } from 'react-icons/fa6'
import { MemberMessageType } from 'types/chatbot/chatbot'

import { useAddFavoriteMessage } from '@hooks/chatbot/useAddFavoriteMessage'
import { useRemoveFavoriteMessage } from '@hooks/chatbot/useRemoveFavoriteMessage'

import classNames from 'classnames/bind'

import styles from './ChatbotMemberMessage.module.scss'

const cx = classNames.bind(styles)

interface MemberMessageProps {
  assistantId: string
  type: MemberMessageType
  id: string
  prompt: string | null
  isFavoritedPrompt: boolean
  content?: string
}

const getMessageMeta = (type: MemberMessageType) => {
  switch (type) {
    case 'auto modify':
      return { strType: '자동 수정', imgSrc: '/icons/ai-option1.svg' }
    case 'user modify':
      return { strType: '수동 수정', imgSrc: '/icons/ai-option2.svg' }
    case 'feedback':
      return { strType: '구간 피드백', imgSrc: '/icons/ai-option3.svg' }
    default:
      return { strType: '', imgSrc: '' }
  }
}

export default function ChatbotMemberMessage({
  assistantId,
  type,
  id,
  prompt,
  isFavoritedPrompt,
  content,
}: MemberMessageProps) {
  const queryClient = useQueryClient()

  const [mouseOver, setMouseOver] = useState(false)
  const [isFavorite, setIsFavorite] = useState(isFavoritedPrompt)

  // TODO: productId 전역 변수에 저장 필요
  const productId = '0196197e-cb29-7798-ae3f-88a1fbb9aed0'
  const { strType, imgSrc } = getMessageMeta(type)

  const { mutate: addFavoriteMessage, isSuccess: isAddSuccess } = useAddFavoriteMessage()
  const { mutate: removeFavoriteMessage, isSuccess: isRemoveSuccess } = useRemoveFavoriteMessage()

  if (isAddSuccess || isRemoveSuccess) {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ASSISTANT_HISTORY, productId] })
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FAVORITE_PROMPTS, productId] })
  }

  const handleFavorite = () => {
    if (isFavorite) {
      removeFavoriteMessage({ productId, messageId: id })
    } else {
      addFavoriteMessage({ productId, assistantId })
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

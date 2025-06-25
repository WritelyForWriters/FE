import Image from 'next/image'

import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType, TextSelectionRangeType } from 'types/common/editor'

import useUpdatePosition from '@hooks/editor/useUpdatePosition'

import FeedbackOptionMenu from './menu/FeedbackOptionMenu'
import PrimaryActionMenu from './menu/PrimaryActionMenu'

import styles from '../DefaultEditor.module.scss'
import promptStyles from '../common/PromptInput.module.scss'

interface FeedbackMenuProps {
  editor: Editor
  selectionRef: RefObject<TextSelectionRangeType | null>
  feedbackText: string | null
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  isFeedbackPromptMenuOpen: boolean
  handleSubmitFeedback: ({ isGood, feedback, feedbackType }: FeedbackFormData) => void
  isPending: boolean
}

// MEMO(Sohyun): ai-assistant 인터페이스 구간 피드백 UI
export default function FeedbackMenu({
  feedback,
  editor,
  selectionRef,
  feedbackText,
  onOptionClick,
  isFeedbackPromptMenuOpen,
  handleSubmitFeedback,
  isPending,
}: FeedbackMenuProps) {
  const position = useUpdatePosition(editor, selectionRef)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [feedbackInput, setFeedbackInput] = useState('')
  const [isShowFeedbackMenu, setIsShowFeedbackMenu] = useState(false)
  const [isShowFeedbackInput, setIsShowFeedbackInput] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFeedbackInput(e.target.value)
  }

  const onSubmitFeedback = (option?: FeedbackOptionType) => () => {
    if (option === 'ETC' && feedbackInput.trim() === '') return

    try {
      handleSubmitFeedback({
        isGood: false,
        feedbackType: option,
        feedback: option === 'ETC' ? feedbackInput : undefined,
      })
      setIsShowFeedbackInput(false)
      setIsShowFeedbackMenu(false)
      setFeedbackInput('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleFeedbackClick = () => {
    handleSubmitFeedback({ isGood: true })
  }

  const handleBadFeedbackClick = () => {
    setIsShowFeedbackMenu(true)
  }

  // textarea 높이 자동 조절
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [feedbackText])

  return (
    <div
      style={{
        width: 200,
        position: 'absolute',
        top: `${position.top}px`,
        left: 10,
        zIndex: 100,
      }}
    >
      {/* TODO 공통 컴포넌트 PromptInput을 사용하기 */}
      <div className={promptStyles['prompt-menu']}>
        {isPending ? (
          <Image alt="loading" src="/images/loading.gif" width={32} height={20} />
        ) : (
          <textarea
            ref={textareaRef}
            readOnly
            value={feedbackText ? feedbackText : ''}
            className={promptStyles['prompt-menu__input']}
          />
        )}
      </div>

      {isFeedbackPromptMenuOpen && (
        <div className={styles['select-menu']}>
          {isShowFeedbackMenu ? (
            <FeedbackOptionMenu
              onSubmitFeedback={onSubmitFeedback}
              isShowFeedbackInput={isShowFeedbackInput}
              setIsShowFeedbackInput={setIsShowFeedbackInput}
              feedbackInput={feedbackInput}
              onFeedbackInputChange={handleChange}
            />
          ) : (
            <PrimaryActionMenu
              onOptionClick={onOptionClick}
              feedback={feedback}
              onFeedbackClick={handleFeedbackClick}
              onBadFeedbackClick={handleBadFeedbackClick}
            />
          )}
        </div>
      )}
    </div>
  )
}

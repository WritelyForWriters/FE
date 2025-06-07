import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType, TextSelectionRangeType } from 'types/common/editor'

import Portal from '@components/modal/Portal'

import useUpdatePosition from '@hooks/editor/useUpdatePosition'

import FeedbackOptionMenu from './menu/FeedbackOptionMenu'
import PrimaryActionMenu from './menu/PrimaryActionMenu'

import styles from '../DefaultEditor.module.scss'

interface FeedbackMenuProps {
  editor: Editor
  selectionRef: RefObject<TextSelectionRangeType | null>
  feedbackText: string | null
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  isFeedbackPromptMenuOpen: boolean
  handleSubmitFeedback: ({ isGood, feedback, feedbackType }: FeedbackFormData) => void
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
    <Portal>
      <div
        style={{
          width: 200,
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 100,
        }}
      >
        <div className={styles['prompt-menu']}>
          <textarea
            ref={textareaRef}
            readOnly
            value={feedbackText ? feedbackText : '선택한 구간에 대한 피드백을 생성하고 있어요.'}
            className={styles['prompt-menu__input']}
          />
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
    </Portal>
  )
}

import { ChangeEvent, RefObject, useRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType, TextSelectionRangeType } from 'types/common/editor'

import FillButton from '@components/buttons/FillButton'
import Portal from '@components/modal/Portal'

import useUpdatePosition from '@hooks/editor/useUpdatePosition'

import FeedbackOptionMenu from './menu/FeedbackOptionMenu'
import PrimaryActionMenu from './menu/PrimaryActionMenu'

import styles from '../DefaultEditor.module.scss'

interface ManualModificationProps {
  isPrimaryActionMenuOpen: boolean
  editor: Editor
  selectionRef: RefObject<TextSelectionRangeType | null>
  onPromptChange: (value: string) => void
  onAiPrompt: () => void
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  handleSubmitFeedback: ({ isGood, feedback, feedbackType }: FeedbackFormData) => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 수동 수정 UI
export default function ManualModification({
  isPrimaryActionMenuOpen,
  feedback,
  editor,
  selectionRef,
  onPromptChange,
  onAiPrompt,
  onOptionClick,
  handleSubmitFeedback,
}: ManualModificationProps) {
  const position = useUpdatePosition(editor, selectionRef)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [feedbackInput, setFeedbackInput] = useState('')
  const [isShowFeedbackMenu, setIsShowFeedbackMenu] = useState(false)
  const [isShowFeedbackInput, setIsShowFeedbackInput] = useState(false)

  // TODO 공통 함수로 분리
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onPromptChange(e.target.value)
    adjustTextareaHeight()
  }

  const handleChangeFeedbackInput = (e: ChangeEvent<HTMLInputElement>) => {
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
            autoFocus
            className={styles['prompt-menu__input']}
            placeholder="프롬프트를 입력해 주세요."
            ref={textareaRef}
            onChange={handleChange}
            rows={1}
            style={{ overflow: 'hidden' }}
          />
          <FillButton
            size="medium"
            variant="primary"
            style={{
              padding: '0.8rem 1.2rem',
              height: '100%',
            }}
            onClick={onAiPrompt}
          >
            생성하기
          </FillButton>
        </div>

        {isPrimaryActionMenuOpen && (
          <div className={styles['select-menu']}>
            {isShowFeedbackMenu ? (
              <FeedbackOptionMenu
                onSubmitFeedback={onSubmitFeedback}
                isShowFeedbackInput={isShowFeedbackInput}
                setIsShowFeedbackInput={setIsShowFeedbackInput}
                feedbackInput={feedbackInput}
                onFeedbackInputChange={handleChangeFeedbackInput}
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

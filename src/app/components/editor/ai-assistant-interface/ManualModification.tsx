import { ChangeEvent, RefObject, useState } from 'react'

import { Editor } from '@tiptap/react'
import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType, TextSelectionRangeType } from 'types/common/editor'

import useUpdatePosition from '@hooks/editor/useUpdatePosition'

import PromptInput from '../common/PromptInput'
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
  isPending: boolean
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
  isPending,
}: ManualModificationProps) {
  const position = useUpdatePosition(editor, selectionRef)
  const [feedbackInput, setFeedbackInput] = useState('')
  const [isShowFeedbackMenu, setIsShowFeedbackMenu] = useState(false)
  const [isShowFeedbackInput, setIsShowFeedbackInput] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onPromptChange(e.target.value)
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
    <div
      style={{
        width: 200,
        position: 'absolute',
        top: `${position.top}px`,
        left: 10,
        zIndex: 100,
      }}
    >
      <PromptInput
        onPromptInputChange={handleChange}
        onSubmit={onAiPrompt}
        placeholder="프롬프트를 입력해 주세요."
        buttonText="생성하기"
        isPending={isPending}
      />

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
  )
}

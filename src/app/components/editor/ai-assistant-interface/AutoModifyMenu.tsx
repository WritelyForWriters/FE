import { ChangeEvent, RefObject, useRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType, TextSelectionRangeType } from 'types/common/editor'

import useUpdatePosition from '@hooks/editor/useUpdatePosition'

import FeedbackOptionMenu from './menu/FeedbackOptionMenu'
import PrimaryActionMenu from './menu/PrimaryActionMenu'

interface AutoModifyMenuProps {
  editor: Editor
  selectionRef: RefObject<TextSelectionRangeType | null>
  isVisible: boolean
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  handleSubmitFeedback: ({ isGood, feedback, feedbackType }: FeedbackFormData) => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 자동 수정 UI
export default function AutoModifyMenu({
  feedback,
  editor,
  selectionRef,
  isVisible,
  onOptionClick,
  handleSubmitFeedback,
}: AutoModifyMenuProps) {
  const position = useUpdatePosition(editor, selectionRef)

  const [feedbackInput, setFeedbackInput] = useState('')
  const [isShowFeedbackMenu, setIsShowFeedbackMenu] = useState(false)
  const [isShowFeedbackInput, setIsShowFeedbackInput] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)

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

  if (!isVisible) return null

  return (
    <div
      ref={menuRef}
      // 스타일 위치를 동적으로 계산해야 하므로 인라인 스타일 적용
      style={{
        width: 200,
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 100,
      }}
    >
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
  )
}

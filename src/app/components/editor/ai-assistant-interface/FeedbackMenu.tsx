import { ChangeEvent, RefObject, useEffect, useState } from 'react'

import { Editor } from '@tiptap/react'
import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType, TextSelectionRangeType } from 'types/common/editor'

import Portal from '@components/modal/Portal'

import FeedbackOptionMenu from './menu/FeedbackOptionMenu'
import PrimaryActionMenu from './menu/PrimaryActionMenu'

import styles from '../DefaultEditor.module.scss'

interface FeedbackMenuProps {
  editor: Editor
  selectionRef: RefObject<TextSelectionRangeType | null>
  feedbackText: string | null
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  handleSubmitFeedback: ({ isGood, feedback, feedbackType }: FeedbackFormData) => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 구간 피드백 UI
export default function FeedbackMenu({
  feedback,
  editor,
  selectionRef,
  feedbackText,
  onOptionClick,
  handleSubmitFeedback,
}: FeedbackMenuProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
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

  useEffect(() => {
    if (!editor || !selectionRef?.current) return

    // 선택 범위의 좌표 계산
    const { from, to } = selectionRef?.current
    const view = editor.view

    try {
      const startCoords = view.coordsAtPos(from)
      const endCoords = view.coordsAtPos(to)

      // 선택된 영역의 가로 중앙 위치 계산
      const centerX = (startCoords.left + endCoords.left) / 2

      // 텍스트 아래 여백(8px)을 두고, 가운데 정렬로 배치
      setPosition({
        top: endCoords.bottom + 8,
        left: centerX,
      })
    } catch (error) {
      console.error(error)
    }
  }, [editor, selectionRef])

  return (
    <Portal>
      <div
        style={{
          width: 200,
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
          zIndex: 100,
        }}
      >
        <div className={styles['prompt-menu']}>
          <input
            readOnly
            className={styles['prompt-menu__input']}
            value={feedbackText ? feedbackText : '선택한 구간에 대한 피드백을 생성하고 있어요.'}
          />
        </div>

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
      </div>
    </Portal>
  )
}

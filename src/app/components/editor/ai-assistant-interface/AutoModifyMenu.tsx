import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType, TextSelectionRangeType } from 'types/common/editor'

import Portal from '@components/modal/Portal'

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
  const [position, setPosition] = useState({ top: 0, left: 0 })
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

  // MEMO(Sohyun): 텍스트 에디터에서 특정 영역을 선택했을 때, 그 선택 영역 기준으로 메뉴 UI를 띄우기 위한 좌표 계산
  // BubbleMenu는 에디터 내용 변경 시 초기화되는 문제로 직접 좌표를 계산한 UI를 구현함
  useEffect(() => {
    if (!isVisible || !editor || !selectionRef?.current) return

    // 선택 범위의 좌표 계산
    const { from, to } = selectionRef?.current
    const view = editor.view

    try {
      // MEMO(Sohyun): view.coordsAtPos(pos)는 에디터 문서 내 특정 문자 인덱스(pos)에 해당하는 브라우저 상의 실제 좌표를 반환하는 Prosemirror API
      // (참고) https://prosemirror.net/docs/ref/#view.EditorView.coordsAtPos
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
  }, [editor, selectionRef, isVisible])

  if (!isVisible) return null

  return (
    <Portal>
      <div
        ref={menuRef}
        // 스타일 위치를 동적으로 계산해야 하므로 인라인 스타일 적용
        style={{
          width: 200,
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translateX(-50%)',
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
    </Portal>
  )
}

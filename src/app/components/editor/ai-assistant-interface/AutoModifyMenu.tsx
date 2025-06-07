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
  //  선택 영역의 위치를 계산하는 함수
  const updatePosition = () => {
    if (!editor || !selectionRef?.current) return

    const { to } = selectionRef.current
    const view = editor.view

    try {
      // 선택된 텍스트의 마지막 위치(to)에서 해당 위치의 좌표를 구함
      // MEMO(Sohyun): view.coordsAtPos(pos)는 에디터 문서 내 특정 문자 인덱스(pos)에 해당하는 브라우저 상의 실제 좌표를 반환하는 Prosemirror API
      // (참고) https://prosemirror.net/docs/ref/#view.EditorView.coordsAtPos
      const endCoords = view.coordsAtPos(to)

      // 에디터 요소의 위치 정보 가져오기
      const editorRect = editor.view.dom.getBoundingClientRect()

      // 스크롤 위치를 고려한 절대 위치 계산
      // 뷰포트 기준 좌표(endCoords)에 스크롤 위치를 더하지 않음 (coordsAtPos는 이미 viewport 기준 좌표 반환)
      setPosition({
        top: endCoords.bottom,
        left: Math.max(editorRect.left + 20, endCoords.left),
      })
    } catch (error) {
      console.error(error)
    }
  }

  // 초기 위치 설정
  useEffect(() => {
    updatePosition()
  }, [editor, selectionRef, isVisible])

  // 스크롤 이벤트 리스너 등록 > 스크롤시에도 메뉴가 드래그한 위치 아래에 고정되도록
  useEffect(() => {
    const handleScroll = () => {
      updatePosition()
    }
    // 에디터 컨테이너 또는 상위 요소에 스크롤 이벤트 리스너 추가
    const editorDOM = editor?.view.dom
    const editorContainer = editorDOM?.closest('.tiptap') || window
    editorContainer.addEventListener('scroll', handleScroll)
    // window.addEventListener('scroll', handleScroll) // 전체 페이지 스크롤도 감지

    return () => {
      editorContainer.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [editor, selectionRef])

  if (!isVisible) return null

  return (
    <Portal>
      <div
        ref={menuRef}
        // 스타일 위치를 동적으로 계산해야 하므로 인라인 스타일 적용
        style={{
          width: 200,
          position: 'fixed',
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
    </Portal>
  )
}

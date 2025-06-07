import { ChangeEvent, RefObject, useEffect, useState } from 'react'

import { Editor } from '@tiptap/react'
import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType, TextSelectionRangeType } from 'types/common/editor'

import FillButton from '@components/buttons/FillButton'
import Portal from '@components/modal/Portal'

import FeedbackOptionMenu from './menu/FeedbackOptionMenu'
import PrimaryActionMenu from './menu/PrimaryActionMenu'

import styles from '../DefaultEditor.module.scss'

interface ManualModificationProps {
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
  feedback,
  editor,
  selectionRef,
  onPromptChange,
  onAiPrompt,
  onOptionClick,
  handleSubmitFeedback,
}: ManualModificationProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [feedbackInput, setFeedbackInput] = useState('')
  const [isShowFeedbackMenu, setIsShowFeedbackMenu] = useState(false)
  const [isShowFeedbackInput, setIsShowFeedbackInput] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const updatePosition = () => {
    if (!editor || !selectionRef?.current) return

    const { to } = selectionRef.current
    const view = editor.view

    try {
      const endCoords = view.coordsAtPos(to)
      const editorRect = editor.view.dom.getBoundingClientRect()
      setPosition({
        top: endCoords.bottom,
        left: Math.max(editorRect.left, endCoords.left),
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    updatePosition()
  }, [editor, selectionRef])

  useEffect(() => {
    const handleScroll = () => {
      updatePosition()
    }

    const editorDOM = editor?.view.dom
    const editorContainer = editorDOM?.closest('.tiptap') || window
    editorContainer.addEventListener('scroll', handleScroll)
    window.addEventListener('scroll', handleScroll) // 전체 페이지 스크롤도 감지

    return () => {
      editorContainer.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [editor, selectionRef])

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
          <input
            autoFocus
            className={styles['prompt-menu__input']}
            onChange={handleChange}
            placeholder="프롬프트를 입력해 주세요."
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
      </div>
    </Portal>
  )
}

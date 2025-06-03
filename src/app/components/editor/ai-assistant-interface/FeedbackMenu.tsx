import { ChangeEvent, useState } from 'react'

import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType } from 'types/common/editor'

import FeedbackOptionMenu from './menu/FeedbackOptionMenu'
import PrimaryActionMenu from './menu/PrimaryActionMenu'

import styles from '../DefaultEditor.module.scss'

interface FeedbackMenuProps {
  feedbackText: string | null
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  handleSubmitFeedback: ({ isGood, feedback, feedbackType }: FeedbackFormData) => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 구간 피드백 UI
export default function FeedbackMenu({
  feedback,
  feedbackText,
  onOptionClick,
  handleSubmitFeedback,
}: FeedbackMenuProps) {
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

  return (
    <div>
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
  )
}

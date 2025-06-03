import { ChangeEvent, useState } from 'react'

import { FeedbackFormData, FeedbackOptionType } from 'types/chatbot/chatbot'
import { ActionOptionType, EvaluateStateType } from 'types/common/editor'

import FillButton from '@components/buttons/FillButton'

import FeedbackOptionMenu from './menu/FeedbackOptionMenu'
import PrimaryActionMenu from './menu/PrimaryActionMenu'

import styles from '../DefaultEditor.module.scss'

interface ManualModificationProps {
  isOpen: boolean
  onClose: () => void
  onPromptChange: (value: string) => void
  onAiPrompt: () => void
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  handleSubmitFeedback: ({ isGood, feedback, feedbackType }: FeedbackFormData) => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 수동 수정 UI
export default function ManualModification({
  feedback,
  onPromptChange,
  onAiPrompt,
  onOptionClick,
  handleSubmitFeedback,
}: ManualModificationProps) {
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

  return (
    <>
      <div className={styles.container}>
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
    </>
  )
}

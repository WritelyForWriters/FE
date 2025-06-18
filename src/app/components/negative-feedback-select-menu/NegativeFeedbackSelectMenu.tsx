import { ReactNode, useState } from 'react'

import axios from 'axios'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { FormProvider, useForm } from 'react-hook-form'
import { FeedbackOptionType } from 'types/chatbot/chatbot'

import AutoResizingTextArea from '@components/auto-resizing-textarea/AutoResizingTextarea'
import FillButton from '@components/buttons/FillButton'
import { useToast } from '@components/toast/ToastProvider'

import { useSubmitFeedback } from '@hooks/chatbot/useSubmitFeedback'

import classNames from 'classnames/bind'

import styles from './NegativeFeedbackSelectMenu.module.scss'

const cx = classNames.bind(styles)

interface NegativeFeedbackSelectMenuOptionProps {
  assistantId: string
  feedbackType: FeedbackOptionType
  title: string
  onClick: () => void
}

function NegativeFeedbackSelectMenuOption({
  assistantId,
  feedbackType,
  title,
  onClick,
}: NegativeFeedbackSelectMenuOptionProps) {
  const showToast = useToast()

  const method = useForm<{ feedback: string }>()
  const [isSelectedETC, setIsSelectedETC] = useState(false)

  const { mutate: submitFeedback } = useSubmitFeedback({
    onSuccess: () => {
      showToast('success', TOAST_MESSAGE.SUCCESS_SUBMIT_FEEDBACK)
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast('warning', error.response?.data.message)
      }
    },
  })

  const handleFeedbackMenuClick = () => {
    if (feedbackType === 'ETC') {
      setIsSelectedETC(true)
      return
    } else {
      submitFeedback({
        assistantId,
        formData: {
          isGood: false,
          feedbackType,
        },
      })
      onClick()
    }
  }

  const { handleSubmit } = method

  const handleNegativeFeedbackSubmit = ({ feedback }: { feedback: string }) => {
    if (!feedback.trim() || !feedback.length) return

    submitFeedback({
      assistantId,
      formData: {
        isGood: false,
        feedbackType: 'ETC',
        feedback,
      },
    })

    onClick()
  }

  const handleFeedbackInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(handleNegativeFeedbackSubmit)
    }
  }

  return (
    <li key={assistantId} onClick={handleFeedbackMenuClick}>
      {title}
      {isSelectedETC && (
        <FormProvider {...method}>
          <div className={cx('feedback-menu-input-container')}>
            <AutoResizingTextArea
              name="feedback"
              keyDownHandler={handleFeedbackInputKeyDown}
              placeholder="피드백을 입력해 주세요"
            />
            <FillButton
              type="submit"
              size="medium"
              onClick={handleSubmit(handleNegativeFeedbackSubmit)}
            >
              제출
            </FillButton>
          </div>
        </FormProvider>
      )}
    </li>
  )
}

export default function NegativeFeedbackSelectMenu({ children }: { children: ReactNode }) {
  return <menu className={cx('feedback-menu-wrapper')}>{children}</menu>
}

NegativeFeedbackSelectMenu.Option = NegativeFeedbackSelectMenuOption

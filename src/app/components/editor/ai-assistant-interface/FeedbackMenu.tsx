import Image from 'next/image'

import { ChangeEvent, useRef, useState } from 'react'

import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { ActionOptionType } from 'types/common/editor'
import { ModalHandler } from 'types/common/modalRef'

import Modal from '@components/modal/Modal'
import SelectMenuContent from '@components/select-menu/SelectMenuContent'
import { useToast } from '@components/toast/ToastProvider'

import { EvaluateStateType } from '@hooks/editor/useTextEditor'

import styles from '../DefaultEditor.module.scss'

interface FeedbackMenuProps {
  feedbackText: string | null
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  handleSubmitFeedback: (isGood: boolean, value?: string) => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 구간 피드백 UI
export default function FeedbackMenu({
  feedback,
  feedbackText,
  onOptionClick,
  handleSubmitFeedback,
}: FeedbackMenuProps) {
  const showToast = useToast()
  const [feedbackInput, setFeedbackInput] = useState('')
  const modalRef = useRef<ModalHandler | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFeedbackInput(e.target.value)
  }

  const onSubmitFeedback = () => {
    if (feedbackInput.trim() === '') return

    try {
      handleSubmitFeedback(false, feedbackInput)
      modalRef.current?.close()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>
        <div className={styles['prompt-menu']}>
          <input
            readOnly
            className={styles['prompt-menu__input']}
            value={feedbackText ? feedbackText : '선택한 구간에 대한 피드백을 생성하고 있어요.'}
          />
        </div>

        <div className={styles['select-menu']}>
          <SelectMenuContent>
            <SelectMenuContent.Option option={{ handleAction: onOptionClick('apply') }}>
              <FaCheck color="#CCCCCC" fontSize={20} style={{ padding: '2px' }} />
              이대로 수정하기
            </SelectMenuContent.Option>
            <SelectMenuContent.Option option={{ handleAction: onOptionClick('recreate') }}>
              <Image src="/icons/refresh.svg" alt="다시 생성하기" width={20} height={20} />
              다시 생성하기
            </SelectMenuContent.Option>
            <SelectMenuContent.Option option={{ handleAction: onOptionClick('cancel') }}>
              <IoClose color="#CCCCCC" fontSize={20} />
              취소하기
            </SelectMenuContent.Option>
            <div className={styles['divide-line']}></div>
            <SelectMenuContent.Option option={{ handleAction: () => handleSubmitFeedback(true) }}>
              <Image
                src={
                  feedback.isGoodSelected
                    ? '/icons/fill-feedback-good-icon.svg'
                    : '/icons/feedback-good-icon.svg'
                }
                alt="good"
                width={20}
                height={20}
              />
              응답이 마음에 들어요
            </SelectMenuContent.Option>
            <SelectMenuContent.Option
              option={{
                handleAction: () => {
                  if (feedback.isGoodSelected || feedback.isBadSelected) {
                    showToast('warning', TOAST_MESSAGE.FAIL_SUBMIT_FEEDBACK)
                    return
                  }
                  modalRef.current?.open()
                },
              }}
            >
              <Image
                src={
                  feedback.isBadSelected
                    ? '/icons/fill-feedback-bad-icon.svg'
                    : '/icons/feedback-bad-icon.svg'
                }
                alt="not good"
                width={20}
                height={20}
              />
              응답이 별로에요
            </SelectMenuContent.Option>
            <SelectMenuContent.Option option={{ handleAction: onOptionClick('archive') }}>
              <Image
                src="/icons/permanent-saved-icon.svg"
                alt="답변 영구 보관하기"
                width={20}
                height={20}
              />
              답변 영구 보관하기
            </SelectMenuContent.Option>
          </SelectMenuContent>
        </div>
      </div>

      <Modal
        ref={modalRef}
        title="어떤 점이 아쉬웠는지 알려주세요."
        cancelText="취소"
        confirmText="제출하기"
        onCancel={() => modalRef.current?.close()}
        onConfirm={onSubmitFeedback}
        content={
          // TODO 스타일 수정
          <input onChange={handleChange} placeholder="피드백을 입력해 주세요" />
        }
      />
    </>
  )
}

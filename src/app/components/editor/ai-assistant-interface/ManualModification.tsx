import Image from 'next/image'

import { ChangeEvent, useRef, useState } from 'react'

import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { ActionOptionType } from 'types/common/editor'
import { ModalHandler } from 'types/common/modalRef'

import FillButton from '@components/buttons/FillButton'
import Modal from '@components/modal/Modal'
import SelectMenu from '@components/select-menu/SelectMenu'

import { EvaluateStateType } from '@hooks/editor/useTextEditor'

import styles from '../DefaultEditor.module.scss'

interface ManualModificationProps {
  isOpen: boolean
  onClose: () => void
  onPromptChange: (value: string) => void
  onAiPrompt: () => void
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  handleSubmitFeedback: (isGood: boolean, value?: string) => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 수동 수정 UI
export default function ManualModification({
  feedback,
  isOpen,
  onClose,
  onPromptChange,
  onAiPrompt,
  onOptionClick,
  handleSubmitFeedback,
}: ManualModificationProps) {
  const [feedbackInput, setFeedbackInput] = useState('')
  const modalRef = useRef<ModalHandler | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onPromptChange(e.target.value)
  }

  const handleChangeFeedbackInput = (e: ChangeEvent<HTMLInputElement>) => {
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
          <SelectMenu handleClose={onClose} isOpen={isOpen}>
            <SelectMenu.Option option={{ handleAction: onOptionClick('apply') }}>
              <FaCheck color="#CCCCCC" fontSize={20} style={{ padding: '2px' }} />
              이대로 수정하기
            </SelectMenu.Option>
            <SelectMenu.Option option={{ handleAction: onOptionClick('recreate') }}>
              <Image src="/icons/refresh.svg" alt="다시 생성하기" width={20} height={20} />
              다시 생성하기
            </SelectMenu.Option>
            <SelectMenu.Option option={{ handleAction: onOptionClick('cancel') }}>
              <IoClose color="#CCCCCC" fontSize={20} />
              취소하기
            </SelectMenu.Option>
            <div className={styles['divide-line']}></div>
            <SelectMenu.Option option={{ handleAction: onOptionClick('feedback-good') }}>
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
            </SelectMenu.Option>
            <SelectMenu.Option option={{ handleAction: () => modalRef.current?.open() }}>
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
            </SelectMenu.Option>
            <SelectMenu.Option option={{ handleAction: onOptionClick('archive') }}>
              <Image
                src="/icons/permanent-saved-icon.svg"
                alt="답변 영구 보관하기"
                width={20}
                height={20}
              />
              답변 영구 보관하기
            </SelectMenu.Option>
          </SelectMenu>
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
          <input onChange={handleChangeFeedbackInput} placeholder="피드백을 입력해 주세요" />
        }
      />
    </>
  )
}

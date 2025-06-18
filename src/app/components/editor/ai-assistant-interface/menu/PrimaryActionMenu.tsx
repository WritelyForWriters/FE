import Image from 'next/image'

import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { trackEvent } from 'lib/amplitude'
import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { ActionOptionType, EvaluateStateType } from 'types/common/editor'

import SelectMenuContent from '@components/select-menu/SelectMenuContent'
import { useToast } from '@components/toast/ToastProvider'

import styles from './PrimaryActionMenu.module.scss'

interface PrimaryActionMenuProps {
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  onFeedbackClick: (data: { isGood: boolean }) => void
  onBadFeedbackClick: () => void
}

export default function PrimaryActionMenu({
  onOptionClick,
  feedback,
  onFeedbackClick,
  onBadFeedbackClick,
}: PrimaryActionMenuProps) {
  const showToast = useToast()

  const handleBadFeedbackClick = () => {
    if (feedback.isGoodSelected || feedback.isBadSelected) {
      showToast('warning', TOAST_MESSAGE.FAIL_SUBMIT_FEEDBACK)
      return
    }
    onBadFeedbackClick()
    trackEvent('ai_feedback_rating', {
      rating_score: false,
    })
  }

  return (
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

      <SelectMenuContent.Option
        option={{
          handleAction: () => {
            trackEvent('ai_feedback_rating', {
              rating_score: true,
            })
            onFeedbackClick({ isGood: true })
          },
        }}
      >
        <Image
          src={
            feedback.isGoodSelected
              ? '/icons/fill-feedback-good-icon.svg'
              : '/icons/feedback-good-icon.svg'
          }
          alt="good"
          width={20}
          height={20}
          color="black"
        />
        응답이 마음에 들어요
      </SelectMenuContent.Option>
      <SelectMenuContent.Option option={{ handleAction: handleBadFeedbackClick }}>
        <Image
          src={
            feedback.isBadSelected
              ? '/icons/fill-feedback-bad-icon.svg'
              : '/icons/feedback-bad-icon.svg'
          }
          alt="bad"
          width={20}
          height={20}
        />
        응답이 별로에요
      </SelectMenuContent.Option>
      <SelectMenuContent.Option
        option={{
          handleAction: onOptionClick('archive'),
          className: feedback.isArchived ? styles['selected-archived'] : '',
        }}
      >
        <Image
          src={
            feedback.isArchived
              ? '/icons/fill-permanent-saved-icon.svg'
              : '/icons/permanent-saved-icon.svg'
          }
          alt="답변 영구 보관하기"
          width={20}
          height={20}
        />
        답변 영구 보관하기
      </SelectMenuContent.Option>
    </SelectMenuContent>
  )
}

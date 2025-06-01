import Image from 'next/image'

import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { ActionOptionType } from 'types/common/editor'

import SelectMenuContent from '@components/select-menu/SelectMenuContent'

import { EvaluateStateType } from '@hooks/editor/useTextEditor'

import styles from '../DefaultEditor.module.scss'

interface FeedbackMenuProps {
  feedbackText: string | null
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
}

// MEMO(Sohyun): ai-assistant 인터페이스 구간 피드백 UI
export default function FeedbackMenu({ feedback, feedbackText, onOptionClick }: FeedbackMenuProps) {
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
          <SelectMenuContent.Option option={{ handleAction: onOptionClick('feedback-good') }}>
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
          <SelectMenuContent.Option option={{ handleAction: onOptionClick('feedback-bad') }}>
            <Image src="/icons/feedback-bad-icon.svg" alt="not good" width={20} height={20} />
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
  )
}

import { ChangeEvent } from 'react'

import { FeedbackOptionType } from 'types/chatbot/chatbot'

import FillButton from '@components/buttons/FillButton'
import SelectMenuContent from '@components/select-menu/SelectMenuContent'

import styles from './FeedbackOptionMenu.module.scss'

interface FeedbackOptionsMenuProps {
  onSubmitFeedback: (option?: FeedbackOptionType) => () => void
  isShowFeedbackInput: boolean
  setIsShowFeedbackInput: (isShow: boolean) => void
  feedbackInput: string
  onFeedbackInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FeedbackOptionMenu({
  onSubmitFeedback,
  isShowFeedbackInput,
  setIsShowFeedbackInput,
  onFeedbackInputChange,
}: FeedbackOptionsMenuProps) {
  return (
    <SelectMenuContent>
      <SelectMenuContent.Option option={{ handleAction: onSubmitFeedback('AWKWARD_SENTENCE') }}>
        어색한 문장
      </SelectMenuContent.Option>
      <SelectMenuContent.Option option={{ handleAction: onSubmitFeedback('INACCURATE_INFO') }}>
        부정확한 정보
      </SelectMenuContent.Option>
      <SelectMenuContent.Option option={{ handleAction: onSubmitFeedback('UNAPPLIED_SETTING') }}>
        설정 미반영
      </SelectMenuContent.Option>
      <SelectMenuContent.Option option={{ handleAction: () => setIsShowFeedbackInput(true) }}>
        기타(직접 입력)
      </SelectMenuContent.Option>

      {isShowFeedbackInput && (
        <div className={styles['feedback-wrapper']}>
          <input
            className={styles['feedback-wrapper__input']}
            onChange={onFeedbackInputChange}
            placeholder="피드백을 입력해 주세요"
          />
          <FillButton
            size="medium"
            variant="primary"
            style={{
              padding: '0.8rem 1.2rem',
              height: '100%',
              width: 50,
              wordBreak: 'keep-all',
            }}
            onClick={onSubmitFeedback('ETC')}
          >
            제출
          </FillButton>
        </div>
      )}
    </SelectMenuContent>
  )
}

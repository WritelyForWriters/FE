import Image from 'next/image'

import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { ActionOptionType } from 'types/common/editor'

import SelectMenuContent from '@components/select-menu/SelectMenuContent'

import styles from '../DefaultEditor.module.scss'

interface FeedbackMenuProps {
  feedbackText: string | null
  onOptionClick: (option: ActionOptionType) => () => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 구간 피드백 UI
export default function FeedbackMenu({ feedbackText, onOptionClick }: FeedbackMenuProps) {
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
        </SelectMenuContent>
      </div>
    </div>
  )
}

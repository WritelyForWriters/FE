import Image from 'next/image'

import { ChangeEvent } from 'react'

import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { ActionOptionType } from 'types/common/editor'

import FillButton from '@components/buttons/FillButton'
import SelectMenu from '@components/select-menu/SelectMenu'

import styles from '../DefaultEditor.module.scss'

interface ManualModificationProps {
  isOpen: boolean
  onClose: () => void
  onPromptChange: (value: string) => void
  onAiPrompt: () => void
  onOptionClick: (option: ActionOptionType) => () => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 수동 수정 UI
export default function ManualModification({
  isOpen,
  onClose,
  onPromptChange,
  onAiPrompt,
  onOptionClick,
}: ManualModificationProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onPromptChange(e.target.value)
  }

  return (
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
          <SelectMenu.Option option={{ handleAction: onOptionClick('apply') }}>
            <Image src="/icons/feedback-good-icon.svg" alt="good" width={20} height={20} />
            응답이 마음에 들어요
          </SelectMenu.Option>
          <SelectMenu.Option option={{ handleAction: onOptionClick('recreate') }}>
            <Image src="/icons/feedback-bad-icon.svg" alt="not good" width={20} height={20} />
            응답이 별로에요
          </SelectMenu.Option>
          <SelectMenu.Option option={{ handleAction: onOptionClick('cancel') }}>
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
  )
}

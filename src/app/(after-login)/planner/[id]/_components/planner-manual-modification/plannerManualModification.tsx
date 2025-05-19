import Image from 'next/image'

import { useState } from 'react'

import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

import FillButton from '@components/buttons/FillButton'
import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'

import styles from './plannerManualModification.module.scss'

interface PlannerManualModificationProps {
  promptClose: () => void
}

export default function PlannerManualModification({ promptClose }: PlannerManualModificationProps) {
  const [inputValue, setInputValue] = useState('')
  const { isOpen, onClose } = useCollapsed(false)

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return

    console.log(inputValue)
  }

  return (
    <>
      <div className={styles['container']}>
        <div className={styles['prompt-menu']}>
          <input
            autoFocus
            className={styles['prompt-menu__input']}
            placeholder="프롬프트를 입력해 주세요."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <FillButton
            size="medium"
            variant="primary"
            style={{
              padding: '0.8rem 1.2rem',
              height: '100%',
            }}
            onClick={() => {}}
          >
            생성하기
          </FillButton>
        </div>

        <div className={styles['select-menu']}>
          <SelectMenu handleClose={onClose} isOpen={isOpen}>
            <SelectMenu.Option option={{ handleAction: () => {} }}>
              <FaCheck color="#CCCCCC" fontSize={20} style={{ padding: '2px' }} />
              이대로 수정하기
            </SelectMenu.Option>
            <SelectMenu.Option option={{ handleAction: () => {} }}>
              <Image src="/icons/refresh.svg" alt="다시 생성하기" width={20} height={20} />
              다시 생성하기
            </SelectMenu.Option>
            <SelectMenu.Option option={{ handleAction: () => {} }}>
              <IoClose color="#CCCCCC" fontSize={20} />
              취소하기
            </SelectMenu.Option>
            <div className={styles['divide-line']}></div>
            <SelectMenu.Option option={{ handleAction: () => {} }}>
              <Image src="/icons/feedback-good-icon.svg" alt="good" width={20} height={20} />
              응답이 마음에 들어요
            </SelectMenu.Option>
            <SelectMenu.Option option={{ handleAction: () => {} }}>
              <Image src="/icons/feedback-bad-icon.svg" alt="not good" width={20} height={20} />
              응답이 별로에요
            </SelectMenu.Option>
            <SelectMenu.Option option={{ handleAction: () => {} }}>
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
      <div className={styles['background']} onClick={promptClose} />
    </>
  )
}

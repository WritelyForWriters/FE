import Image from 'next/image'

import { ChangeEvent, useState } from 'react'

import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

import PromptInput from '@components/editor/common/PromptInput'
import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'

import styles from './plannerManualModification.module.scss'

interface PlannerManualModificationProps {
  name: string
  value: string
  promptClose: () => void
  handleConfirm: () => void
  handleRetry: () => void
  handleCancel: () => void
  handleManualModification?: (value: string, inputValue: string) => Promise<boolean>
}

export default function PlannerManualModification({
  value,
  promptClose,
  handleConfirm,
  handleRetry,
  handleCancel,
  handleManualModification,
}: PlannerManualModificationProps) {
  const { isOpen, onOpen, onClose } = useCollapsed(false)
  const [inputValue, setInputValue] = useState('')

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
  }

  const fetchUserModify = async () => {
    try {
      if (handleManualModification) {
        const result = await handleManualModification(value, inputValue)

        if (result) {
          onOpen()
        }
      }
    } catch (error) {
      console.error(`TODO(hajae): 에러메시지 ${error}`)
    }
  }

  return (
    <>
      <div className={styles['container']}>
        {!isOpen ? (
          <PromptInput
            onPromptInputChange={handleChange}
            onSubmit={fetchUserModify}
            placeholder="프롬프트를 입력해 주세요."
            buttonText="생성하기"
          />
        ) : (
          <div className={styles['select-menu']}>
            <SelectMenu handleClose={onClose} isOpen={isOpen}>
              <SelectMenu.Option
                option={{
                  handleAction: () => {
                    handleConfirm()
                    promptClose()
                  },
                }}
              >
                <FaCheck color="#CCCCCC" fontSize={20} style={{ padding: '2px' }} />
                이대로 수정하기
              </SelectMenu.Option>
              <SelectMenu.Option
                option={{
                  handleAction: () => {
                    handleRetry()
                    onClose()
                  },
                }}
              >
                <Image src="/icons/refresh.svg" alt="다시 생성하기" width={20} height={20} />
                다시 생성하기
              </SelectMenu.Option>
              <SelectMenu.Option
                option={{
                  handleAction: () => {
                    handleCancel()
                    promptClose()
                  },
                }}
              >
                <IoClose color="#CCCCCC" fontSize={20} />
                취소하기
              </SelectMenu.Option>
            </SelectMenu>
          </div>
        )}
      </div>
      <div className={styles['background']} onClick={promptClose} />
    </>
  )
}

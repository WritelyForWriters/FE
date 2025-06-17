import Image from 'next/image'

import { ReactNode, useEffect, useState } from 'react'

import { useAtomValue } from 'jotai'
import { useFormContext } from 'react-hook-form'
import { PlannerTemplatesModeAtom } from 'store/plannerModeAtoms'

import FillButton from '@components/buttons/FillButton'

import { useCollapsed } from '@hooks/common/useCollapsed'
import { usePlannerTemplatesAiAssistant } from '@hooks/products/usePlannerTemplatesAiAssistant'

import PlannerManualModification from '../planner-manual-modification/plannerManualModification'
import aiIcon from '/public/icons/ai-option2.svg'

import classNames from 'classnames/bind'

import styles from './PlannerFieldWithButton.module.scss'

const cx = classNames.bind(styles)
interface PlannerFieldWithButtonProps {
  children: ReactNode
  name: string
  isDropdown?: boolean
  onDelete?: () => void
  manualModifiable?: boolean
  handleManualModification?: (value: string, inputValue: string) => Promise<boolean>
}

export default function PlannerFieldWithButton({
  children,
  name,
  isDropdown = false,
  onDelete,
  manualModifiable = true,
  handleManualModification,
}: PlannerFieldWithButtonProps) {
  const {
    watch,
    unregister,
    register,
    setValue,
    formState: { isValid },
  } = useFormContext()
  const { isOpen, onClose, onOpen } = useCollapsed(false)
  const [isShow, setIsShow] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const mode = useAtomValue(PlannerTemplatesModeAtom)
  const initialValue = watch(name)

  const { remove, getContent, setType } = usePlannerTemplatesAiAssistant()

  // NOTE(hajae): 삭제된 항목은 null로 반환되어 초기 렌더링 시 화면에 표시하지 않는다
  useEffect(() => {
    if (isDropdown && initialValue === undefined && !isDeleted) {
      setIsShow(true)
      return
    }

    if (initialValue === null || (!isDropdown && initialValue === undefined)) {
      setIsShow(false)
    } else if (initialValue === '' || initialValue) {
      setIsShow(true)
    }
  }, [watch, name, isDropdown, initialValue, isDeleted])

  const removeField = (setter: (v: boolean) => void) => {
    setIsDeleted(true)
    setter(false)
    unregister(name)
    if (onDelete) onDelete()
  }

  const restoreField = (setter: (v: boolean) => void) => {
    setIsDeleted(false)
    register(name)
    setValue(name, '')
    setter(true)
  }

  const handleConfirm = () => {
    remove(name)
  }

  const handleRetry = () => {
    setType(name, 'retry')
  }

  const handleCancel = () => {
    const originalContent = getContent(name)
    if (originalContent !== undefined) {
      setValue(name, originalContent)
      remove(name)
    }
  }

  return (
    <div className={cx('wrapper')}>
      {isShow ? (
        <div className={cx('field-with-button')}>
          {children}
          {mode === 'edit' && (
            <div className={cx('field-with-button__buttons')}>
              {isValid && manualModifiable && (
                <FillButton
                  type="button"
                  size="small"
                  variant="secondary"
                  shape="pill"
                  iconPosition="only"
                  iconType={<Image src={aiIcon.src} width={16} height={16} alt="ai-icon" />}
                  onClick={onOpen}
                />
              )}

              <FillButton
                type="button"
                size="small"
                variant="secondary"
                onClick={() => removeField(setIsShow)}
              >
                삭제하기
              </FillButton>
            </div>
          )}
        </div>
      ) : (
        <FillButton
          type="button"
          size="small"
          variant="secondary"
          onClick={() => restoreField(setIsShow)}
        >
          삭제된 항목 추가
        </FillButton>
      )}
      {isOpen && manualModifiable && (
        <PlannerManualModification
          name={name}
          value={initialValue}
          promptClose={onClose}
          handleManualModification={handleManualModification}
          handleConfirm={handleConfirm}
          handleRetry={handleRetry}
          handleCancel={handleCancel}
        />
      )}
    </div>
  )
}

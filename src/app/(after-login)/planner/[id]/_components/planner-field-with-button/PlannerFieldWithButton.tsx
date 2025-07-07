import Image from 'next/image'

import { ReactNode, useEffect, useRef, useState } from 'react'

import { useAtomValue } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { useFormContext } from 'react-hook-form'
import { PlannerTemplatesModeAtom } from 'store/plannerModeAtoms'
import { ModalHandler } from 'types/common/modalRef'

import FillButton from '@components/buttons/FillButton'
import Modal from '@components/modal/Modal'

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
  itemName: string
  isPending?: boolean
  isDropdown?: boolean
  showConfirm?: boolean
  onDelete?: () => void
  manualModifiable?: boolean
  handleManualModification?: (value: string, inputValue: string) => Promise<boolean>
}

export default function PlannerFieldWithButton({
  children,
  name,
  itemName,
  isPending = false,
  isDropdown = false,
  showConfirm = false,
  onDelete,
  manualModifiable = true,
  handleManualModification,
}: PlannerFieldWithButtonProps) {
  const { watch, unregister, register, setValue } = useFormContext()
  const { isOpen, onClose, onOpen } = useCollapsed(false)
  const [isShow, setIsShow] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const modalRef = useRef<ModalHandler | null>(null)
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

  const removeField = () => {
    setIsDeleted(true)
    setIsShow(false)
    unregister(name)

    trackEvent('planner_item_delete', {
      item_name: itemName,
    })

    if (onDelete) onDelete()
  }

  const restoreField = () => {
    setIsDeleted(false)
    register(name)
    setValue(name, '')
    setIsShow(true)
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
              {manualModifiable && (
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
                onClick={() => {
                  if (showConfirm) {
                    modalRef.current?.open()
                  } else {
                    removeField()
                  }
                }}
              >
                삭제하기
              </FillButton>
            </div>
          )}
        </div>
      ) : (
        <FillButton type="button" size="small" variant="secondary" onClick={() => restoreField()}>
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
          isPending={isPending}
        />
      )}
      <Modal
        ref={modalRef}
        title="정말 삭제하시겠습니까? 이작업은 되돌릴 수 없습니다."
        cancelText="취소하기"
        confirmText="삭제하기"
        onCancel={() => {
          modalRef.current?.close()
        }}
        onConfirm={async () => {
          modalRef.current?.close()
          removeField()
        }}
      />
    </div>
  )
}

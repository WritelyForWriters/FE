import { useEffect, useRef } from 'react'

import { NEW_PLANNER_CHARACTER, PLANNER_CHARACTER_ITEMS } from 'constants/planner/plannerConstants'
import { useAtom, useAtomValue } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import isEqual from 'lodash/isEqual'
import { useFormContext, useWatch } from 'react-hook-form'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { PlannerTemplatesModeAtom } from 'store/plannerModeAtoms'
import { ModalHandler } from 'types/common/modalRef'
import { CharacterFormValues } from 'types/planner/plannerSynopsisFormValues'

import FillButton from '@components/buttons/FillButton'
import Modal from '@components/modal/Modal'
import TextField from '@components/text-field/TextField'

import { useCollapsed } from '@hooks/common/useCollapsed'

import PlannerFieldWithButton from '../planner-field-with-button/PlannerFieldWithButton'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterFormList.module.scss'

const cx = classNames.bind(styles)

const expandItems = ['intro', 'customFields']

interface PlannerCharacterFormListProps {
  paramsId: string
  arrayIndex: number
  handleRemoveCharacter: (index: number) => void
  handleManualModification: (
    name: string,
    section: string,
  ) => (value: string, inputValue: string) => Promise<boolean>
}

export default function PlannerCharacterFormList({
  paramsId,
  arrayIndex,
  handleRemoveCharacter,
  handleManualModification,
}: PlannerCharacterFormListProps) {
  const { isOpen, onToggle } = useCollapsed(true)
  const { control } = useFormContext()
  const [formValues, setFormValues] = useAtom(plannerCharacterByIdAtom(paramsId))
  const mode = useAtomValue(PlannerTemplatesModeAtom)
  const modalRef = useRef<ModalHandler | null>(null)

  const getTextFieldName = (name: string) => {
    // NOTE(hajae): customFields는 배열이나, 디자인상 Character Fields에서는 하나의 필드를 사용 중
    if (name === 'customFields' && formValues.characters[arrayIndex].customFields) {
      return `characters[${arrayIndex}].customFields[0].content`
    } else {
      return `characters[${arrayIndex}].${name}`
    }
  }

  const watchedValues: CharacterFormValues = useWatch({
    control,
    name: `characters[${arrayIndex}]`,
  })

  // NOTE(hajae): local storage 저장
  useEffect(() => {
    if (!watchedValues || isEqual(watchedValues, NEW_PLANNER_CHARACTER)) return
    setFormValues(
      formValues.characters.map((character, index) =>
        index === arrayIndex ? watchedValues : character,
      ),
      'character',
    )
  }, [watchedValues])

  return (
    <div className={cx('list')}>
      <div className={cx('list__title')}>
        <span>등장인물 {arrayIndex + 1}</span>
        <div className={cx('list__title__buttons')}>
          {mode === 'edit' && (
            <div className={cx('list__title__buttons__delete')}>
              <FillButton
                size="small"
                variant="secondary"
                type="button"
                onClick={() => modalRef.current?.open()}
              >
                삭제하기
              </FillButton>
            </div>
          )}

          {isOpen ? (
            <IoIosArrowUp onClick={onToggle} className={cx('list__title__buttons__closed-icon')} />
          ) : (
            <IoIosArrowDown onClick={onToggle} className={cx('list__title__buttons__opend-icon')} />
          )}
        </div>
      </div>

      {isOpen && (
        <div className={cx('list__items')}>
          {PLANNER_CHARACTER_ITEMS.map((item, index) =>
            // NOTE(hajae): 등장인물 이름은 삭제 불가이기 때문에 조건 추가
            item.name !== 'name' ? (
              <PlannerFieldWithButton
                key={`planner-character-item-${index}`}
                name={getTextFieldName(item.name)}
                itemName={`등장인물${arrayIndex + 1} ${item.label}`}
                showConfirm={item.name === 'customFields'}
                handleManualModification={handleManualModification(
                  getTextFieldName(item.name),
                  item.name,
                )}
                manualModifiable={item.manualModifiable}
              >
                <TextField
                  name={getTextFieldName(item.name)}
                  label={item.label}
                  variant={expandItems.includes(item.name) ? 'expand' : undefined}
                  labelName={
                    item.name === 'customFields'
                      ? `characters[${arrayIndex}].customFields[0].name`
                      : ''
                  }
                  isLabelEditable={item.name === 'customFields' && mode === 'edit'}
                  readOnly={mode === 'view'}
                />
              </PlannerFieldWithButton>
            ) : (
              <TextField
                key={`planner-character-item-${index}`}
                name={getTextFieldName(item.name)}
                label={item.label}
                variant={expandItems.includes(item.name) ? 'expand' : undefined}
                readOnly={mode === 'view'}
              />
            ),
          )}
        </div>
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
          handleRemoveCharacter(arrayIndex)

          trackEvent('planner_item_delete', {
            item_name: '등장인물',
          })
        }}
      />
    </div>
  )
}

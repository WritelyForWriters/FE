import { useEffect } from 'react'

import { PLANNER_CHARACTER_ITEMS } from 'constants/planner/plannerConstants'
import { useAtom } from 'jotai'
import { useFormContext, useWatch } from 'react-hook-form'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { CharacterFormValues } from 'types/planner/plannerSynopsisFormValues'

import FillButton from '@components/buttons/FillButton'
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
    if (!watchedValues) return

    setFormValues(
      formValues.characters.map((character, index) =>
        index === arrayIndex ? watchedValues : character,
      ),
    )
  }, [watchedValues, arrayIndex, setFormValues])

  return (
    <div className={cx('list')}>
      <div className={cx('list__title')}>
        <span>등장인물 {arrayIndex + 1}</span>
        <div className={cx('list__title__buttons')}>
          <div className={cx('list__title__buttons__delete')}>
            <FillButton
              size="small"
              variant="secondary"
              type="button"
              onClick={() => handleRemoveCharacter(arrayIndex)}
            >
              삭제하기
            </FillButton>
          </div>

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
                  isLabelEditable={item.name === 'customFields'}
                />
              </PlannerFieldWithButton>
            ) : (
              <TextField
                key={`planner-character-item-${index}`}
                name={getTextFieldName(item.name)}
                label={item.label}
                variant={expandItems.includes(item.name) ? 'expand' : undefined}
              />
            ),
          )}
        </div>
      )}
    </div>
  )
}

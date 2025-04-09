import { useEffect } from 'react'

import { PLANNER_CHARACTER_ITEMS } from 'constants/planner/plannerConstants'
import { useSetAtom } from 'jotai'
import { useFormContext, useWatch } from 'react-hook-form'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { CharacterFormValues } from 'types/planner/plannerSynopsisFormValues'

import FillButton from '@components/buttons/FillButton'
import TextField from '@components/text-field/TextField'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterFormList.module.scss'

const cx = classNames.bind(styles)

const expandItems = ['intro', 'customFields']

interface PlannerCharacterFormListProps {
  paramsId: string
  arrayIndex: number
  characterId: string
  character: CharacterFormValues
  handleRemoveCharacter: (id: string) => void
}

export default function PlannerCharacterFormList({
  paramsId,
  arrayIndex,
  characterId,
  character,
  handleRemoveCharacter,
}: PlannerCharacterFormListProps) {
  const { isOpen, onToggle } = useCollapsed(true)
  const { control, setValue } = useFormContext()
  const setCharacters = useSetAtom(plannerCharacterByIdAtom(paramsId))

  const watchedValues: CharacterFormValues = useWatch({
    control,
    name: `characters[${characterId}]`,
  })

  // NOTE(hajae): local storage 저장
  useEffect(() => {
    if (!watchedValues) return

    setCharacters((prev: Record<string, CharacterFormValues>) => ({
      ...prev,
      [characterId]: {
        ...prev[characterId],
        ...watchedValues,
      },
    }))
  }, [watchedValues, characterId, setCharacters])

  // NOTE(hajae): local storage에 저장된 값으로 초기화
  useEffect(() => {
    setValue(`characters[${characterId}]`, character)
  }, [])

  const getTextFieldName = (name: string) => {
    // NOTE(hajae): customFields는 배열이나, 디자인상 Character Fields에서는 하나의 필드를 사용 중
    if (name === 'customFields' && character.customFields) {
      return `characters[${characterId}].customFields[0].content`
    } else {
      return `characters[${characterId}].${name}`
    }
  }

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
              onClick={() => handleRemoveCharacter(characterId)}
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
          {PLANNER_CHARACTER_ITEMS.map((item, index) => (
            <TextField
              key={`planner-character-item-${index}`}
              name={getTextFieldName(item.name)}
              label={item.label}
              variant={expandItems.includes(item.name) ? 'expand' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

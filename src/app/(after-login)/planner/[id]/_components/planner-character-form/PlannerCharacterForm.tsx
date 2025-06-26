'use client'

import { useParams } from 'next/navigation'

import { useEffect } from 'react'

import { NEW_PLANNER_CHARACTER } from 'constants/planner/plannerConstants'
import { useAtom, useAtomValue } from 'jotai'
import { useFormContext } from 'react-hook-form'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { PlannerTemplatesModeAtom } from 'store/plannerModeAtoms'

import FillButton from '@components/buttons/FillButton'

import PlannerCharacterFormList from '../planner-character-form-list/PlannerCharacterFormList'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterForm.module.scss'

const cx = classNames.bind(styles)

interface PlannerCharacterFormProps {
  isPending: boolean
  handleManualModification: (
    name: string,
    section: string,
  ) => (value: string, inputValue: string) => Promise<boolean>
}

export default function PlannerCharacterForm({
  handleManualModification,
}: PlannerCharacterFormProps) {
  const params = useParams<{ id: string }>()
  const { setValue } = useFormContext()
  const mode = useAtomValue(PlannerTemplatesModeAtom)
  const [formValues, setFormValues] = useAtom(plannerCharacterByIdAtom(params.id))

  const handleAddCharacter = () => {
    setFormValues([...formValues.characters, NEW_PLANNER_CHARACTER], 'character')
  }

  const handleRemoveCharacter = (index: number) => {
    const newCharacters = formValues.characters.filter((_, i) => i !== index)
    setFormValues(newCharacters, 'character')
  }

  // NOTE(hajae): 캐릭터 추가 삭제 후, local storage만 갱신하고 있기때문에 character 수가 달라지면 set 해준다.
  useEffect(() => {
    setValue('characters', formValues.characters)
  }, [setValue, formValues.characters.length])

  return (
    <div className={cx('character-form')} id="heading3">
      <div className={cx('character-form__title')}>
        <span>등장 인물</span>
        {mode === 'edit' && (
          <FillButton size="small" variant="secondary" onClick={handleAddCharacter} type="button">
            추가하기
          </FillButton>
        )}
      </div>

      {formValues.characters &&
        formValues.characters.map((character, index) => (
          <PlannerCharacterFormList
            key={character.id ? `${character.id}-${index}` : `${index}`}
            paramsId={params.id}
            arrayIndex={index}
            handleRemoveCharacter={handleRemoveCharacter}
            handleManualModification={handleManualModification}
          />
        ))}
    </div>
  )
}

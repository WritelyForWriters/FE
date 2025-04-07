'use client'

import { useParams } from 'next/navigation'

import { useAtom } from 'jotai'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'
import { v4 as uuidv4 } from 'uuid'

import FillButton from '@components/buttons/FillButton'

import { CharacterFormValues } from '../../../../../types/planner/plannerSynopsisFormValues'
import PlannerCharacterFormList from '../planner-character-form-list/PlannerCharacterFormList'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterForm.module.scss'

const cx = classNames.bind(styles)

const createCharacter = (): CharacterFormValues => ({
  intro: '',
  name: '',
  age: undefined,
  gender: '',
  occupation: '',
  appearance: '',
  personality: '',
  relationship: '',
  customFields: [],
})

export default function PlannerCharacterForm() {
  const params = useParams<{ id: string }>()
  const [characters, setCharacters] = useAtom(plannerCharacterByIdAtom(params.id))

  const handleAddCharacter = () => {
    setCharacters((prev) => ({
      ...prev,
      [uuidv4()]: createCharacter(),
    }))
  }

  const handleRemoveCharacter = (id: string) => {
    setCharacters((prev) => {
      const nextCharacters = { ...prev }
      delete nextCharacters[id]
      return nextCharacters
    })
  }

  return (
    <div className={cx('character-form')} id="heading3">
      <div className={cx('character-form__title')}>
        <span>등장 인물</span>
        <FillButton size="small" variant="secondary" onClick={handleAddCharacter} type="button">
          추가하기
        </FillButton>
      </div>

      {characters &&
        Object.entries(characters).map(([id, character], index) => (
          <PlannerCharacterFormList
            key={id}
            paramsId={params.id}
            characterId={id}
            character={character}
            arrayIndex={index}
            handleRemoveCharacter={handleRemoveCharacter}
          />
        ))}
    </div>
  )
}

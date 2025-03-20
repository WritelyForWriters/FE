'use client'

import { useState } from 'react'

import FillButton from '@components/buttons/FillButton'

import { CharacterFormValues } from '../../types/plannerSynopsisFormValue'
import PlannerCharacterFormList from '../planner-character-form-list/PlannerCharacterFormList'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterForm.module.scss'

const cx = classNames.bind(styles)

const mockCharacter: CharacterFormValues = {
  characterId: '',
  intro: '',
  name: '',
  age: NaN,
  gender: '',
  occupation: '',
  appearance: '',
  personality: '',
  relationship: '',
}

export default function PlannerCharacterForm() {
  const [characters, setCharacters] = useState<CharacterFormValues[]>([mockCharacter])

  const handleAddCharacter = () => {
    setCharacters([...characters, mockCharacter])
  }

  return (
    <div className={cx('character-form')}>
      <div className={cx('character-form__title')}>
        <span>등장 인물</span>
        <FillButton size="small" variant="secondary" onClick={handleAddCharacter} type="button">
          추가하기
        </FillButton>
      </div>

      {characters &&
        characters.map((character, index) => (
          <PlannerCharacterFormList key={character.name + index} arrayIndex={index} />
        ))}
    </div>
  )
}

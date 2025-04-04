'use client'

import { useEffect, useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import FillButton from '@components/buttons/FillButton'

import { CharacterFormValues } from '../../../../../types/planner/plannerSynopsisFormValues'
import PlannerCharacterFormList from '../planner-character-form-list/PlannerCharacterFormList'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterForm.module.scss'

const cx = classNames.bind(styles)

const createCharacter = (): CharacterFormValues => ({
  id: '',
  intro: '',
  name: '',
  age: undefined,
  gender: '',
  occupation: '',
  appearance: '',
  personality: '',
  relationship: '',
})

export default function PlannerCharacterForm() {
  const [characters, setCharacters] = useState<CharacterFormValues[]>([])

  // NOTE(hajae): uuidv4는 client side에서 실행되는 함수 인데,
  // useState를 초기화할 때(ssr) 사용하면 에러가 발생하므로 최초 마운트 후 등장인물 추가
  useEffect(() => {
    setCharacters([{ ...createCharacter(), id: uuidv4() }])
  }, [])

  const handleAddCharacter = () => {
    setCharacters((prev) => [...prev, { ...createCharacter(), id: uuidv4() }])
  }

  const handleRemoveCharacter = (id: string) => {
    setCharacters((prev) => prev.filter((character) => character.id !== id))
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
        characters.map((character, index) => (
          <PlannerCharacterFormList
            key={character.id}
            characterId={character.id}
            arrayIndex={index}
            handleRemoveCharacter={handleRemoveCharacter}
          />
        ))}
    </div>
  )
}

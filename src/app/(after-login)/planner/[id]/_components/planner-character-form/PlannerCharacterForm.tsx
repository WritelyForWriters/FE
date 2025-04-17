'use client'

import { useParams } from 'next/navigation'

import { useAtom } from 'jotai'
import { plannerCharacterByIdAtom } from 'store/plannerAtoms'

import FillButton from '@components/buttons/FillButton'

import { CharacterFormValues } from '../../../../../types/planner/plannerSynopsisFormValues'
import PlannerCharacterFormList from '../planner-character-form-list/PlannerCharacterFormList'

import classNames from 'classnames/bind'

import styles from './PlannerCharacterForm.module.scss'

const cx = classNames.bind(styles)

export default function PlannerCharacterForm() {
  const params = useParams<{ id: string }>()
  const [characters, setCharacters] = useAtom<CharacterFormValues[]>(
    plannerCharacterByIdAtom(params.id),
  )

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
    customFields: [
      {
        id: '',
        name: '',
        content: '',
      },
    ],
  })

  const handleAddCharacter = () => {
    setCharacters((prev) => [...prev, createCharacter()])
  }

  const handleRemoveCharacter = (index: number) => {
    setCharacters((prev) => {
      const next = [...prev]
      next.splice(index, 1)
      return next
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
        characters.map((character, index) => (
          <PlannerCharacterFormList
            key={character.id || index}
            paramsId={params.id}
            character={character}
            arrayIndex={index}
            handleRemoveCharacter={handleRemoveCharacter}
          />
        ))}
    </div>
  )
}

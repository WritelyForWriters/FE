import { atom } from 'jotai'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { CharacterFormValues } from 'types/planner/plannerSynopsisFormValues'
import { v4 as uuidv4 } from 'uuid'

type PlannerActiveTabType = 'synopsis' | 'ideaNote'

export const plannerActiveTabAtom = atom<PlannerActiveTabType>('synopsis')

type PlannerCharacterFormValuesType = PlannerCharacterFormValueType[]
type PlannerCharacterFormValueType = {
  plannerId: string
  characters: Record<string, CharacterFormValues>
}

// NOTE(hajae): atom with local storage
export const plannerCharacterFormValuesAtom = atomWithStorage<PlannerCharacterFormValuesType>(
  'plannerCharacterFormValues',
  [],
)

export const plannerCharacterByIdAtom = atomFamily((plannerId: string) => {
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

  const baseAtom = atom(
    (get) => {
      const allCharacters = get(plannerCharacterFormValuesAtom)
      return allCharacters.find((c) => c.plannerId === plannerId)?.characters ?? {}
    },
    (
      get,
      set,
      update:
        | Record<string, CharacterFormValues>
        | ((prev: Record<string, CharacterFormValues>) => Record<string, CharacterFormValues>),
    ) => {
      const allCharacters = get(plannerCharacterFormValuesAtom)
      const idx = allCharacters.findIndex((c) => c.plannerId === plannerId)

      const prevCharacters = idx === -1 ? {} : allCharacters[idx].characters
      const newCharacters = typeof update === 'function' ? update(prevCharacters) : update

      if (idx === -1) {
        set(plannerCharacterFormValuesAtom, [
          ...allCharacters,
          { plannerId, characters: newCharacters },
        ])
      } else {
        const tempCharacters = [...allCharacters]
        tempCharacters[idx] = { plannerId, characters: newCharacters }
        set(plannerCharacterFormValuesAtom, tempCharacters)
      }
    },
  )

  // NOTE(hajae): 마운트 시점에 localStorage에서 데이터 가져와서 비어있으면 초기값으로 character 생성
  // 컴포넌트에서 useEffect로 확인 후 생성할 경우 렌더링시 무조건 빈 배열을 받아오기 때문에 생성된 character을 초기화 함
  baseAtom.onMount = (set) => {
    const savedCharacters = JSON.parse(
      localStorage.getItem('plannerCharacterFormValues') || '[]',
    ) as PlannerCharacterFormValuesType

    const target = savedCharacters.find((character) => character.plannerId === plannerId)

    if (!target) {
      set({
        [uuidv4()]: createCharacter(),
      })
    }
  }

  return baseAtom
})

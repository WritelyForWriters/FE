import { Getter, Setter, atom } from 'jotai'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { CharacterFormValues } from 'types/planner/plannerSynopsisFormValues'

type PlannerActiveTabType = 'synopsis' | 'ideaNote'

export const plannerActiveTabAtom = atom<PlannerActiveTabType>('synopsis')

type PlannerCharacterFormValuesType = PlannerCharacterFormValueType[]
type PlannerCharacterFormValueType = {
  plannerId: string
  characters: CharacterFormValues[]
}

// NOTE(hajae): atom with local storage
export const plannerCharacterFormValuesAtom = atomWithStorage<PlannerCharacterFormValuesType>(
  'plannerCharacterFormValues',
  [],
)

export const plannerCharacterByIdAtom = atomFamily((plannerId: string) => {
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
    customFields: [],
  })

  const getCharactersByPlannerId = (get: Getter) => {
    const all = get(plannerCharacterFormValuesAtom)
    return all.find((entry) => entry.plannerId === plannerId)?.characters ?? []
  }

  const updateCharactersByPlannerId = (
    get: Getter,
    set: Setter,
    update: CharacterFormValues[] | ((prev: CharacterFormValues[]) => CharacterFormValues[]),
  ) => {
    const all = get(plannerCharacterFormValuesAtom)
    const index = all.findIndex((entry) => entry.plannerId === plannerId)
    const prev = index === -1 ? [] : all[index].characters
    const next = typeof update === 'function' ? update(prev) : update

    const updatedAll =
      index === -1
        ? [...all, { plannerId, characters: next }]
        : all.map((entry, i) => (i === index ? { ...entry, characters: next } : entry))

    set(plannerCharacterFormValuesAtom, updatedAll)
  }

  const baseAtom = atom(getCharactersByPlannerId, updateCharactersByPlannerId)

  // NOTE(hajae): 마운트 시점에 localStorage에서 데이터 가져와서 비어있으면 초기값으로 character 생성
  // 컴포넌트에서 useEffect로 확인 후 생성할 경우 렌더링시 무조건 빈 배열을 받아오기 때문에 생성된 character을 초기화 함
  baseAtom.onMount = (set) => {
    const saved = JSON.parse(
      localStorage.getItem('plannerCharacterFormValues') || '[]',
    ) as PlannerCharacterFormValuesType
    const entry = saved.find((item) => item.plannerId === plannerId)

    if (!entry || entry.characters.length === 0) {
      set([createCharacter()])
    }
  }

  return baseAtom
})

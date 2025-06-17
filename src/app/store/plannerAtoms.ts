import { NEW_PLANNER_CHARACTER } from 'constants/planner/plannerConstants'
import { Getter, Setter, atom } from 'jotai'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import {
  CharacterFormValues,
  PlannerSynopsisFormValues,
} from 'types/planner/plannerSynopsisFormValues'

type PlannerActiveTabType = 'synopsis' | 'ideaNote'

export const plannerActiveTabAtom = atom<PlannerActiveTabType>('synopsis')

type PlannerTemplateFormValuesType = PlannerTemplateFormValueType[]
type PlannerTemplateFormValueType = {
  plannerId: string
  isInitialized: boolean
} & PlannerSynopsisFormValues

// NOTE(hajae): atom with local storage
export const plannerCharacterFormValuesAtom = atomWithStorage<PlannerTemplateFormValuesType>(
  'plannerCharacterFormValues',
  [],
)

export const plannerCharacterByIdAtom = atomFamily((plannerId: string) => {
  const getCharactersByPlannerId = (get: Getter) => {
    const all = get(plannerCharacterFormValuesAtom)
    return (
      all.find((entry) => entry.plannerId === plannerId) ??
      ({
        plannerId,
        ...PlannerSynopsisFormValues.from(undefined),
      } as PlannerTemplateFormValueType)
    )
  }

  const updateCharactersByPlannerId = (
    get: Getter,
    set: Setter,
    update: CharacterFormValues[] | PlannerSynopsisFormValues,
    type: 'character' | 'form' | 'init',
  ) => {
    const formValues = get(plannerCharacterFormValuesAtom)

    switch (type) {
      case 'init':
        set(plannerCharacterFormValuesAtom, [
          ...formValues,
          { plannerId, ...(update as PlannerSynopsisFormValues), isInitialized: false },
        ])
        break
      case 'form':
        const updatedForm = formValues.map((form) =>
          form.plannerId === plannerId
            ? { plannerId, isInitialized: true, ...(update as PlannerSynopsisFormValues) }
            : form,
        )
        set(plannerCharacterFormValuesAtom, updatedForm)
        break
      case 'character':
        const updatedCharacters = formValues.map((form) =>
          form.plannerId === plannerId
            ? { ...form, characters: update as CharacterFormValues[] }
            : form,
        )
        set(plannerCharacterFormValuesAtom, updatedCharacters)
        break
      default:
        break
    }
  }

  const baseAtom = atom(getCharactersByPlannerId, updateCharactersByPlannerId)

  // NOTE(hajae): 마운트 시점에 localStorage에서 데이터 가져와서 비어있으면 초기값으로 character 생성
  // 컴포넌트에서 useEffect로 확인 후 생성할 경우 렌더링시 무조건 빈 배열을 받아오기 때문에 생성된 character을 초기화 함
  baseAtom.onMount = (set) => {
    const saved = JSON.parse(
      localStorage.getItem('plannerCharacterFormValues') || '[]',
    ) as PlannerTemplateFormValuesType
    const entry = saved.find((item) => item.plannerId === plannerId)

    if (!entry) {
      const initValue = {
        plannerId,
        ...PlannerSynopsisFormValues.from(undefined),
        characters: [NEW_PLANNER_CHARACTER],
        isInitialized: false,
      }
      set(initValue, 'init')
    }
  }

  return baseAtom
})

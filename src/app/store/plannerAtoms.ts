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
  ) => {
    const formValues = get(plannerCharacterFormValuesAtom)
    const hasExisting = formValues.some((form) => form.plannerId === plannerId)

    // NOTE(hajae): 캐릭터는 실시간 저장이기때문에 로직 분리
    if (Array.isArray(update)) {
      const updated = formValues.map((form) =>
        form.plannerId === plannerId ? { ...form, characters: [...update] } : form,
      )
      set(plannerCharacterFormValuesAtom, updated)
      return
    }

    if (hasExisting) {
      // NOTE(hajae): 기존 템플릿 업데이트
      const updated = formValues.map((form) =>
        form.plannerId === plannerId
          ? { plannerId, ...(update as PlannerSynopsisFormValues) }
          : form,
      )
      set(plannerCharacterFormValuesAtom, updated)
    } else {
      // NOTE(hajae): 새 템플릿 추가
      const updated = [...formValues, { plannerId, ...(update as PlannerSynopsisFormValues) }]
      set(plannerCharacterFormValuesAtom, updated)
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
      set({
        plannerId,
        ...PlannerSynopsisFormValues.from(undefined),
        characters: [NEW_PLANNER_CHARACTER],
      } as PlannerTemplateFormValueType)
    }
  }

  return baseAtom
})

import { useAtom } from 'jotai'
import {
  AiAssistantType,
  PlannerTemplatesAiAssistant,
  PlannerTemplatesAiAssistantListAtom,
} from 'store/plannerAiAtoms'

export function usePlannerTemplatesAiAssistant() {
  const [list, setList] = useAtom(PlannerTemplatesAiAssistantListAtom)

  const get = (name: string): PlannerTemplatesAiAssistant | undefined =>
    list.find((item) => item.name === name)

  const set = (newItem: PlannerTemplatesAiAssistant) => {
    setList((prev) => {
      const existIndex = prev.findIndex((item) => item.name === newItem.name)
      if (existIndex !== -1) {
        const updated = [...prev]
        updated[existIndex] = newItem
        return updated
      }
      return [...prev, newItem]
    })
  }

  const setType = (name: string, type: AiAssistantType) => {
    setList((prev) => prev.map((item) => (item.name === name ? { ...item, type } : item)))
  }

  const getType = (name: string): AiAssistantType | undefined => {
    return list.find((item) => item.name === name)?.type
  }

  const remove = (name: string) => {
    setList((prev) => prev.filter((item) => item.name !== name))
  }

  const getContent = (name: string): string | undefined => {
    const found = list.find((item) => item.name === name)
    return found?.content
  }

  return {
    get,
    set,
    getType,
    setType,
    remove,
    getContent,
    list,
  }
}

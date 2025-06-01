import { atom } from 'jotai'

export type PlannerTemplatesAiAssistant = {
  name: string
  content: string
  isAiModified: boolean
}

export const PlannerTemplatesAiAssistantListAtom = atom<PlannerTemplatesAiAssistant[]>([])

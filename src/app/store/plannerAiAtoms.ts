import { atom } from 'jotai'

export type PlannerTemplatesAiAssistantList = PlannerTemplatesAiAssistant[]
export type PlannerTemplatesAiAssistant = {
  name: string
  content: string
  isAiModified: boolean
}

export const PlannerTemplatesAiAssistantList = atom<PlannerTemplatesAiAssistantList>([])

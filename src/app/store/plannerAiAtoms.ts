import { atom } from 'jotai'

export type AiAssistantType = 'wait' | 'confirm' | 'retry' | 'cancel'

export type PlannerTemplatesAiAssistant = {
  name: string
  content: string
  isAiModified: boolean
  type: AiAssistantType
}

export const PlannerTemplatesAiAssistantListAtom = atom<PlannerTemplatesAiAssistant[]>([])

import { atom } from 'jotai'

export const PlannerTemplatesModeAtom = atom<'view' | 'edit'>('view')

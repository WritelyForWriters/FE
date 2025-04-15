import { atom } from 'jotai'

export const clickedButtonAtom = atom<'web' | 'favorite' | 'recommend' | null>(null)

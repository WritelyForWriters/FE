import { atom } from 'jotai'

export const clickedButtonAtom = atom<'search' | 'favorite' | 'recommend' | null>(null)

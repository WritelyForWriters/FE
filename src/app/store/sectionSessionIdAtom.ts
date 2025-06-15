import { atom } from 'jotai'

export const sectionSessionIdAtom = atom(new Date().getTime().toString())

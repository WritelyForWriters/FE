import { atom } from 'jotai'

export const chatInputModeAtom = atom<'input' | 'search'>('input')

import { atom } from 'jotai'

export const chatModeAtom = atom<'default' | 'web'>('default')

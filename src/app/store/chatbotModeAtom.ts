import { atom } from 'jotai'

export const chatbotModeAtom = atom<'search' | 'input'>('input')

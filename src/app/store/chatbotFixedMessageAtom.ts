import { atom } from 'jotai'

export const chatbotFixedMessageAtom = atom<{ messageId: string; content: string } | null>(null)

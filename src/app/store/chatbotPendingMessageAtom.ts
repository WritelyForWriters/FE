import { atom } from 'jotai'

export const chatbotPendingMessageAtom = atom<{ prompt: string; content?: string } | null>(null)

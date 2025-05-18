import { atom } from 'jotai'
import { ChatItem } from 'types/chatbot/chatbot'

export const newChatMessagesAtom = atom<ChatItem[] | []>([])

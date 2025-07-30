import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const hasWatchedTutorialAtom = atomWithStorage('hasWatchedTutorial', false)
export const hasWatchedBookselfTutorialAtom = atomWithStorage('hasWatchedBookSelfTutorial', false)
export const isFirstLoginAtom = atom(false)
export const isFirstProductAtom = atom(false)
export const isTutorialRunningAtom = atom(true)

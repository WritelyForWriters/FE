import { atom } from 'jotai'

export const hasWatchedTutorialAtom = atom(!!localStorage.getItem('hasWatchedTutorial'))

import { atom } from 'jotai'

export const hasWatchedBookSelfTutorialAtom = atom(
  !!localStorage.getItem('hasWatchedBookSelfTutorial'),
)

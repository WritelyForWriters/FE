import { atomWithStorage } from 'jotai/utils'

// 튜토리얼을 이미 봤는지 여부를 저장하는 atom
export const tutorialShownAtom = atomWithStorage('tutorial-shown', false)

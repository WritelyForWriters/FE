import { atom } from 'jotai'

type ToolbarType = 'defaultToolbar' | 'aiToolbar'

// 에디터 툴바 상태
export const activeMenuAtom = atom<ToolbarType>('defaultToolbar')

interface TextSelectionRangeType {
  from: number
  to: number
}

// 에디터 selection 상태 (드래그한 텍스트 범위)
export const selectionAtom = atom<TextSelectionRangeType | null>(null)

// prompt 입력 값
export const promptValueAtom = atom('')

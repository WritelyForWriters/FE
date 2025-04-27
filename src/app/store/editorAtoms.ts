import { AUTO_SAVE_MESSAGE } from 'constants/workspace/message'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

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

// 에디터 상태(읽기, 쓰기)
export const isEditableAtom = atom(true)

// 에디터 내용을 로컬스토리지에 저장하기 위한 atom
// atomWithStorage는 기본 로컬스토리지 사용
export const editorContentAtom = (productId: string) => {
  return atomWithStorage(`workspace-${productId}`, '')
}

// 에디터 자동 저장 관련 상태 메세지
export const autoSaveMessageAtom = atom({
  message: AUTO_SAVE_MESSAGE.WRITING,
})

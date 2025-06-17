import { Editor } from '@tiptap/react'

// MEMO(Sohyun): ref를 사용해서 editor를 외부에서도 접근하기 위해 useImperativeHandle애서 정의한 함수 타입
// 그러므로 추후 수정 또는 추가될 수 있는 타입임.
export interface HandleEditor {
  getEditor: () => Editor | null
}

export interface TextSelectionRangeType {
  from: number
  to: number
  text?: string
}

export type ToolbarType = 'defaultToolbar' | 'auto-modify' | 'user-modify' | 'feedback' | 'memo'
export type AiassistantOptionType = 'auto-modify' | 'user-modify' | 'feedback' | 'free-chat'
export type ActionOptionType = 'apply' | 'recreate' | 'cancel' | 'archive'

// 응답 평가 타입
export interface EvaluateStateType {
  assistantId: string | null
  isGoodSelected: boolean
  isBadSelected: boolean
  isArchived: boolean
}

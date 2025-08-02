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

// 세션스토리지에 저장되는 에디터 글자수 카운트 타입
export interface CharCountSession {
  productId: string
  initialCharCount: number // 세션 시작 시 글자 수
  currentGoal: number // 현재 목표 글자 수
  reachedGoals: number[] // 달성한 목표들 기록
  sessionStartedAt: string // 세션 시작 시간
}

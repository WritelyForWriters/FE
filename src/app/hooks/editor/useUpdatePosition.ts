import { RefObject, useCallback, useEffect, useState } from 'react'

import { Editor } from '@tiptap/react'
import { TextSelectionRangeType } from 'types/common/editor'

const HEADER_HEIGHT = 174
const SELECT_MENU_WIDTH = 260

interface MenuPosition {
  top: number
  left: number
}

/**
 * 에디터에서 선택한 텍스트 영역 기준으로 ai-assistant 메뉴 위치를 계산하는 훅
 *  BubbleMenu 내부에 위치하면 BubbleMenu는 에디터 내용 변경 시 초기화되는 문제로 직접 좌표를 계산한 UI를 구현하기 위함
 * @param editor 에디터 인스턴스
 * @param selectionRef 선택 영역 Ref
 */
const useUpdatePosition = (
  editor: Editor,
  selectionRef: RefObject<TextSelectionRangeType | null>,
): MenuPosition => {
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, left: 0 })

  const updateMenuPosition = useCallback(() => {
    if (!editor || !selectionRef?.current) return

    const { to } = selectionRef.current
    const view = editor.view

    try {
      // 선택한 영역의 마지막 위치 기준으로 좌표 구함 (뷰포트 기준)
      const { top: selectionTopInViewport, left: selectionLeftInViewport } = view.coordsAtPos(to)

      // 에디터 DOM의 좌측 위치와 너비 (뷰포트 기준)
      const { left: editorLeftInViewport, width: editorWidth } = view.dom.getBoundingClientRect()

      // 에디터 내부 기준 선택한 텍스트의 left 좌표
      const selectionLeftInEditor = selectionLeftInViewport - editorLeftInViewport

      // 에디터 부모 컨테이너의 scrollTop 값
      const scrollTopFromParent = view.dom.closest('[data-editor-parent]')?.scrollTop ?? 0

      // 메뉴 left 값 계산 (좌측 shadow 고려해서 +15)
      let calculatedMenuLeft = selectionLeftInEditor + 15

      // 메뉴가 에디터 너비를 초과하지 않도록 조정
      if (calculatedMenuLeft + SELECT_MENU_WIDTH >= editorWidth) {
        calculatedMenuLeft = selectionLeftInEditor - SELECT_MENU_WIDTH
      }

      // 최종 메뉴 위치 설정 (부모 스크롤 및 헤더 높이 고려)
      setMenuPosition({
        top: selectionTopInViewport - HEADER_HEIGHT + scrollTopFromParent + 35,
        left: calculatedMenuLeft,
      })
    } catch (error) {
      console.error(error)
    }
  }, [editor, selectionRef])

  useEffect(() => {
    updateMenuPosition()
  }, [editor, updateMenuPosition])

  return menuPosition
}

export default useUpdatePosition

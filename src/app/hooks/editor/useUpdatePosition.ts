import { RefObject, useCallback, useEffect, useState } from 'react'

import { Editor } from '@tiptap/react'
import { TextSelectionRangeType } from 'types/common/editor'

interface MenuPosition {
  top: number
  left: number
}

/**
 * 에디터에서 선택한(드래그한) 텍스트 영역 기준으로 ai-assistant 메뉴 위치를 계산하는 훅
 * MEMO(Sohyun): 텍스트 에디터에서 특정 영역을 선택했을 때, 그 선택 영역 기준으로 메뉴 UI를 띄우기 위한 좌표 계산
 * BubbleMenu 내부에 위치하면 BubbleMenu는 에디터 내용 변경 시 초기화되는 문제로 직접 좌표를 계산한 UI를 구현하기 위함
 * @param editor 에디터 인스턴스
 * @param selectionRef 선택 영역 Ref
 */

const useUpdatePosition = (
  editor: Editor,
  selectionRef: RefObject<TextSelectionRangeType | null>,
): MenuPosition => {
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0 })

  // 선택 영역의 위치를 계산하는 함수
  const updatePosition = useCallback(() => {
    if (!editor || !selectionRef?.current) return

    const { to } = selectionRef.current
    const view = editor.view

    try {
      // 선택된 텍스트의 마지막 위치(to)에서 해당 위치의 좌표를 구함
      // MEMO(Sohyun): view.coordsAtPos(pos)는 에디터 문서 내 특정 문자 인덱스(pos)에 해당하는 브라우저 상의 실제 좌표를 반환하는 Prosemirror API
      // (참고) https://prosemirror.net/docs/ref/#view.EditorView.coordsAtPos
      const endCoords = view.coordsAtPos(to)

      // 에디터 요소의 위치 정보 가져오기
      const editorRect = editor.view.dom.getBoundingClientRect()

      // 스크롤 위치를 고려한 절대 위치 계산
      // 뷰포트 기준 좌표(endCoords)에 스크롤 위치를 더하지 않음 (coordsAtPos는 이미 viewport 기준 좌표 반환)
      setPosition({
        top: endCoords.bottom,
        left: Math.max(editorRect.left, endCoords.left),
      })
    } catch (error) {
      console.error(error)
    }
  }, [editor, selectionRef])

  // 초기 위치 설정
  useEffect(() => {
    updatePosition()
  }, [editor, updatePosition])

  // 스크롤 이벤트 리스너 등록
  useEffect(() => {
    if (!editor) return

    const handleScroll = () => {
      updatePosition()
    }

    // 에디터 컨테이너 또는 상위 요소에 스크롤 이벤트 리스너 추가
    const editorDOM = editor.view.dom
    const editorContainer = editorDOM?.closest('.tiptap') || editorDOM
    editorContainer.addEventListener('scroll', handleScroll)

    // 전체 페이지 스크롤 감지 > 그래야 스크롤해도 선택한 구간 밑에 위치가 고정될 수 있음
    window.addEventListener('scroll', handleScroll)

    return () => {
      editorContainer.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [editor, updatePosition])

  return position
}

export default useUpdatePosition

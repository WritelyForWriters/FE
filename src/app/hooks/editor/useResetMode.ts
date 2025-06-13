import { useCallback, useEffect } from 'react'

import { Editor } from '@tiptap/react'
import { useAtom } from 'jotai'
import { activeMenuAtom } from 'store/editorAtoms'
import { ToolbarType } from 'types/common/editor'

interface UseResetModeProps {
  editor: Editor | null
  mode: ToolbarType
}

/**
 * 메모 툴바 하이라이트 및 툴바 모드 초기화 훅
 * MEMO(Sohyun): 추후에 다른 mode 추가한다면 확장 가능하도록 코드 수정 필요
 * @param editor 텍스트 에디터 인스턴스
 * @param mode ToolbarType 타입
 * @returns 메모 툴바 초기화 함수 (필요 시 주석 제거 후 사용)
 */

export default function useResetMode({ editor, mode }: UseResetModeProps) {
  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom)

  // 메모 툴바 초기화 함수
  const resetMemoMenu = useCallback(() => {
    if (editor && activeMenu === mode) {
      editor.commands.unsetBackgroundHighlight()
      setActiveMenu('defaultToolbar')
    }
  }, [editor, activeMenu, setActiveMenu, mode])

  useEffect(() => {
    // 메모 모드가 아니면 이벤트 등록하지 않음
    if (activeMenu !== 'memo') return

    const handleMouseDown = (e: MouseEvent) => {
      // 버블 메뉴 요소 (tippy-box 클래스를 가진 첫 번째 요소)
      const bubbleMenu = document.querySelector('.tippy-box')

      // 클릭된 요소가 버블 메뉴 내부인지 확인
      const isClickInsideBubbleMenu = bubbleMenu ? bubbleMenu.contains(e.target as Node) : false

      // 버블 메뉴 외부 클릭 시 메모 모드 초기화
      if (!isClickInsideBubbleMenu) {
        resetMemoMenu()
      }
    }

    document.addEventListener('mousedown', handleMouseDown, true)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true)
    }
  }, [resetMemoMenu, activeMenu])

  // MEMO(Sohyun): 필요시 return 값 추가
  // return {
  //   resetMemoMenu,
  // }
}

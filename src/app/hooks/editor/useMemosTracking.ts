import { useEffect, useRef } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Editor } from '@tiptap/react'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { useAtomValue } from 'jotai'
import { productIdAtom } from 'store/productsAtoms'
import { TextSelectionRangeType } from 'types/common/editor'
import { MemosDto } from 'types/memos/memosResponseType'

import { useUpdateMemos } from '@hooks/memos/useMemosMutation'

/**
 * MEMO(Sohyun)
 * 텍스트 에디터에서 메모 기능을 관리하는 커스텀 훅으로, 메모와 연결된 하이라이트 영역(mark)를 추적
 * 에디터에서 메모 구간이 완전히 지워질때만 메모 API를 호출하여 서버와 동기화
 * @param editor 텍스트 에디터 인스턴스
 * @param memoList 메모 목록
 * @returns findMemoHighlight 메모 하이라이트 존재 여부를 확인하는 함수
 */

export function useMemoTracking(editor: Editor, memoList?: MemosDto[]) {
  const queryClient = useQueryClient()

  const productId = useAtomValue(productIdAtom)
  const lastEditorContentRef = useRef('') // 마지막 에디터 내용을 저장하는 참조 객체
  const processedMemosRef = useRef(new Set()) // 이미 처리된 메모 ID를 저장하는 Set

  const updateMemosMutation = useUpdateMemos()

  // 하이라이트 존재 여부를 추적하는 참조 객체 추가
  const highlightExistsRef = useRef<Record<string, boolean>>({})

  // --메모 ID에 해당하는 하이라이트 마크를 에디터에서 찾는 함수
  const findMemoHighlight = (memoId: string) => {
    if (!editor) return null

    let highlightRange: TextSelectionRangeType | null = null

    // Tiptap 에디터(ProseMirror 기반)에서 제공하는 문서 노드 탐색 메소드
    // descendants 메소드는 문서의 모든 자식 노드를 순회하면서 각 노드에 대해 콜백 함수를 실행
    editor.state.doc.descendants((node, pos) => {
      if (highlightRange) return false

      // mark 태그를 순회하면서 메모 하이라이터가 있고, memoId와 일치하는 경우 하이라이트 위치 찾기
      node.marks.forEach((mark) => {
        if (mark.type.name === 'underlineHighlight' && mark.attrs.memoId === memoId) {
          const start = pos // 하이라이트 시작 위치
          const end = pos + node.nodeSize // 하이라이트 종료 위치
          highlightRange = { from: start, to: end, text: node.textContent } // 하이라이트 텍스트
        }
      })
      // highlightRange가 null 또는 undefined인 경우 (!highlightRange가 true인 경우) 계속 탐색
      return !highlightRange
    })
    // 하이라이트를 찾은 경우 해당 하이라이트의 시작 위치, 끝 위치, 텍스트 내용을 담은 객체 반환 ex. {from: 140, to: 152, text: '메모한 구간임'}
    return highlightRange
  }

  // --메모 업데이트 함수
  const updateMemoSelectedText = async (memo: MemosDto, newText: string | null) => {
    try {
      await updateMemosMutation.mutateAsync({
        productId,
        memoId: memo.id,
        data: {
          title: newText !== null ? newText : '',
          content: memo.content,
          selectedText: newText !== null ? newText : '',
          startIndex: memo.startIndex,
          endIndex: memo.endIndex,
        },
      })
      // 메모 리스트 갱신
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.MEMO_LIST],
      })
    } catch (error) {
      console.error(error)
    }
  }

  // --에디터 변경 감지 및 삭제된 메모 처리
  useEffect(() => {
    if (!editor || !memoList || memoList.length === 0) return

    // 초기 에디터 내용을 JSON 문자열로 저장 > 에디터 내용 변화를 감지하기 위한 기준
    lastEditorContentRef.current = JSON.stringify(editor.getJSON())

    // 처리된 메모 초기화 > processedMemosRef는 이미 처리된 메모 ID를 추적하는 Set 객체
    processedMemosRef.current = new Set()

    // 초기 하이라이트 상태 설정
    memoList.forEach((memo) => {
      const highlightExists = !!findMemoHighlight(memo.id)
      highlightExistsRef.current[memo.id] = highlightExists
    })

    const handleEditorUpdate = () => {
      // 이전 내용과 현재 내용이 다른 경우에만 처리
      const currentContent = JSON.stringify(editor.getJSON())
      if (currentContent === lastEditorContentRef.current) return

      // 변경 감지 플래그
      let hasChanges = false

      // 내용이 변경되었으므로 모든 메모에 대해 하이라이트 확인
      memoList.forEach((memo) => {
        const currentHighlightExists = !!findMemoHighlight(memo.id) // 현재 에디터에 해당 메모 ID의 하이라이트가 존재하는지 확인 > boolean 반환
        const previousHighlightExists = highlightExistsRef.current[memo.id] // 이전에 저장된 하이라이트 존재 여부

        // 하이라이트가 이전에 존재했지만 지금은 없는 경우에만 API 호출(즉, 메모 구간이 완전히 사라진 경우에만)
        if (
          previousHighlightExists && // 이전에 하이라이트가 있고,
          !currentHighlightExists && // 현재는 하이라이트가 없고,
          !processedMemosRef.current.has(memo.id) // 아직 처리되지 않은 메모인 경우에만
        ) {
          updateMemoSelectedText(memo, null)
          processedMemosRef.current.add(memo.id)
          hasChanges = true
        }

        // 현재 하이라이트 상태 업데이트
        highlightExistsRef.current[memo.id] = currentHighlightExists
      })

      // 변경된 사항이 있을 때만 현재 내용 저장
      if (hasChanges) {
        lastEditorContentRef.current = currentContent
      }
    }

    // 디바운싱
    let timeoutId: NodeJS.Timeout
    const debouncedUpdateHandler = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleEditorUpdate, 1000) // 1초 디바운스
    }

    // 에디터 업데이트 이벤트 리스너 등록
    editor.on('update', debouncedUpdateHandler)
    return () => {
      editor.off('update', debouncedUpdateHandler)
      clearTimeout(timeoutId)
    }
  }, [editor, memoList])

  return {
    findMemoHighlight,
  }
}

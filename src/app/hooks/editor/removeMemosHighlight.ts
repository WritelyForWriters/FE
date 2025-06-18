import { Editor } from '@tiptap/react'
import { TextSelectionRangeType } from 'types/common/editor'

/**
 * MEMO(Sohyun)
 * 특정 메모와 연결된 영역(mark)의 하이라이트를 제거하는 함수
 * 메모 패널에서 메모가 삭제될 때 해당 구간에 대한 underlineHighlight가 사라지도록 구현
 * @param editor 텍스트 에디터 인스턴스
 * @param memoId 메모 ID
 */

export default function removeMemosHighlight(editor: Editor, memoId: string) {
  if (!editor) return null

  const highlightRanges: TextSelectionRangeType[] = []

  // Tiptap 에디터(ProseMirror 기반)에서 제공하는 문서 노드 탐색 메소드
  // descendants 메소드는 문서의 모든 자식 노드를 순회하면서 각 노드에 대해 콜백 함수를 실행
  // 모든 노드를 순회하면서 일치하는 memoId를 가진 mark 태그 찾기
  editor.state.doc.descendants((node, pos) => {
    // mark 태그를 순회하면서 메모 하이라이터가 있고, memoId와 일치하는 경우 하이라이트 위치 저장
    node.marks.forEach((mark) => {
      if (mark.type.name === 'underlineHighlight' && mark.attrs.memoId === memoId) {
        const start = pos // 하이라이트 시작 위치
        const end = pos + node.nodeSize // 하이라이트 종료 위치
        highlightRanges.push({ from: start, to: end }) // 하이라이트 구간을 배열에 추가
      }
    })
    // false를 반환하지 않고 계속 순회
    return true
  })

  // MEMO(Sohyun): 기존 코드 주석처리
  // if (isFound && highlightRange) {
  //   editor.commands.setTextSelection(highlightRange)
  //   editor.commands.unsetMark('underlineHighlight')

  //   // 선택 영역 초기화
  //   editor.commands.setTextSelection({ from: 0, to: 0 })
  // }

  // 찾은 모든 하이라이트 범위에 대해 처리
  if (highlightRanges.length > 0) {
    // ProseMirror Transaction을 사용하여 모든 하이라이트를 한 번에 제거
    const { tr } = editor.state
    let transaction = tr

    // 각 범위에 대해 mark 제거
    highlightRanges.forEach((range) => {
      transaction = transaction.removeMark(
        range.from,
        range.to,
        editor.schema.marks.underlineHighlight,
      )
    })

    // 트랜잭션 적용
    editor.view.dispatch(transaction)

    // 선택 영역 초기화
    editor.commands.setTextSelection({ from: 0, to: 0 })
  }
}

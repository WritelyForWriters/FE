import { ChangeEvent, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Editor } from '@tiptap/react'
import { QUERY_KEY } from 'constants/common/queryKeys'
import { useAtomValue, useSetAtom } from 'jotai'
import { activeMenuAtom, originalPhraseAtom } from 'store/editorAtoms'
import { productIdAtom } from 'store/productsAtoms'

import { useSavedMemos } from '@hooks/memos/useMemosMutation'

// MEMO(Sohyun): 텍스트 에디터의 메모 기능과 관련된 모든 로직을 담당하는 커스텀 hook
export function useMemos(editor: Editor | null) {
  const queryClient = useQueryClient()

  const [content, setContent] = useState('')

  const productId = useAtomValue(productIdAtom)
  const setSelectedText = useSetAtom(originalPhraseAtom)
  const setActiveMenu = useSetAtom(activeMenuAtom)

  const savedMemosMutation = useSavedMemos()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  const handleSavedMemos = async () => {
    if (!content) return
    if (!editor) return null

    const { from, to } = editor.state.selection

    // MEMO(Sohyun): textBetween(from, to, separator)은 블록 간 텍스트 추출 시 줄바꿈 대신 지정한 separator를 사용
    // 기존 원본 데이터 추출시 사용한 getText()가 에디터 전체의 plain text를 줄바꿈 포함 형태로 반환하기 때문에 불필요한 줄바꿈(/n), 공백이 포함되므로!
    const selectedText = editor.state.doc.textBetween(from, to, ' ').replace(/\s+/g, ' ').trim()
    setSelectedText(selectedText)

    savedMemosMutation.mutate(
      {
        productId,
        data: {
          title: selectedText,
          content,
          selectedText,
          startIndex: from,
          endIndex: to,
          isCompleted: false,
        },
      },
      {
        onSuccess: () => {
          editor.commands.unsetBackgroundHighlight()
          editor.commands.setUnderlineHighlight({ color: '#FFCC00' })

          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY.MEMO_LIST],
          })
        },
        onError: () => {
          editor.chain().setTextSelection({ from, to }).unsetBackgroundHighlight().run()
        },
        onSettled: () => {
          setActiveMenu('defaultToolbar')
        },
      },
    )
  }

  return {
    handleChange,
    handleSavedMemos,
  }
}

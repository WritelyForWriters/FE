import { useEffect, useRef } from 'react'

import { Editor } from '@tiptap/react'
import { postAutoModify, postFeedback, postUserModify } from 'api/ai-assistant/aiAssistant'
import { useAtom, useAtomValue } from 'jotai'
import { activeMenuAtom, aiResultAtom, originalPhraseAtom } from 'store/editorAtoms'
import { productIdAtom } from 'store/productsAtoms'
import {
  ActionOptionType,
  AiassistantOptionType,
  TextSelectionRangeType,
} from 'types/common/editor'

import { useCollapsed } from '@hooks/common/useCollapsed'

// MEMO(Sohyun): 텍스트 에디터와 관련된 모든 로직을 담당하는 커스텀 hook
export function useTextEditor(editor: Editor | null) {
  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom)
  const [originalText, setOriginalText] = useAtom(originalPhraseAtom)
  const [aiResult, setAiResult] = useAtom(aiResultAtom)
  const productId = useAtomValue(productIdAtom)

  const selectionRef = useRef<TextSelectionRangeType | null>(null)
  const originalSelectionRef = useRef<TextSelectionRangeType | null>(null)
  const promptValueRef = useRef('')
  const feedbackInput = useRef<string | null>(null)

  const { isOpen, onOpen, onClose } = useCollapsed()
  const {
    isOpen: isFeedbackOpen,
    onOpen: onOpenFeedback,
    onClose: onCloseFeedback,
  } = useCollapsed()
  const {
    isOpen: isAutoModifyVisible,
    onOpen: onOpenAutoModifyVisible,
    onClose: onCloseAutoModifyVisible,
  } = useCollapsed()

  // 드래그한 영역 저장 및 하이라이트
  const handleTextSelection = () => {
    if (!editor) return null

    const { from, to } = editor.state.selection

    if (from !== to) {
      selectionRef.current = { from, to }
      originalSelectionRef.current = { from, to }
      editor.commands.setMark('highlight', { color: '#FFFAE5' })
      return { from, to }
    }
    return null
  }

  const handleActiveMenu = (type: AiassistantOptionType) => {
    if (!editor) return

    const selection = handleTextSelection()
    if (!selection) return

    // 선택한 원본 text 저장
    const originPhrase = editor.getText().slice(selection?.from - 1, selection?.to)
    setOriginalText(originPhrase)

    if (type === 'auto-modify' && originPhrase) {
      setActiveMenu('auto-modify')
      handleAiAutoModify(originPhrase)
    }

    if (type === 'user-modify') {
      setActiveMenu('user-modify')
    }

    if (type === 'feedback') {
      setActiveMenu('feedback')
      handleAiFeedback(originPhrase)
    }
  }

  const handlePromptChange = (value: string) => {
    promptValueRef.current = value
  }

  const handleAiAutoModify = async (originPhrase: string) => {
    if (!selectionRef.current || !editor) return

    try {
      const response = await postAutoModify({
        productId,
        content: originPhrase ?? originalText,
      })

      if (response.id) {
        // (방법 2) ai 응답을 받아서 전역 상태 저장 > DefaultEditor에서 삽입
        setAiResult(response.answer)
        onOpenAutoModifyVisible()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAiPrompt = async () => {
    if (!promptValueRef.current || !selectionRef.current) return

    try {
      const response = await postUserModify({
        productId,
        content: originalText,
        prompt: promptValueRef.current,
      })

      if (response.id) {
        // (방법 1) selection을 받아와서 대체 텍스트 삽입
        // editor.commands.insertContentAt(selection, response.answer)

        // (방법 2) ai 응답을 받아서 전역 상태 저장 > DefaultEditor에서 삽입
        setAiResult(response.answer)
        onOpen()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleAiFeedback = async (originPhrase: string) => {
    try {
      const response = await postFeedback({
        productId,
        content: originPhrase,
      })

      if (response.id) {
        // TODO 로딩중일때
        feedbackInput.current = response.answer
        onOpenFeedback()
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 적용할 범위를 정확히 지정한 후 하이라이트 제거
  const clearHighlight = (originalSelection?: TextSelectionRangeType) => {
    const selection = originalSelection ?? selectionRef.current

    if (selection && editor) {
      editor.chain().setTextSelection(selection).unsetMark('highlight').run()
    }
  }

  const handleOptionClickAutoModify = (option: ActionOptionType) => () => {
    switch (option) {
      case 'apply':
        setActiveMenu('defaultToolbar')
        clearHighlight()
        onCloseAutoModifyVisible()
        break

      case 'recreate':
        handleAiAutoModify(originalText)
        break

      case 'cancel':
        if (selectionRef.current && editor) {
          editor.commands.insertContentAt(selectionRef.current, originalText)
        }
        setActiveMenu('defaultToolbar')
        if (originalSelectionRef.current) {
          clearHighlight(originalSelectionRef.current)
          originalSelectionRef.current = null
        }
        onCloseAutoModifyVisible()
        feedbackInput.current = null
        break

      default:
        break
    }
  }

  const handleOptionClickUserModify = (option: ActionOptionType) => () => {
    switch (option) {
      case 'apply':
        setActiveMenu('defaultToolbar')
        clearHighlight()
        onClose()
        break

      case 'recreate':
        handleAiPrompt()
        onClose()
        break

      case 'cancel':
        if (selectionRef.current && editor) {
          editor.commands.insertContentAt(selectionRef.current, originalText)
        }
        setActiveMenu('defaultToolbar')
        if (originalSelectionRef.current) {
          clearHighlight(originalSelectionRef.current)
          originalSelectionRef.current = null
        }
        onClose()
        feedbackInput.current = null
        onCloseFeedback()
        break

      default:
        break
    }
  }

  const handleOptionClickFeedback = (option: ActionOptionType) => () => {
    switch (option) {
      case 'apply':
        setActiveMenu('defaultToolbar')
        clearHighlight()

        // TODO 에디터에 피드백 문구 추출해서 삽입 => 피드백 받은 문구만 api 응답으로 받을 수 있는지 확인하기
        // TODO 구간 피드백 응답이 길어지기 때문에 UI 수정이 필요
        if (feedbackInput.current) {
          setAiResult(feedbackInput.current)
        }
        feedbackInput.current = null
        onCloseFeedback()
        break

      case 'recreate':
        handleAiFeedback(originalText)
        break

      case 'cancel':
        if (selectionRef.current && editor) {
          editor.commands.insertContentAt(selectionRef.current, originalText)
        }
        setActiveMenu('defaultToolbar')
        if (originalSelectionRef.current) {
          clearHighlight(originalSelectionRef.current)
          originalSelectionRef.current = null
        }
        feedbackInput.current = null
        onCloseFeedback()
        break

      default:
        break
    }
  }

  // aiResult 변경 시 에디터에 내용 삽입
  useEffect(() => {
    if (aiResult && selectionRef.current && editor) {
      editor.commands.insertContentAt(selectionRef.current, aiResult)
      selectionRef.current = {
        from: selectionRef.current.from,
        to: selectionRef.current.from + aiResult.length,
      }
      setAiResult('')
    }
  }, [aiResult, editor, setAiResult])

  return {
    activeMenu,
    isOpen,
    onClose,
    isFeedbackOpen,
    selectionRef,
    isAutoModifyVisible,
    feedbackInput,
    handleActiveMenu,
    handlePromptChange,
    handleAiPrompt,
    handleOptionClickAutoModify,
    handleOptionClickUserModify,
    handleOptionClickFeedback,
  }
}

import { useEffect, useRef, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { Editor } from '@tiptap/react'
import { archivedAnswer, postAutoModify, postFeedback } from 'api/ai-assistant/aiAssistant'
import { AxiosError } from 'axios'
import { TOAST_MESSAGE } from 'constants/common/toastMessage'
import { INITIAL_EVALUATE_STATE } from 'constants/workspace/value'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { applyProductSettingsAtom } from 'store/applyProductSettings'
import { activeMenuAtom, aiResultAtom, originalPhraseAtom } from 'store/editorAtoms'
import { isChatbotOpenAtom } from 'store/isChatbotOpenAtom'
import { productIdAtom } from 'store/productsAtoms'
import { selectedRangeAtom } from 'store/selectedRangeAtom'
import { FeedbackFormData } from 'types/chatbot/chatbot'
import {
  ActionOptionType,
  AiassistantOptionType,
  EvaluateStateType,
  TextSelectionRangeType,
} from 'types/common/editor'

import { useToast } from '@components/toast/ToastProvider'

import { usePostUserModify } from '@hooks/ai-assistant/useAiassistantMutation'
import { useSubmitFeedback } from '@hooks/chatbot/useSubmitFeedback'
import { useCollapsed } from '@hooks/common/useCollapsed'

// MEMO(Sohyun): 텍스트 에디터와 관련된 모든 로직을 담당하는 커스텀 hook
export function useTextEditor(editor: Editor | null) {
  const setIsChatbotOpen = useSetAtom(isChatbotOpenAtom)
  const [aiassistantId, setAiassistantId] = useState('') // TODO (리팩토링) 응답(id, result)을 객체로 관리

  const [feedback, setFeedback] = useState<EvaluateStateType>(INITIAL_EVALUATE_STATE)

  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom)
  const [originalText, setOriginalText] = useAtom(originalPhraseAtom)
  const [aiResult, setAiResult] = useAtom(aiResultAtom)
  const productId = useAtomValue(productIdAtom)
  const shouldApplySetting = useAtomValue(applyProductSettingsAtom)

  const setSelectedRangeAtom = useSetAtom(selectedRangeAtom)

  const selectionRef = useRef<TextSelectionRangeType | null>(null)
  const originalSelectionRef = useRef<TextSelectionRangeType | null>(null)
  const promptValueRef = useRef('')
  const feedbackInput = useRef<string | null>(null)

  const showToast = useToast()

  const { isOpen, onOpen, onClose } = useCollapsed()
  const {
    isOpen: feedbackPrompt,
    onOpen: onOpenFeedbackPrompt,
    onClose: onCloseFeedbackPrompt,
  } = useCollapsed()
  const {
    isOpen: isAutoModifyVisible,
    onOpen: onOpenAutoModifyVisible,
    onClose: onCloseAutoModifyVisible,
  } = useCollapsed()

  const { mutate: submitFeedback } = useSubmitFeedback({
    onSuccess: (_, variables) => {
      const isGood = (
        variables as {
          assistantId: string
          formData: FeedbackFormData
        }
      ).formData.isGood
      setFeedback((prev) => ({
        ...prev,
        isGoodSelected: isGood,
        isBadSelected: !isGood,
      }))
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        showToast('warning', error.response?.data.message)
      }
    },
  })

  const archivedAnswerMutation = useMutation({
    mutationFn: archivedAnswer,
    onSuccess: () => {
      setFeedback((prev) => ({
        ...prev,
        isArchived: true,
      }))
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        showToast('warning', error.response?.data.message)
      }
    },
  })

  const { mutate: postUserModify, isPending: userModifyPending } = usePostUserModify()

  // 어시스턴트 응답 피드백
  const handleSubmitFeedback = ({ isGood, feedback: value, feedbackType }: FeedbackFormData) => {
    if (!aiassistantId) return

    if (feedback.isGoodSelected || feedback.isBadSelected) {
      showToast('warning', TOAST_MESSAGE.FAIL_SUBMIT_FEEDBACK)
      return
    }

    if (isGood) {
      submitFeedback({
        assistantId: aiassistantId,
        formData: {
          isGood,
        },
      })
    } else {
      submitFeedback({
        assistantId: aiassistantId,
        formData: {
          isGood,
          feedbackType,
          feedback: value,
        },
      })
    }
  }

  // 드래그한 영역 저장 및 하이라이트
  const handleTextSelection = () => {
    if (!editor) return null

    const { from, to } = editor.state.selection

    if (from !== to) {
      selectionRef.current = { from, to }
      originalSelectionRef.current = { from, to }
      editor.commands.setBackgroundHighlight({ color: '#FFFAE5' })
      return { from, to }
    }
    return null
  }

  const handleActiveMenu = (type: AiassistantOptionType | 'memo') => {
    if (!editor) return

    const selection = handleTextSelection()
    if (!selection) return

    // 선택한 원본 text 저장
    // const originPhrase = editor.getText().slice(selection?.from, selection?.to) // 기존코드 참고용
    const originPhrase = editor.state.doc.textBetween(selection?.from, selection?.to, ' ')
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

    if (type === 'free-chat') {
      setSelectedRangeAtom(originPhrase)
      setIsChatbotOpen(true)
    }

    if (type === 'memo') {
      setActiveMenu('memo')
    }
  }

  const handlePromptChange = (value: string) => {
    promptValueRef.current = value
  }

  // 에러 핸들링 로직
  // MEMO(Sohyun): 자동수정과 구간피드백의 경우 originPhrase가 저장되자마자 실행되므로 api호출 실패시,
  // 이전 originPhrase로 복원되기 때문에 파라미터로 api호출하는 originPhrase를 함께 넘겨줌
  const handleOnError = (onCloseMenu: () => void, originPhrase: string) => {
    if (selectionRef.current && editor) {
      editor.commands.insertContentAt(selectionRef.current, originPhrase)
    }
    setActiveMenu('defaultToolbar')
    if (originalSelectionRef.current) {
      clearHighlight(originalSelectionRef.current)
      originalSelectionRef.current = null
    }
    onCloseMenu()
    feedbackInput.current = null
    showToast('warning', '다시 시도해 주세요')
  }

  // TODO(Sohyun) 어시스턴트 에러처리 및 로딩처리 > react-query로 변경
  // 1. 자동 수정
  const handleAiAutoModify = async (originPhrase: string) => {
    if (!selectionRef.current || !editor) return

    try {
      const response = await postAutoModify({
        productId,
        content: originPhrase ?? originalText,
        shouldApplySetting,
      })

      if (response.id) {
        setAiassistantId(response.id)
        setFeedback(INITIAL_EVALUATE_STATE)
        // (방법 2) ai 응답을 받아서 전역 상태 저장 > DefaultEditor에서 삽입
        setAiResult(response.answer)
        onOpenAutoModifyVisible()
      }
    } catch (error) {
      console.log(error)
      handleOnError(onCloseAutoModifyVisible, originPhrase ?? originalText)
    }
  }

  // 2. 수동 수정
  const handleAiPrompt = async () => {
    if (!promptValueRef.current || !selectionRef.current) return

    postUserModify(
      {
        productId,
        content: originalText,
        prompt: promptValueRef.current,
        shouldApplySetting,
      },
      {
        onSuccess: (data) => {
          const { id, answer } = data
          if (id) {
            setAiassistantId(id)
            setFeedback(INITIAL_EVALUATE_STATE)
            // (방법 1) selection을 받아와서 대체 텍스트 삽입
            // editor.commands.insertContentAt(selection, response.answer)
            // (방법 2) ai 응답을 받아서 전역 상태 저장 > DefaultEditor에서 삽입
            setAiResult(answer)
            onOpen()
          }
        },
        onError: (error) => {
          console.log(error)
          handleOnError(onClose, originalText)
        },
      },
    )
  }

  // 3. 구간 피드백
  const handleAiFeedback = async (originPhrase: string) => {
    try {
      const response = await postFeedback({
        productId,
        content: originPhrase,
        shouldApplySetting,
      })

      if (response.id) {
        setAiassistantId(response.id)
        setFeedback(INITIAL_EVALUATE_STATE)
        // TODO 로딩중일때
        feedbackInput.current = response.answer
        onOpenFeedbackPrompt()
      }
    } catch (error) {
      console.log(error)
      handleOnError(onCloseFeedbackPrompt, originPhrase)
    }
  }

  // 적용할 범위를 정확히 지정한 후 하이라이트 제거
  const clearHighlight = (originalSelection?: TextSelectionRangeType) => {
    const selection = originalSelection ?? selectionRef.current

    if (selection && editor) {
      editor.chain().setTextSelection(selection).unsetBackgroundHighlight().run()
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

      case 'archive':
        if (feedback.isArchived) return
        archivedAnswerMutation.mutate(aiassistantId)
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
        break

      case 'archive':
        if (feedback.isArchived) return
        archivedAnswerMutation.mutate(aiassistantId)
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
        onCloseFeedbackPrompt()

        // TODO 에디터에 피드백 문구 추출해서 삽입 => 피드백 받은 문구만 api 응답으로 받을 수 있는지 확인하기
        // TODO 구간 피드백 응답이 길어지기 때문에 UI 수정이 필요
        if (feedbackInput.current) {
          setAiResult(feedbackInput.current)
        }
        feedbackInput.current = null
        break

      case 'recreate':
        handleAiFeedback(originalText)
        onCloseFeedbackPrompt()
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
        onCloseFeedbackPrompt()
        feedbackInput.current = null
        break

      case 'archive':
        if (feedback.isArchived) return
        archivedAnswerMutation.mutate(aiassistantId)
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

  useEffect(() => {
    setFeedback({
      assistantId: null,
      isGoodSelected: false,
      isBadSelected: false,
      isArchived: false,
    })
  }, [editor?.state.selection.empty])

  return {
    isOpen,
    feedbackPrompt,
    feedback,
    activeMenu,
    feedbackInput,
    selectionRef,
    isAutoModifyVisible,
    handleActiveMenu,
    handlePromptChange,
    handleSubmitFeedback,
    handleAiPrompt,
    handleOptionClickAutoModify,
    handleOptionClickUserModify,
    handleOptionClickFeedback,
    // MEMO(Sohyun): 추후 로딩처리를 위해 return값에 추가해 둠
    userModifyPending,
  }
}

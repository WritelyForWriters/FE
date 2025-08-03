'use client'

import Image from 'next/image'

import { Ref, RefObject, useEffect, useImperativeHandle, useRef, useState } from 'react'

import Bold from '@tiptap/extension-bold'
import CharacterCount from '@tiptap/extension-character-count'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import { CURRENT_GOAL } from 'constants/workspace/number'
import { EDITOR_CONTENTS } from 'constants/workspace/placeholder'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { charCountSessionAtomFamily, currentCharCountAtom } from 'store/charCountAtom'
import { isEditableAtom } from 'store/editorAtoms'
import { selectedRangeAtom } from 'store/selectedRangeAtom'
import { HandleEditor } from 'types/common/editor'
import { ModalHandler } from 'types/common/modalRef'

import DialogWithVerticalBtn from '@components/modal/DialogWithVerticalBtn'
import GoalReachedModal from '@components/modal/GoalReachedModal'

import { useMemos } from '@hooks/editor/useMemos'
import useResetMode from '@hooks/editor/useResetMode'
import { useTextEditor } from '@hooks/editor/useTextEditor'

import BackgroundHighlight from '@extensions/BackgroundHighlight'
import BlockquoteExtension from '@extensions/Blockquote'
import HeadingExtension from '@extensions/Heading'
import Indent from '@extensions/Indent'
import UnderlineHighlight from '@extensions/UnderlineHighlight'

import Toolbar from './Toolbar'
import AutoModifyMenu from './ai-assistant-interface/AutoModifyMenu'
import FeedbackMenu from './ai-assistant-interface/FeedbackMenu'
import ManualModification from './ai-assistant-interface/ManualModification'
import CharCounter from './char-counter/CharCounter'
import PromptInput from './common/PromptInput'

import styles from './DefaultEditor.module.scss'

interface DefaultEditorProps {
  productId: string
  editorRef: Ref<HandleEditor>
  isSavedRef: RefObject<boolean>
  contents?: string
}

export default function DefaultEditor({
  productId,
  editorRef,
  isSavedRef,
  contents,
}: DefaultEditorProps) {
  const editable = useAtomValue(isEditableAtom)
  const setSelectedRangeAtom = useSetAtom(selectedRangeAtom)

  const setCurrentCharCount = useSetAtom(currentCharCountAtom)
  const [session, setSession] = useAtom(charCountSessionAtomFamily(productId))

  const modalRef = useRef<ModalHandler | null>(null)
  const goalReachedModalRef = useRef<ModalHandler | null>(null)

  const editor = useEditor({
    editable,
    extensions: [
      Document,
      BlockquoteExtension,
      Text,
      Paragraph,
      Heading.configure({
        levels: [1],
      }),
      HeadingExtension,
      Indent,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
      BackgroundHighlight,
      UnderlineHighlight,
      History.configure({
        depth: 100, // NOTE(hajae): undo, redo stack 100
        newGroupDelay: 400, // NOTE(hajae): undo, redo의 Grouping 딜레이 시간
      }),
      CharacterCount,
    ],
    immediatelyRender: false,
    content: contents ? JSON.parse(contents) : EDITOR_CONTENTS,
    onUpdate: ({ editor }) => {
      // 에디터에 변경사항이 생기면 저장 상태 false로 변경
      isSavedRef.current = false

      // 현재 문자수 계산
      const count = editor.storage.characterCount.characters()
      setCurrentCharCount(count)
    },
    onSelectionUpdate: ({ editor }) => {
      if (editor.state.selection.empty) {
        setSelectedRangeAtom('')
      }

      const { from, to } = editor.state.selection

      if (from !== to) {
        const selectedText = editor.getText().slice(from - 1, to - 1)
        setSelectedRangeAtom(selectedText)
      }
    },
  })

  // 외부에서 에디터 인스턴스에 접근하기 위해 사용
  useImperativeHandle(editorRef, () => ({
    getEditor: () => editor,
  }))

  const {
    isOpen,
    feedbackPrompt,
    feedback,
    activeMenu,
    feedbackInput,
    selectionRef,
    isAutoModifyVisible,
    initActiveMenu,
    initSelection,
    handleActiveMenu,
    handlePromptChange,
    handleSubmitFeedback,
    handleAiPrompt,
    handleOptionClickAutoModify,
    handleOptionClickUserModify,
    handleOptionClickFeedback,
    userModifyPending,
    feedbackPending,
  } = useTextEditor(editor)

  const { handleChange, handleSavedMemos } = useMemos(editor)

  // 메모 모드 하이라이트 및 툴바 모드 초기화 훅 사용
  useResetMode({ editor, mode: 'memo' })

  useEffect(() => {
    if (!editor) {
      return undefined
    }
    editor.setEditable(editable)
  }, [editor, editable])

  // 에디터 초기 content 데이터 보여주기
  // useEffect(() => {
  //   if (editor && contents && contents !== null) {
  //     editor.commands.setContent(JSON.parse(contents))
  //     // setInitialCharCount(editor.storage.characterCount.characters())
  //   }
  // }, [editor, contents])

  // 에디터 초기 content 데이터 보여주기
  useEffect(() => {
    if (editor && contents && contents !== null && productId) {
      editor.commands.setContent(JSON.parse(contents))
      const initialCount = editor.storage.characterCount.characters()

      // session이 있는 경우
      if (session) {
        // contents가 있으면 contents 글자수로 초기화
        if (session.initialCharCount === 0) {
          setSession({
            ...session,
            initialCharCount: initialCount,
          })
        }
        setCurrentCharCount(initialCount)
      } else {
        // session이 없으면 새로 생성하여 initialCount 저장
        if (setSession) {
          setSession({
            productId,
            initialCharCount: initialCount,
            currentGoal: CURRENT_GOAL,
            reachedGoals: [],
            sessionStartedAt: new Date().toISOString(),
          })
        }
        setCurrentCharCount(initialCount)
      }
    }
  }, [editor, contents, productId, session, setSession, setCurrentCharCount])

  // 목표 달성 모달 표시 여부 상태
  const [hasShownGoalModal, setHasShownGoalModal] = useState(false)

  // 목표 달성 시 모달 표시
  const handleGoalReached = () => {
    if (!productId || !session || hasShownGoalModal) return

    const sessionKey = `product-${productId}-char-count`
    const sessionData = JSON.parse(sessionStorage.getItem(sessionKey) || '{}')
    const currentGoal = sessionData.currentGoal || CURRENT_GOAL

    // 현재 목표가 이미 달성된 목표 목록에 있는지 확인
    const alreadyReached = session.reachedGoals.includes(currentGoal) || false

    if (!alreadyReached && !modalRef.current?.isOpen()) {
      modalRef.current?.open()
      setHasShownGoalModal(true)
    }
  }

  // 작품 변경 시 모달 표시 여부 초기화
  useEffect(() => {
    if (productId && session) {
      const alreadyReached = session.reachedGoals.includes(session.currentGoal || CURRENT_GOAL)
      setHasShownGoalModal(alreadyReached)
    }
  }, [productId, session])

  // NOTE(hajae): 최초 렌더링 시 Active Menu를 초기화
  useEffect(() => {
    initActiveMenu()
    initSelection()
  }, [])

  // 페이지 이탈 Amplitude
  useEffect(() => {
    const pageEnterTime = Date.now()
    let initialTextLength = 0

    if (editor) {
      initialTextLength = editor.storage.characterCount.characters()
    }

    return () => {
      if (editor) {
        const currentDate = Date.now()
        const currentTextLength = editor.storage.characterCount.characters()
        const diffLength = currentTextLength - initialTextLength

        if (diffLength < 200) {
          trackEvent('writing_abandon', {
            word_count: diffLength,
            session_duration: Math.floor((currentDate - pageEnterTime) / 1000),
          })
        } else if (diffLength >= 700) {
          trackEvent('writing_complete', {
            word_count: diffLength,
            time_spent: Math.floor((currentDate - pageEnterTime) / 1000),
            button_name: '저장',
          })
        }
      }
    }
  }, [editor])

  // 초기 문자수를 제외한 새로 입력한 글자 수 계산
  // const typedCharCount = Math.max(0, currentCharCount - initialCharCount)

  // useEffect(() => {
  //   if (typedCharCount >= 10 && !modalRef.current?.isOpen()) {
  //     modalRef.current?.open()
  //   }
  // }, [typedCharCount])

  if (!editor) {
    return null
  }

  return (
    <section className={styles.section}>
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 100,
          maxWidth: 'none',
          interactive: true,
          zIndex: 100,
        }}
        shouldShow={({ editor, state }) => editor.isEditable && !state.selection.empty}
      >
        {activeMenu === 'defaultToolbar' && (
          <Toolbar editor={editor} handleActiveMenu={handleActiveMenu} />
        )}

        {/* 메모 */}
        {activeMenu === 'memo' && (
          <PromptInput
            onPromptInputChange={handleChange}
            onSubmit={handleSavedMemos}
            placeholder="메모를 입력해주세요."
            buttonText="저장하기"
          />
        )}
      </BubbleMenu>

      {/* 자동 수정 */}
      {activeMenu === 'auto-modify' && (
        <AutoModifyMenu
          editor={editor}
          selectionRef={selectionRef}
          isVisible={isAutoModifyVisible}
          onOptionClick={handleOptionClickAutoModify}
          feedback={feedback}
          handleSubmitFeedback={handleSubmitFeedback}
        />
      )}

      {/* 수동 수정 */}
      {activeMenu === 'user-modify' && (
        <ManualModification
          isPrimaryActionMenuOpen={isOpen}
          editor={editor}
          selectionRef={selectionRef}
          onPromptChange={handlePromptChange}
          onAiPrompt={handleAiPrompt}
          onOptionClick={handleOptionClickUserModify}
          feedback={feedback}
          handleSubmitFeedback={handleSubmitFeedback}
          isPending={userModifyPending}
        />
      )}

      {/* 구간 피드백 */}
      {activeMenu === 'feedback' && (
        <FeedbackMenu
          isFeedbackPromptMenuOpen={feedbackPrompt}
          editor={editor}
          selectionRef={selectionRef}
          feedbackText={feedbackInput.current}
          onOptionClick={handleOptionClickFeedback}
          feedback={feedback}
          handleSubmitFeedback={handleSubmitFeedback}
          isPending={feedbackPending}
        />
      )}

      {/* TODO: 퍼블리싱 수정 */}
      <CharCounter productId={productId} onGoalReached={handleGoalReached} />
      <EditorContent editor={editor} className={styles.tiptap} />

      <DialogWithVerticalBtn
        ref={modalRef}
        title="오늘도 700자 글쓰기 성공! 멋져요!"
        cancelText="지금은 괜찮아요"
        confirmText="글쓰기 목표 조정하기"
        onCancel={() => {
          modalRef.current?.close()
          setHasShownGoalModal(true)
        }}
        onConfirm={() => {
          modalRef.current?.close()
          goalReachedModalRef.current?.open()
          // setHasShownGoalModal(true)
        }}
        content={
          <Image src="/icons/firecracker-icon.svg" alt="firecracker" width={120} height={120} />
        }
      />

      <GoalReachedModal
        ref={goalReachedModalRef}
        productId={productId}
        onCancel={() => goalReachedModalRef.current?.close()}
        onConfirm={() => {}}
      />
    </section>
  )
}

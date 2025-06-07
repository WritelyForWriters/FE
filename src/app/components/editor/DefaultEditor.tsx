'use client'

import { Ref, RefObject, useEffect, useImperativeHandle } from 'react'

import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import { useAtomValue } from 'jotai'
import { isEditableAtom } from 'store/editorAtoms'
import { HandleEditor } from 'types/common/editor'

import FillButton from '@components/buttons/FillButton'

import { useMemos } from '@hooks/editor/useMemos'
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

import styles from './DefaultEditor.module.scss'

interface DefaultEditorProps {
  editorRef: Ref<HandleEditor>
  isSavedRef: RefObject<boolean>
  contents?: string
}

export default function DefaultEditor({ editorRef, isSavedRef, contents }: DefaultEditorProps) {
  const editable = useAtomValue(isEditableAtom)

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
    ],
    immediatelyRender: false,
    content: contents ? JSON.parse(contents) : '내용을 입력해주세요.',
    onUpdate: () => {
      // 에디터에 변경사항이 생기면 저장 상태 false로 변경
      isSavedRef.current = false
    },
  })

  // 외부에서 에디터 인스턴스에 접근하기 위해 사용
  useImperativeHandle(editorRef, () => ({
    getEditor: () => editor,
  }))

  const {
    isOpen,
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
  } = useTextEditor(editor)

  const { handleChange, handleSavedMemos } = useMemos(editor)

  useEffect(() => {
    if (!editor) {
      return undefined
    }
    editor.setEditable(editable)
  }, [editor, editable])

  // 에디터 초기 content 데이터 보여주기
  useEffect(() => {
    if (editor && contents && contents !== null) {
      editor.commands.setContent(JSON.parse(contents))
    }
  }, [editor, contents])

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
        }}
        shouldShow={({ editor, state }) => editor.isEditable && !state.selection.empty}
      >
        {activeMenu === 'defaultToolbar' && (
          <Toolbar editor={editor} handleActiveMenu={handleActiveMenu} />
        )}

        {/* 메모 */}
        {activeMenu === 'memo' && (
          <div className={styles['prompt-menu']}>
            <input
              autoFocus
              className={styles['prompt-menu__input']}
              onChange={handleChange}
              placeholder="메모를 입력해주세요."
            />
            <FillButton
              size="medium"
              variant="primary"
              style={{
                padding: '0.8rem 1.2rem',
                height: '100%',
              }}
              onClick={handleSavedMemos}
            >
              저장하기
            </FillButton>
          </div>
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
        />
      )}

      {/* 구간 피드백 */}
      {activeMenu === 'feedback' && (
        <FeedbackMenu
          editor={editor}
          selectionRef={selectionRef}
          feedbackText={feedbackInput.current}
          onOptionClick={handleOptionClickFeedback}
          feedback={feedback}
          handleSubmitFeedback={handleSubmitFeedback}
        />
      )}

      <EditorContent editor={editor} className={styles.tiptap} />
    </section>
  )
}

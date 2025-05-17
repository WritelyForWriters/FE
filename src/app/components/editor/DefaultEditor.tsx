'use client'

import { ChangeEvent, Ref, RefObject, useEffect, useImperativeHandle, useState } from 'react'

import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import { createMemos } from 'api/memos/memos'
import { useAtomValue, useSetAtom } from 'jotai'
import { activeMenuAtom, isEditableAtom, originalPhraseAtom } from 'store/editorAtoms'
import { productIdAtom } from 'store/productsAtoms'
import { HandleEditor } from 'types/common/editor'

import FillButton from '@components/buttons/FillButton'

import { useTextEditor } from '@hooks/editor/useTextEditor'

import BlockquoteExtension from '@extensions/Blockquote'
import HeadingExtension from '@extensions/Heading'
import Indent from '@extensions/Indent'

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
  const productId = useAtomValue(productIdAtom)
  const setSelectedText = useSetAtom(originalPhraseAtom)
  const setActiveMenu = useSetAtom(activeMenuAtom)

  const [content, setContent] = useState('')

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
      Highlight.configure({
        multicolor: true,
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
    activeMenu,
    isOpen,
    onClose,
    feedbackInput,
    selectionRef,
    isAutoModifyVisible,
    handleActiveMenu,
    handlePromptChange,
    handleAiPrompt,
    handleOptionClickAutoModify,
    handleOptionClickUserModify,
    handleOptionClickFeedback,
  } = useTextEditor(editor)

  // 메모 인풋 변경
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  // 메모
  const handleSavedMemos = async () => {
    if (!content) return
    if (!editor) return null

    const { from, to } = editor.state.selection
    console.log(from, to)

    // MEMO(Sohyun): textBetween(from, to, separator)은 블록 간 텍스트 추출 시 줄바꿈 대신 지정한 separator를 사용
    // 기존 원본 데이터 추출시 사용한 getText()가 에디터 전체의 plain text를 줄바꿈 포함 형태로 반환하기 때문에 불필요한 줄바꿈(/n), 공백이 포함되므로!
    const selectedText = editor.state.doc.textBetween(from, to, ' ').replace(/\s+/g, ' ').trim()
    setSelectedText(selectedText)
    console.log(selectedText)

    try {
      await createMemos(productId, {
        content,
        selectedText,
        startIndex: from,
        endIndex: to,
        isCompleted: false,
      })
      setActiveMenu('defaultToolbar')
    } catch (error) {
      console.log(error)
    }
  }

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
        // --shouldShow: 버블 메뉴 표시를 제어하는 콜백
        /* MEMO(Sohyun): DefaultEditor내부에서 editable 상태에따른 화면을 구현하고 싶었으나, 버블메뉴 shouldShow 상태 제어가 안되는 문제가 있음
          editable상태가 shouldShow에 즉각반영이 안됨, (참고) https://tiptap.dev/docs/guides/output-json-html#render */
        shouldShow={({ state }) => editable && !state.selection.empty}
      >
        {activeMenu === 'defaultToolbar' && (
          <Toolbar editor={editor} handleActiveMenu={handleActiveMenu} />
        )}

        {/* 구간 피드백 */}
        {activeMenu === 'feedback' && (
          <FeedbackMenu
            feedbackText={feedbackInput.current}
            onOptionClick={handleOptionClickFeedback}
          />
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
        />
      )}

      {/* 수동 수정 */}
      {activeMenu === 'user-modify' && (
        <ManualModification
          isOpen={isOpen}
          onClose={onClose}
          onPromptChange={handlePromptChange}
          onAiPrompt={handleAiPrompt}
          onOptionClick={handleOptionClickUserModify}
        />
      )}

      <EditorContent editor={editor} className={styles.tiptap} />
    </section>
  )
}

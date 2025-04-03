'use client'

import { Ref, useEffect, useImperativeHandle } from 'react'

import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { activeMenuAtom, isEditableAtom, selectionAtom } from 'store/editorAtoms'
import ImageResize from 'tiptap-extension-resize-image'
import { HandleEditor } from 'types/common/editor'

import BlockquoteExtension from '@extensions/Blockquote'
import Indent from '@extensions/Indent'

import PlannerIdeaNoteToolbar from './PlannerIdeaNoteToolbar'

import styles from '../DefaultEditor.module.scss'
import plannerStyles from './PlannerIdeaNoteEditor.module.scss'

interface PlannerIdeaNoteEditorProps {
  ref: Ref<HandleEditor>
  contents?: string
}

// NOTE(hajae): 기존 Default Editor를 참고하여 작성, 소현님 Branch 참고하여 일부분 수정 했습니다.
export default function PlannerIdeaNoteEditor({ ref, contents }: PlannerIdeaNoteEditorProps) {
  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom)
  const setSelection = useSetAtom(selectionAtom)
  const editable = useAtomValue(isEditableAtom)

  const editor = useEditor({
    extensions: [
      Document,
      BlockquoteExtension,
      Text,
      Paragraph,
      Heading.configure({
        levels: [1],
      }),
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
      // NOTE(hajae): Placeholder 추가
      Placeholder.configure({
        placeholder: '아이디어를 자유롭게 입력해주세요',
        emptyEditorClass: plannerStyles['is-editor-empty'],
      }),
      StarterKit,
      ImageResize,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    immediatelyRender: false,
    content: contents ? JSON.parse(contents) : '',
  })

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

  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
  }))

  if (!editor) {
    return null
  }

  return (
    <section className={`${styles.section} ${plannerStyles['section']}`}>
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 100,
          maxWidth: 'none',
          onHidden: () => {
            setActiveMenu('defaultToolbar')
            setSelection(null)
          },
        }}
        shouldShow={({ state }) => editable && !state.selection.empty}
      >
        {activeMenu === 'defaultToolbar' && <PlannerIdeaNoteToolbar editor={editor} />}
      </BubbleMenu>
      <EditorContent editor={editor} className={styles.tiptap} />
    </section>
  )
}

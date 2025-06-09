'use client'

import { Ref, useEffect, useImperativeHandle } from 'react'

import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import History from '@tiptap/extension-history'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { activeMenuAtom, isEditableAtom, selectionAtom } from 'store/editorAtoms'
import ImageResize from 'tiptap-extension-resize-image'
import { HandleEditor } from 'types/common/editor'
import { IdeaNotePresignedUrlRequest } from 'types/planner/ideaNotePresignedUrl'

import { useCreateFilesPresignedUrl } from '@hooks/products/useIdeaNoteImageUpload'

import BlockquoteExtension from '@extensions/Blockquote'
import Indent from '@extensions/Indent'

import PlannerIdeaNoteToolbar from './PlannerIdeaNoteToolbar'

import styles from '../DefaultEditor.module.scss'
import plannerStyles from './PlannerIdeaNoteEditor.module.scss'

interface PlannerIdeaNoteEditorProps {
  ref: Ref<HandleEditor>
  onUpdate: () => void
  contents?: string
}

// NOTE(hajae): 기존 Default Editor를 참고하여 작성, 소현님 Branch 참고하여 일부분 수정 했습니다.
export default function PlannerIdeaNoteEditor({
  ref,
  onUpdate,
  contents,
}: PlannerIdeaNoteEditorProps) {
  const createPresignedUrlMutation = useCreateFilesPresignedUrl({
    // NOTE(hajae): 이미지 업로드 순서는 useIdeaNoteImageUpload.ts 참고
    onSuccess: (fileGetUrl) => {
      if (editor) {
        editor
          .chain()
          .focus()
          .setImage({ src: fileGetUrl as string })
          .run()
      }
    },
    onError: (error) => {
      console.error('이미지 업로드 실패', error)
    },
  })

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
      ImageResize.configure({
        inline: true,
        allowBase64: true,
      }),
      History.configure({
        depth: 100, // NOTE(hajae): undo, redo stack 100
        newGroupDelay: 400, // NOTE(hajae): undo, redo의 Grouping 딜레이 시간
      }),
    ],
    immediatelyRender: false,
    content: contents ? JSON.parse(contents) : '',
    onUpdate,
  })

  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
  }))

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

  useEffect(() => {
    if (!editor) return

    const handlePaste = async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items) return

      // NOTE(hajae): 붙여넣기 시 base64 이미지가 포함되어 있는지 확인
      const htmlData = event.clipboardData?.getData('text/html')
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlData ?? ''
      const hasBase64Image = !!tempDiv.querySelector('img[src^="data:image/"]')

      // NOTE(hajae): base64 이미지가 포함되어 있으면 기본 붙여넣기 동작을 막음
      if (hasBase64Image) {
        event.preventDefault()
      }

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          event.preventDefault()

          const file = item.getAsFile()
          if (!file) return

          const request = IdeaNotePresignedUrlRequest.from(file.name, file.size)

          createPresignedUrlMutation.mutate({
            request: request,
            file,
          })

          break
        }
      }
    }

    editor.view.dom.addEventListener('paste', handlePaste, true)

    return () => {
      editor.view.dom.removeEventListener('paste', handlePaste, true)
    }
  }, [createPresignedUrlMutation, editor])

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

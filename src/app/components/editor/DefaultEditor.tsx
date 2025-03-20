'use client'

import { Ref, useImperativeHandle } from 'react'

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
import { useAtom, useSetAtom } from 'jotai'
import { activeMenuAtom, selectionAtom } from 'store/editorAtoms'
import { HandleEditor } from 'types/common/editor'

import BlockquoteExtension from '@extensions/Blockquote'
import Indent from '@extensions/Indent'

import PromptMenu from './PromptMenu'
import Toolbar from './Toolbar'

import styles from './DefaultEditor.module.scss'

// TODO 단축키 '/'로 버블메뉴 활성화

interface DefaultEditorProps {
  ref: Ref<HandleEditor>
}

export default function DefaultEditor({ ref }: DefaultEditorProps) {
  const [activeMenu, setActiveMenu] = useAtom(activeMenuAtom)
  const setSelection = useSetAtom(selectionAtom)

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
    ],
    immediatelyRender: false,
    content: `
      Nothing is impossible, the word itself says “I’m possible!”
      <p></p>
      <p>드래그해서 수정하기</p>
      <p>Audrey Hepburn</p>
    `,
  })

  // 외부에서 에디터 인스턴스에 접근하기 위해 사용
  useImperativeHandle(ref, () => ({
    getEditor: () => editor,
  }))

  const handleActiveMenu = () => {
    setActiveMenu('aiToolbar')
  }

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
          onHidden: () => {
            setActiveMenu('defaultToolbar')
            setSelection(null)

            // TODO remove text highlight 적용이 안되는 문제
            // editor.chain().focus().unsetMark('highlight').run()
          },
        }}
        // --shouldShow: 버블 메뉴 표시를 제어하는 콜백
        shouldShow={({ state }) => !state.selection.empty}
      >
        {activeMenu === 'defaultToolbar' ? (
          <Toolbar editor={editor} handleActiveMenu={handleActiveMenu} />
        ) : (
          <PromptMenu editor={editor} />
        )}
      </BubbleMenu>
      <EditorContent editor={editor} className={styles.tiptap} />
    </section>
  )
}

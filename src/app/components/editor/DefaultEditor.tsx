'use client'

import { useState } from 'react'

import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'

import BlockquoteExtension from '@extensions/Blockquote'
import Indent from '@extensions/Indent'

import PropmptInput from './PromptInput'
import Toolbar from './Toolbar'

import styles from './DefaultEditor.module.scss'

// TODO 단축키 '/'로 버블메뉴 활성화

export default function DefaultEditor() {
  // TODO 전역상태관리
  const [activeMenu, setActiveMenu] = useState<'defaultToolbar' | 'aiToolbar'>('defaultToolbar')

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
    ],
    immediatelyRender: false,
    content: `
      Nothing is impossible, the word itself says “I’m possible!”
      <p></p>
      <p>Audrey Hepburn</p>
    `,
  })

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
          onHidden: () => setActiveMenu('defaultToolbar'),
        }}
        // --shouldShow: 버블 메뉴 표시를 제어하는 콜백
        shouldShow={({ state }) => {
          const { selection } = state
          // --드래그한 text가 있다면 버블메뉴 활성화
          if (!selection.empty) {
            return true
          }
          return false
        }}
      >
        {activeMenu === 'defaultToolbar' ? (
          <Toolbar editor={editor} handleActiveMenu={handleActiveMenu} />
        ) : (
          <PropmptInput />
        )}
      </BubbleMenu>
      <EditorContent editor={editor} className={styles.tiptap} />
    </section>
  )
}

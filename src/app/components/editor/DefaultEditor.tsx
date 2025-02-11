'use client'

import Blockquote from '@tiptap/extension-blockquote'
import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'

import Indent from '@extensions/Indent'

import Toolbar from './Toolbar'

import styles from './DefaultEditor.module.scss'

/**
 * TODO
 * keyboard shortcut
 * - 단축키 '/'로 버블메뉴 활성화
 * - 제목, 인용 키보드 단축키
 * 공통 스타일 적용
 */

export default function DefaultEditor() {
  const editor = useEditor({
    extensions: [
      Document,
      Blockquote,
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
      <p>Audrey Hepburn</p>
    `,
  })

  if (!editor) {
    return null
  }

  return (
    <section className={styles.section}>
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100, maxWidth: 'none' }}>
        <Toolbar editor={editor} />
      </BubbleMenu>
      <EditorContent editor={editor} className={styles.tiptap} />
    </section>
  )
}

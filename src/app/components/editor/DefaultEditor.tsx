'use client'

import Blockquote from '@tiptap/extension-blockquote'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'

import Indent from '@extensions/Indent'

import Toolbar from './Toolbar'

import styles from './DefaultEditor.module.scss'

/**
 * TODO
 * 버블메뉴
 * 툴바
 * [ ] 텍스트 형식 본문, 제목, 인용
 * [ ] 정렬
 * [ ] 글자 스타일
 * [ ] 메모 메뉴
 * [ ] AI 어시스턴트 메뉴
 * keyboard shortcut
 * 드롭다운 공통
 * default styles
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
    <>
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <Toolbar editor={editor} />
      </BubbleMenu>
      <EditorContent editor={editor} className={styles.tiptap} />
    </>
  )
}

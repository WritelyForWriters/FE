'use client'

import React from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import styles from './styles.module.scss'

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
    extensions: [StarterKit],
    immediatelyRender: false,
    content: `
      Nothing is impossible, the word itself says “I’m possible!”
      <p>Audrey Hepburn</p>
    `,
  })

  const toggleText = () => {
    editor?.commands.unsetBlockquote()
    editor?.commands.setParagraph()
  }

  const toggleBlockquote = () => {
    editor?.chain().focus().toggleBlockquote().run()
  }

  const toggleHeading = () => {
    editor?.chain().focus().toggleHeading({ level: 1 }).run()
  }

  if (!editor) {
    return null
  }

  return (
    <>
      <div>
        <button onClick={toggleText}>본문</button>
        <button onClick={toggleHeading}>제목</button>
        <button onClick={toggleBlockquote}>인용</button>
      </div>
      <EditorContent editor={editor} className={styles.tiptap} />
    </>
  )
}

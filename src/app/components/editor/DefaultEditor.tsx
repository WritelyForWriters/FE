'use client'

import React, { useState } from 'react'

import Blockquote from '@tiptap/extension-blockquote'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'

import Indent from '@extensions/Indent'

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
  const [isOpen, setIsOpen] = useState(false)
  const [isIndentOption, setIsIndentOption] = useState(false)
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

  const getTextFormatOption = () => {
    if (editor?.isActive('blockquote')) {
      return '인용'
    } else if (editor?.isActive('heading')) {
      return '제목'
    } else {
      return '본문'
    }
  }

  const toggleText = () => {
    editor?.commands.unsetBlockquote()
    editor?.commands.setParagraph()
  }

  const toggleBlockquote = () => {
    editor?.chain().focus().toggleBlockquote().run()
  }

  const toggleHeading = () => {
    editor?.commands.unsetBlockquote()
    editor?.chain().focus().toggleHeading({ level: 1 }).run()
  }

  if (!editor) {
    return null
  }

  return (
    <>
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 100,
          onHidden: () => {
            setIsIndentOption(false)
            setIsOpen(false)
          },
        }}
      >
        <div className={styles['bubble-menu']}>
          {/* 텍스트 형식 툴바 */}
          <button onClick={() => setIsOpen(true)}>{getTextFormatOption()}</button>

          {isOpen && (
            <div className={styles['dropdown-menu']}>
              <button
                onClick={toggleText}
                className={
                  !editor.isActive('blockquote') && !editor.isActive('heading')
                    ? `${styles['is-active']}`
                    : ''
                }
              >
                본문
              </button>
              <button
                onClick={toggleHeading}
                className={editor.isActive('heading') ? `${styles['is-active']}` : ''}
              >
                제목
              </button>
              <button
                onClick={toggleBlockquote}
                className={editor.isActive('blockquote') ? `${styles['is-active']}` : ''}
              >
                인용
              </button>
            </div>
          )}

          {/* 정렬 툴바 */}
          <button onClick={() => setIsIndentOption(true)}>정렬</button>

          {isIndentOption && (
            <div className={styles['dropdown-menu']}>
              <button onClick={() => editor.commands.indent()}>+ 들여쓰기</button>
              <button onClick={() => editor.commands.outdent()}>- 내어쓰기</button>
            </div>
          )}
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} className={styles.tiptap} />
    </>
  )
}

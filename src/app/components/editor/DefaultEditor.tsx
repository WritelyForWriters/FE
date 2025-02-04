'use client'

import React, { useState } from 'react'

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

import { CommandProps, Extension, GlobalAttributes } from '@tiptap/core'
import Blockquote from '@tiptap/extension-blockquote'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'

import styles from './styles.module.scss'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Indent: {
      indent: () => ReturnType
      outdent: () => ReturnType
    }
  }
}

type IndentOptions = {
  types: string[]
  indentLevels: number[]
  defaultIndentLevel: number
}

const Indent = Extension.create<IndentOptions>({
  name: 'indent',
  addOptions: () => {
    return {
      types: ['paragraph'],
      indentLevels: [0, 30, 60, 90],
      defaultIndentLevel: 0,
    }
  },

  addGlobalAttributes: (): GlobalAttributes => {
    return [
      {
        types: Indent.options.types,
        attributes: {
          indent: {
            default: Indent.options.defaultIndentLevel,
            renderHTML: (attributes) => {
              const indent = isNaN(attributes.indent) ? 0 : attributes.indent
              return {
                style: `margin-left: ${indent}px!important;`,
              }
            },
            parseHTML: (element) => ({
              indent: parseInt(element.style.marginLeft) || Indent.options.defaultIndentLevel,
            }),
          },
        },
      },
    ]
  },

  addCommands: () => {
    return {
      indent:
        () =>
        ({ commands, editor }: CommandProps) => {
          const indentLevels: number[] = Indent.options.indentLevels
          const indent = editor.getAttributes('paragraph').indent
          const currentIndent = isNaN(indent) ? 0 : indent
          const nextIndent =
            indentLevels.find((level: number) => level > currentIndent) || currentIndent
          return commands.updateAttributes('paragraph', { indent: nextIndent })
        },
      outdent:
        () =>
        ({ commands, editor }: CommandProps) => {
          const indentLevels: number[] = Indent.options.indentLevels
          const currentIndent = editor.getAttributes('paragraph').indent || 0
          const prevIndent = [...indentLevels].reverse().find((level) => level < currentIndent) || 0
          return commands.updateAttributes('paragraph', { indent: prevIndent })
        },
    }
  },

  addKeyboardShortcuts: () => {
    return {
      Tab: ({ editor }) => editor.commands.indent(),
      'Shift-Tab': ({ editor }) => editor.commands.outdent(),
    }
  },
})

export default function DefaultEditor() {
  const [isOpen, setIsOpen] = useState(false)
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
          onHidden: () => setIsOpen(false),
        }}
      >
        <div className={styles['bubble-menu']}>
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
          <button onClick={() => editor.commands.indent()}>+ 들여쓰기</button>
          <button onClick={() => editor.commands.outdent()}>- 내어쓰기</button>
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} className={styles.tiptap} />
    </>
  )
}

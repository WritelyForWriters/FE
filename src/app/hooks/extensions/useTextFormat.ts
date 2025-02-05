'use client'

import { Editor } from '@tiptap/react'

const useTextFormat = (editor: Editor) => {
  /** 본문 */
  const toggleText = () => {
    editor?.commands.unsetBlockquote()
    editor?.commands.setParagraph()
  }

  /** 인용 */
  const toggleBlockquote = () => {
    editor?.chain().focus().toggleBlockquote().run()
  }

  /** 제목 */
  const toggleHeading = () => {
    editor?.commands.unsetBlockquote()
    editor?.chain().focus().toggleHeading({ level: 1 }).run()
  }

  return {
    toggleText,
    toggleBlockquote,
    toggleHeading,
  }
}

export default useTextFormat

'use client'

import { Editor } from '@tiptap/react'

export const useTextMark = (editor: Editor) => {
  const toggleBold = () => {
    editor.chain().focus().toggleBold().run()
  }

  const toggleItalic = () => {
    editor.chain().focus().toggleItalic().run()
  }

  const toggleUnderline = () => {
    editor.chain().focus().toggleUnderline().run()
  }

  return {
    toggleBold,
    toggleItalic,
    toggleUnderline,
  }
}

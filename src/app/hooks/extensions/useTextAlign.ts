'use client'

import { Editor } from '@tiptap/react'

const useTextAlign = (editor: Editor) => {
  const setTextAlignLeft = () => {
    editor.chain().focus().setTextAlign('left').run()
  }

  const setTextAlignCenter = () => {
    editor.chain().focus().setTextAlign('center').run()
  }
  const setTextAlignRight = () => {
    editor.chain().focus().setTextAlign('right').run()
  }

  return {
    setTextAlignLeft,
    setTextAlignCenter,
    setTextAlignRight,
  }
}

export default useTextAlign

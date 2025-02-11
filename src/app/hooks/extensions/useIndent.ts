'use client'

import { Editor } from '@tiptap/react'

export const useIndent = (editor: Editor) => {
  const indent = () => editor?.commands.indent()
  const outdent = () => editor?.commands.outdent()

  return {
    indent,
    outdent,
  }
}

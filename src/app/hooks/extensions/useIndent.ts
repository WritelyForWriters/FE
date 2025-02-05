'use client'

import { Editor } from '@tiptap/react'

const useIndent = (editor: Editor) => {
  const indent = () => editor?.commands.indent()
  const outdent = () => editor?.commands.outdent()

  return {
    indent,
    outdent,
  }
}

export default useIndent

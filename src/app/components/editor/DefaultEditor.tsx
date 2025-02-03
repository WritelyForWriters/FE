'use client'

import React from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import styles from './styles.module.scss'

export default function DefaultEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
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
      <EditorContent editor={editor} className={styles.tiptap} />
    </>
  )
}

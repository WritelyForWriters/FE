'use client'

import Image from 'next/image'

import { ChangeEvent, useState } from 'react'

import Bold from '@tiptap/extension-bold'
import Document from '@tiptap/extension-document'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Italic from '@tiptap/extension-italic'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, Editor, EditorContent, useEditor } from '@tiptap/react'
import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'

import BlockquoteExtension from '@extensions/Blockquote'
import Indent from '@extensions/Indent'

import PropmptInput from './PromptInput'
import Toolbar from './Toolbar'

import styles from './DefaultEditor.module.scss'

// TODO 단축키 '/'로 버블메뉴 활성화

export default function DefaultEditor() {
  // TODO 전역상태관리
  const [activeMenu, setActiveMenu] = useState<'defaultToolbar' | 'aiToolbar'>('defaultToolbar')
  const [selection, setSelection] = useState<{ from: number; to: number } | null>(null)
  const [value, setValue] = useState('')

  const { isOpen, onOpen, onClose } = useCollapsed()

  const editor = useEditor({
    extensions: [
      Document,
      BlockquoteExtension,
      Text,
      Paragraph,
      Heading.configure({
        levels: [1],
      }),
      Indent,
      Bold,
      Italic,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    immediatelyRender: false,
    content: `
      Nothing is impossible, the word itself says “I’m possible!”
      <p></p>
      <p>드래그해서 수정하기</p>
      <p>Audrey Hepburn</p>
    `,
  })

  const handleActiveMenu = () => {
    setActiveMenu('aiToolbar')
  }

  // --드래그한 영역 저장
  const handleTextSelection = (editor: Editor) => {
    const { state } = editor!
    const { from, to } = state.selection

    if (from !== to) {
      setSelection({ from, to })
    }
    editor?.commands.setMark('highlight', { color: '#FFFAE5' })
  }

  if (!editor) {
    return null
  }

  // --프롬프트 입력
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  // --프롬프트 기반 수동 수정 기능
  const handleAIPrompt = (editor: Editor) => {
    // TODO API 연동

    if (!value) return

    onOpen()
    handleTextSelection(editor)
  }

  console.log(selection)

  return (
    <section className={styles.section}>
      <BubbleMenu
        editor={editor}
        tippyOptions={{
          duration: 100,
          maxWidth: 'none',
          onHidden: () => {
            setActiveMenu('defaultToolbar')
            setSelection(null)
            // TODO remove text highlight
          },
        }}
        // --shouldShow: 버블 메뉴 표시를 제어하는 콜백
        shouldShow={({ state }) => {
          const { selection } = state
          // --드래그한 text가 있다면 버블메뉴 활성화
          if (!selection.empty) {
            return true
          }
          return false
        }}
      >
        {activeMenu === 'defaultToolbar' ? (
          <Toolbar editor={editor} handleActiveMenu={handleActiveMenu} />
        ) : (
          <>
            <PropmptInput
              editor={editor}
              handleChangeInput={handleChangeInput}
              handleAIPrompt={handleAIPrompt}
            />
            <div className={styles['prompt-menu']}>
              <SelectMenu handleClose={onClose} isOpen={isOpen}>
                <SelectMenu.Option option={{ handleAction: () => {} }}>
                  <FaCheck color="#CCCCCC" fontSize={20} style={{ padding: '2px' }} />
                  이대로 수정하기
                </SelectMenu.Option>
                <SelectMenu.Option option={{ handleAction: () => {} }}>
                  <Image src="/icons/refresh.svg" alt="다시 생성하기" width={20} height={20} />
                  다시 생성하기
                </SelectMenu.Option>
                <SelectMenu.Option option={{ handleAction: () => {} }}>
                  <IoClose color="#CCCCCC" fontSize={20} />
                  취소하기
                </SelectMenu.Option>
              </SelectMenu>
            </div>
          </>
        )}
      </BubbleMenu>
      <EditorContent editor={editor} className={styles.tiptap} />
    </section>
  )
}

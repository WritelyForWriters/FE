import { useState } from 'react'

import { Editor } from '@tiptap/react'

import styles from './Toolbar.module.scss'

interface ToolbarProps {
  editor: Editor
}

export default function Toolbar({ editor }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isIndentOption, setIsIndentOption] = useState(false)

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

  return (
    <ul className={styles['bubble-menu']}>
      {/* 텍스트 형식 툴바 */}
      <button onClick={() => setIsOpen(true)}>{getTextFormatOption()}</button>

      {isOpen && (
        <div className={styles['dropdown-menu']}>
          <button
            onClick={toggleText}
            className={
              !editor?.isActive('blockquote') && !editor?.isActive('heading')
                ? `${styles['is-active']}`
                : ''
            }
          >
            본문
          </button>
          <button
            onClick={toggleHeading}
            className={editor?.isActive('heading') ? `${styles['is-active']}` : ''}
          >
            제목
          </button>
          <button
            onClick={toggleBlockquote}
            className={editor?.isActive('blockquote') ? `${styles['is-active']}` : ''}
          >
            인용
          </button>
        </div>
      )}

      {/* 정렬 툴바 */}
      <button onClick={() => setIsIndentOption(true)}>정렬</button>

      {isIndentOption && (
        <div className={styles['dropdown-menu']}>
          <button onClick={() => editor?.commands.indent()}>+ 들여쓰기</button>
          <button onClick={() => editor?.commands.outdent()}>- 내어쓰기</button>
        </div>
      )}
    </ul>
  )
}

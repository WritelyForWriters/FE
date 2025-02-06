import { useCallback, useState } from 'react'

import { Editor } from '@tiptap/react'
import { IoIosArrowDown } from 'react-icons/io'

import useDetectClose from '@hooks/common/useDetectClose'
import useIndent from '@hooks/extensions/useIndent'
import useTextFormat from '@hooks/extensions/useTextFormat'

import styles from './Toolbar.module.scss'

interface ToolbarProps {
  editor: Editor
}

export default function Toolbar({ editor }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isIndentOption, setIsIndentOption] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleIndentClose = () => {
    setIsIndentOption(false)
  }

  const textFormatSelectMenuRef = useDetectClose(handleClose)
  const indentSelectMenuRef = useDetectClose(handleIndentClose)

  const { toggleText, toggleBlockquote, toggleHeading } = useTextFormat(editor)
  const { indent, outdent } = useIndent(editor)

  const getTextFormatOption = () => {
    if (editor?.isActive('blockquote')) {
      return '인용'
    } else if (editor?.isActive('heading')) {
      return '제목'
    } else {
      return '본문'
    }
  }

  const getActiveStyleClass = useCallback((isActive: boolean) => {
    return isActive ? `${styles['is-active']}` : ''
  }, [])

  return (
    <ul className={styles['bubble-menu']}>
      {/* 텍스트 형식 툴바 */}
      <button onClick={() => setIsOpen(true)}>
        {getTextFormatOption()}
        <IoIosArrowDown size={16} fill="#CCCCCC" />
      </button>

      {isOpen && (
        <div ref={textFormatSelectMenuRef} className={styles['select-menu']}>
          <button
            onClick={toggleText}
            className={getActiveStyleClass(
              !editor.isActive('blockquote') && !editor.isActive('heading'),
            )}
          >
            본문
          </button>
          <button
            onClick={toggleHeading}
            className={getActiveStyleClass(editor.isActive('heading'))}
          >
            제목
          </button>
          <button
            onClick={toggleBlockquote}
            className={getActiveStyleClass(editor.isActive('blockquote'))}
          >
            인용
          </button>
        </div>
      )}

      {/* 정렬 툴바 */}
      <button onClick={() => setIsIndentOption(true)}>
        정렬
        <IoIosArrowDown size={16} fill="#CCCCCC" />
      </button>

      {isIndentOption && (
        <div ref={indentSelectMenuRef} className={styles['select-menu']}>
          <button
            onClick={indent}
            className={getActiveStyleClass(editor.getAttributes('paragraph').indent)}
          >
            + 들여쓰기
          </button>
          <button onClick={outdent}>- 내어쓰기</button>
        </div>
      )}

      <div className={styles['text-mark']}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getActiveStyleClass(editor.isActive('bold'))}
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getActiveStyleClass(editor.isActive('italic'))}
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getActiveStyleClass(editor.isActive('underline'))}
        >
          U
        </button>
      </div>

      <div className={styles.line}>{''}</div>

      {/* 메모 툴바 */}
      <button>메모</button>

      <div className={styles.line}>{''}</div>

      {/* AI 어시스턴트 */}
      <button onClick={() => setIsIndentOption(true)}>
        AI 어시스턴트
        <IoIosArrowDown size={16} fill="#CCCCCC" />
      </button>
    </ul>
  )
}

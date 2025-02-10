import Image from 'next/image'

import { useCallback, useState } from 'react'

import { Editor } from '@tiptap/react'
import { IoIosArrowDown } from 'react-icons/io'

import useDetectClose from '@hooks/common/useDetectClose'
import useIndent from '@hooks/extensions/useIndent'
import useTextFormat from '@hooks/extensions/useTextFormat'
import useTextMark from '@hooks/extensions/useTextMark'

import styles from './Toolbar.module.scss'

interface ToolbarProps {
  editor: Editor
}

interface SelectOptionType {
  label: string
  isActiveOption: boolean
  handleTextAction: () => void
}

interface SelectOptionProps {
  option: SelectOptionType
}

function SelectOption({ option }: SelectOptionProps) {
  const { label, handleTextAction, isActiveOption } = option

  const getActiveStyleClass = useCallback((isActive: boolean) => {
    return isActive ? `${styles['is-active']}` : ''
  }, [])

  return (
    <button key={label} onClick={handleTextAction} className={getActiveStyleClass(isActiveOption)}>
      {label}
    </button>
  )
}

interface SelectMenuProps {
  options: SelectOptionType[]
  isOpen: boolean
  handleClose: () => void
}

function SelectMenu({ isOpen, handleClose, options }: SelectMenuProps) {
  const selectMenuRef = useDetectClose(handleClose)

  return (
    <>
      {isOpen && (
        <div ref={selectMenuRef} className={styles['select-menu']}>
          {options.map((option) => (
            <SelectOption key={option.label} option={option} />
          ))}
        </div>
      )}
    </>
  )
}

/** 정렬, 드롭다운 */
export default function Toolbar({ editor }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAlignOption, setIsAlignOption] = useState(false)
  const [isAiOption, setIsAiOption] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleAlignClose = () => {
    setIsAlignOption(false)
  }

  const handleAiOptionClose = () => {
    setIsAiOption(false)
  }

  // const textFormatSelectMenuRef = useDetectClose(handleClose)
  const alignSelectMenuRef = useDetectClose(handleAlignClose)
  const aiSelectMenuRef = useDetectClose(handleAiOptionClose)

  const { toggleText, toggleBlockquote, toggleHeading } = useTextFormat(editor)
  const { indent, outdent } = useIndent(editor)
  const { toggleBold, toggleItalic, toggleUnderline } = useTextMark(editor)

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
    <div className={styles['bubble-menu']}>
      {/* 텍스트 형식 툴바 */}
      <div>
        <button onClick={() => setIsOpen(true)}>
          {getTextFormatOption()}
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </button>

        <SelectMenu
          handleClose={handleClose}
          isOpen={isOpen}
          options={[
            {
              label: '본문',
              handleTextAction: toggleText,
              isActiveOption: !editor.isActive('blockquote') && !editor.isActive('heading'),
            },
            {
              label: '제목',
              handleTextAction: toggleHeading,
              isActiveOption: editor.isActive('heading'),
            },
            {
              label: '인용',
              handleTextAction: toggleBlockquote,
              isActiveOption: editor.isActive('blockquote'),
            },
          ]}
        />
      </div>

      {/* 정렬 툴바 */}
      <div>
        <button onClick={() => setIsAlignOption(true)}>
          정렬
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </button>

        {isAlignOption && (
          <div ref={alignSelectMenuRef} className={styles['select-menu']}>
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? `${styles['is-active']}` : ''}
            >
              <Image src="/icons/text-align-left.svg" alt="왼쪽정렬" width={20} height={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? `${styles['is-active']}` : ''}
            >
              <Image src="/icons/text-align-center.svg" alt="가운데정렬" width={20} height={20} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? `${styles['is-active']}` : ''}
            >
              <Image src="/icons/text-align-right.svg" alt="오른쪽정렬" width={20} height={20} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.line} />

      {/* 들여쓰기, 내어쓰기 */}
      <div>
        <button
          onClick={indent}
          className={getActiveStyleClass(editor.getAttributes('paragraph').indent)}
        >
          +
        </button>
        <button onClick={outdent}>-</button>
      </div>

      <div className={styles.line} />

      {/* 텍스트 mark 툴바 */}
      <div className={styles['text-mark']}>
        <button onClick={toggleBold} className={getActiveStyleClass(editor.isActive('bold'))}>
          B
        </button>
        <button onClick={toggleItalic} className={getActiveStyleClass(editor.isActive('italic'))}>
          I
        </button>
        <button
          onClick={toggleUnderline}
          className={getActiveStyleClass(editor.isActive('underline'))}
        >
          U
        </button>
      </div>

      <div className={styles.line} />

      {/* 메모 툴바 */}
      <div>
        <button>메모</button>
      </div>

      <div className={styles.line} />

      {/* AI 어시스턴트 */}
      <div>
        <button onClick={() => setIsAiOption(true)}>
          AI 어시스턴트
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </button>

        {isAiOption && (
          <div ref={aiSelectMenuRef} className={styles['select-menu']}>
            <button>자동 수정</button>
            <button>수동 수정</button>
            <button>구간 피드백</button>
            <button>자유 대화</button>
          </div>
        )}
      </div>
    </div>
  )
}

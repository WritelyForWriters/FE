import Image, { ImageProps } from 'next/image'

import { ReactElement, useCallback, useState } from 'react'

import { Editor } from '@tiptap/react'
import { IoIosArrowDown } from 'react-icons/io'

import { useDetectClose, useIndent, useTextAlign, useTextFormat, useTextMark } from '@hooks/index'

import styles from './Toolbar.module.scss'

interface ToolbarProps {
  editor: Editor
}

interface SelectOptionType {
  label: string | ReactElement<ImageProps>
  isActiveOption?: boolean
  handleTextAction?: () => void
  className?: string
}

interface SelectOptionProps {
  option: SelectOptionType
}

function SelectOption({ option }: SelectOptionProps) {
  const { label, handleTextAction, isActiveOption = false, className } = option

  const getActiveStyleClass = useCallback((isActive: boolean) => {
    return isActive ? `${styles['is-active']}` : ''
  }, [])

  return (
    <button
      onClick={handleTextAction}
      className={`${getActiveStyleClass(isActiveOption)} ${className}`}
    >
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
          {options.map((option, index) => (
            <SelectOption key={index} option={option} />
          ))}
        </div>
      )}
    </>
  )
}

export default function Toolbar({ editor }: ToolbarProps) {
  const [isTextFormatMenuOpen, setIsTextFormatMenuOpen] = useState(false) // TODO hook
  const [isTextAlignMenuOpen, setIsTextAlignMenuOpen] = useState(false)
  const [isAiOption, setIsAiOption] = useState(false)

  const { toggleText, toggleBlockquote, toggleHeading } = useTextFormat(editor)
  const { indent, outdent } = useIndent(editor)
  const { toggleBold, toggleItalic, toggleUnderline } = useTextMark(editor)
  const { setTextAlignLeft, setTextAlignCenter, setTextAlignRight } = useTextAlign(editor)

  const getTextFormatOption = () => {
    if (editor?.isActive('blockquote')) {
      return '인용'
    } else if (editor?.isActive('heading')) {
      return '제목'
    } else {
      return '본문'
    }
  }

  return (
    <div className={styles['bubble-menu']}>
      {/* Text Format */}
      <div>
        <button onClick={() => setIsTextFormatMenuOpen(true)}>
          {getTextFormatOption()}
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </button>

        <SelectMenu
          handleClose={() => setIsTextFormatMenuOpen(false)}
          isOpen={isTextFormatMenuOpen}
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

      {/* Align */}
      <div>
        <button onClick={() => setIsTextAlignMenuOpen(true)}>
          정렬
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </button>

        <SelectMenu
          handleClose={() => setIsTextAlignMenuOpen(false)}
          isOpen={isTextAlignMenuOpen}
          options={[
            {
              label: (
                <Image src="/icons/text-align-left.svg" alt="왼쪽정렬" width={20} height={20} />
              ),
              handleTextAction: setTextAlignLeft,
              isActiveOption: editor.isActive({ textAlign: 'left' }),
            },
            {
              label: (
                <Image src="/icons/text-align-center.svg" alt="가운데정렬" width={20} height={20} />
              ),
              handleTextAction: setTextAlignCenter,
              isActiveOption: editor.isActive({ textAlign: 'center' }),
            },
            {
              label: (
                <Image src="/icons/text-align-right.svg" alt="오른쪽정렬" width={20} height={20} />
              ),
              handleTextAction: setTextAlignRight,
              isActiveOption: editor.isActive({ textAlign: 'right' }),
            },
          ]}
        />
      </div>

      <div className={styles.line} />

      {/* Indent */}
      <div className={styles['text-mark']}>
        <SelectOption
          option={{
            label: <Image src="/icons/indent.svg" alt="들여쓰기" width={18} height={18} />,
            handleTextAction: indent,
            isActiveOption: editor.getAttributes('paragraph').indent,
          }}
        />
        <SelectOption
          option={{
            label: <Image src="/icons/outdent.svg" alt="내어쓰기" width={18} height={18} />,
            handleTextAction: outdent,
          }}
        />
      </div>

      <div className={styles.line} />

      {/* Text Mark */}
      <div className={styles['text-mark']}>
        <SelectOption
          option={{
            label: 'B',
            handleTextAction: toggleBold,
            isActiveOption: editor.isActive('bold'),
            className: styles.bold,
          }}
        />
        <SelectOption
          option={{
            label: 'I',
            handleTextAction: toggleItalic,
            isActiveOption: editor.isActive('italic'),
            className: styles.italic,
          }}
        />
        <SelectOption
          option={{
            label: 'U',
            handleTextAction: toggleUnderline,
            isActiveOption: editor.isActive('underline'),
            className: styles.underline,
          }}
        />
      </div>

      <div className={styles.line} />

      {/* Memo */}
      <div className={styles['text-mark']}>
        <button>메모</button>
      </div>

      <div className={styles.line} />

      {/* AI 어시스턴트 */}
      <div>
        <button onClick={() => setIsAiOption(true)}>
          AI 어시스턴트
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </button>

        <SelectMenu
          handleClose={() => setIsAiOption(false)}
          isOpen={isAiOption}
          options={[
            {
              label: (
                <>
                  <Image src="/icons/ai-option1.svg" alt="자동수정" width={20} height={20} />
                  자동 수정
                </>
              ),
              className: styles['select-option'],
            },
            {
              label: (
                <>
                  <Image src="/icons/ai-option2.svg" alt="수동수정" width={20} height={20} />
                  수동 수정
                </>
              ),
              className: styles['select-option'],
            },
            {
              label: (
                <>
                  <Image src="/icons/ai-option3.svg" alt="구간피드백" width={20} height={20} />
                  구간 피드백
                </>
              ),
              className: styles['select-option'],
            },
            {
              label: (
                <>
                  <Image src="/icons/ai-option4.svg" alt="자유대화" width={20} height={20} />
                  자유 대화
                </>
              ),
              className: styles['select-option'],
            },
          ]}
        />
      </div>
    </div>
  )
}

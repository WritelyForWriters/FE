import Image, { ImageProps } from 'next/image'

import { ReactElement, useCallback, useState } from 'react'

import { Editor } from '@tiptap/react'
import { IoIosArrowDown } from 'react-icons/io'

import SelectMenu from '@components/select-menu/SelectMenu'

import { useIndent, useTextAlign, useTextFormat, useTextMark } from '@hooks/index'

import styles from './Toolbar.module.scss'

interface ToolbarButtoType {
  label: string | ReactElement<ImageProps>
  isActiveOption?: boolean
  handleTextAction?: () => void
  className?: string
}

interface ToolbarButtonProps {
  option: ToolbarButtoType
}

function ToolbarButton({ option }: ToolbarButtonProps) {
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

interface ToolbarProps {
  editor: Editor
}

export default function Toolbar({ editor }: ToolbarProps) {
  const [isTextFormatMenuOpen, setIsTextFormatMenuOpen] = useState(false)
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
        >
          <SelectMenu.Option
            option={{
              label: '본문',
              handleAction: toggleText,
              isActiveOption: !editor.isActive('blockquote') && !editor.isActive('heading'),
            }}
          />
          <SelectMenu.Option
            option={{
              label: '제목',
              handleAction: toggleHeading,
              isActiveOption: editor.isActive('heading'),
            }}
          />
          <SelectMenu.Option
            option={{
              label: '인용',
              handleAction: toggleBlockquote,
              isActiveOption: editor.isActive('blockquote'),
            }}
          />
        </SelectMenu>
      </div>

      {/* Align */}
      <div>
        <button onClick={() => setIsTextAlignMenuOpen(true)}>
          정렬
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </button>

        <SelectMenu handleClose={() => setIsTextAlignMenuOpen(false)} isOpen={isTextAlignMenuOpen}>
          <SelectMenu.Option
            option={{
              label: (
                <Image src="/icons/text-align-left.svg" alt="왼쪽정렬" width={20} height={20} />
              ),
              handleAction: setTextAlignLeft,
              isActiveOption: editor.isActive({ textAlign: 'left' }),
            }}
          />
          <SelectMenu.Option
            option={{
              label: (
                <Image src="/icons/text-align-center.svg" alt="가운데정렬" width={20} height={20} />
              ),
              handleAction: setTextAlignCenter,
              isActiveOption: editor.isActive({ textAlign: 'center' }),
            }}
          />
          <SelectMenu.Option
            option={{
              label: (
                <Image src="/icons/text-align-right.svg" alt="오른쪽정렬" width={20} height={20} />
              ),
              handleAction: setTextAlignRight,
              isActiveOption: editor.isActive({ textAlign: 'right' }),
            }}
          />
        </SelectMenu>
      </div>

      <div className={styles.line} />

      {/* Indent */}
      <div className={styles['text-mark']}>
        <ToolbarButton
          option={{
            label: <Image src="/icons/indent.svg" alt="들여쓰기" width={18} height={18} />,
            handleTextAction: indent,
            isActiveOption: editor.getAttributes('paragraph').indent,
          }}
        />
        <ToolbarButton
          option={{
            label: <Image src="/icons/outdent.svg" alt="내어쓰기" width={18} height={18} />,
            handleTextAction: outdent,
          }}
        />
      </div>

      <div className={styles.line} />

      {/* Text Mark */}
      <div className={styles['text-mark']}>
        <ToolbarButton
          option={{
            label: 'B',
            handleTextAction: toggleBold,
            isActiveOption: editor.isActive('bold'),
            className: styles.bold,
          }}
        />
        <ToolbarButton
          option={{
            label: 'I',
            handleTextAction: toggleItalic,
            isActiveOption: editor.isActive('italic'),
            className: styles.italic,
          }}
        />
        <ToolbarButton
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

        <SelectMenu handleClose={() => setIsAiOption(false)} isOpen={isAiOption}>
          <SelectMenu.Option
            option={{
              label: (
                <>
                  <Image src="/icons/ai-option1.svg" alt="자동수정" width={20} height={20} />
                  자동 수정
                </>
              ),
              className: styles['select-option'],
            }}
          />
          <SelectMenu.Option
            option={{
              label: (
                <>
                  <Image src="/icons/ai-option3.svg" alt="구간피드백" width={20} height={20} />
                  구간 피드백
                </>
              ),
              className: styles['select-option'],
            }}
          />
          <SelectMenu.Option
            option={{
              label: (
                <>
                  <Image src="/icons/ai-option4.svg" alt="자유대화" width={20} height={20} />
                  자유 대화
                </>
              ),
              className: styles['select-option'],
            }}
          />
          <SelectMenu.Option
            option={{
              label: (
                <>
                  <Image src="/icons/ai-option2.svg" alt="수동수정" width={20} height={20} />
                  수동 수정
                </>
              ),
              className: styles['select-option'],
            }}
          />
        </SelectMenu>
      </div>
    </div>
  )
}

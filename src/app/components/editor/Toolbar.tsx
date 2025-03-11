import Image from 'next/image'

import { ReactNode, useState } from 'react'

import { Editor } from '@tiptap/react'
import { IoIosArrowDown } from 'react-icons/io'

import SelectMenu from '@components/select-menu/SelectMenu'

import { useIndent, useTextAlign, useTextFormat, useTextMark } from '@hooks/index'

import styles from './Toolbar.module.scss'

interface ToolbarButtonProps {
  children: ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
}

function ToolbarButton({ children, isActive, onClick, className }: ToolbarButtonProps) {
  const activeStyle = isActive ? `${styles['is-active']}` : ''

  return (
    <button onClick={onClick} className={`${activeStyle} ${className}`}>
      {children}
    </button>
  )
}

interface ToolbarProps {
  editor: Editor
  handleActiveMenu: () => void
}

export default function Toolbar({ editor, handleActiveMenu }: ToolbarProps) {
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
        <ToolbarButton onClick={() => setIsTextFormatMenuOpen(true)}>
          {getTextFormatOption()}
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </ToolbarButton>

        <SelectMenu
          handleClose={() => setIsTextFormatMenuOpen(false)}
          isOpen={isTextFormatMenuOpen}
          style={{ top: '36px', width: '69px', left: '-8px' }}
        >
          <SelectMenu.Option
            option={{
              handleAction: toggleText,
              isActiveOption: !editor.isActive('blockquote') && !editor.isActive('heading'),
            }}
          >
            본문
          </SelectMenu.Option>
          <SelectMenu.Option
            option={{
              handleAction: toggleHeading,
              isActiveOption: editor.isActive('heading'),
            }}
          >
            제목
          </SelectMenu.Option>
          <SelectMenu.Option
            option={{
              handleAction: toggleBlockquote,
              isActiveOption: editor.isActive('blockquote'),
            }}
          >
            인용
          </SelectMenu.Option>
        </SelectMenu>
      </div>

      {/* Align */}
      <div>
        <ToolbarButton onClick={() => setIsTextAlignMenuOpen(true)}>
          정렬
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </ToolbarButton>

        <SelectMenu
          handleClose={() => setIsTextAlignMenuOpen(false)}
          isOpen={isTextAlignMenuOpen}
          style={{ top: '36px' }}
        >
          <SelectMenu.Option
            option={{
              handleAction: setTextAlignLeft,
              isActiveOption: editor.isActive({ textAlign: 'left' }),
            }}
          >
            <Image src="/icons/text-align-left.svg" alt="왼쪽정렬" width={20} height={20} />
          </SelectMenu.Option>
          <SelectMenu.Option
            option={{
              handleAction: setTextAlignCenter,
              isActiveOption: editor.isActive({ textAlign: 'center' }),
            }}
          >
            <Image src="/icons/text-align-center.svg" alt="가운데정렬" width={20} height={20} />
          </SelectMenu.Option>
          <SelectMenu.Option
            option={{
              handleAction: setTextAlignRight,
              isActiveOption: editor.isActive({ textAlign: 'right' }),
            }}
          >
            <Image src="/icons/text-align-right.svg" alt="오른쪽정렬" width={20} height={20} />
          </SelectMenu.Option>
        </SelectMenu>
      </div>

      <div className={styles.line} />

      {/* Indent */}
      <div className={styles['text-mark']}>
        <ToolbarButton onClick={indent}>
          <Image src="/icons/indent.svg" alt="들여쓰기" width={18} height={18} />
        </ToolbarButton>
        <ToolbarButton onClick={outdent}>
          <Image src="/icons/outdent.svg" alt="내어쓰기" width={18} height={18} />
        </ToolbarButton>
      </div>

      <div className={styles.line} />

      {/* Text Mark */}
      <div className={styles['text-mark']}>
        <ToolbarButton
          onClick={toggleBold}
          isActive={editor.isActive('bold')}
          className={styles.bold}
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleItalic}
          isActive={editor.isActive('italic')}
          className={styles.italic}
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={toggleUnderline}
          isActive={editor.isActive('underline')}
          className={styles.underline}
        >
          U
        </ToolbarButton>
      </div>

      <div className={styles.line} />

      {/* Memo */}
      <div className={styles['text-mark']}>
        <ToolbarButton>메모</ToolbarButton>
      </div>

      <div className={styles.line} />

      {/* AI 어시스턴트 */}
      <div>
        <ToolbarButton onClick={() => setIsAiOption(true)}>
          AI 어시스턴트
          <IoIosArrowDown size={16} fill="#CCCCCC" />
        </ToolbarButton>

        <SelectMenu
          handleClose={() => setIsAiOption(false)}
          isOpen={isAiOption}
          style={{ top: '36px', width: '121px' }}
        >
          <SelectMenu.Option option={{ className: styles['select-option'] }}>
            <Image src="/icons/ai-option1.svg" alt="자동수정" width={20} height={20} />
            자동 수정
          </SelectMenu.Option>
          <SelectMenu.Option
            option={{ className: styles['select-option'], handleAction: handleActiveMenu }}
          >
            <Image src="/icons/ai-option2.svg" alt="수동수정" width={20} height={20} />
            수동 수정
          </SelectMenu.Option>
          <SelectMenu.Option option={{ className: styles['select-option'] }}>
            <Image src="/icons/ai-option3.svg" alt="구간피드백" width={20} height={20} />
            구간 피드백
          </SelectMenu.Option>
          <SelectMenu.Option option={{ className: styles['select-option'] }}>
            <Image src="/icons/ai-option4.svg" alt="자유대화" width={20} height={20} />
            자유 대화
          </SelectMenu.Option>
        </SelectMenu>
      </div>
    </div>
  )
}

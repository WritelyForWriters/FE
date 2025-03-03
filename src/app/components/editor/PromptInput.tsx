import { Editor } from '@tiptap/react'

import FillButton from '@components/buttons/FillButton'

import classNames from 'classnames/bind'

import styles from './PromptInput.module.scss'

const cx = classNames.bind(styles)

interface PropmptInputProps {
  editor: Editor
  handleTextSelection: (editor: Editor) => void
}

export default function PropmptInput({ editor, handleTextSelection }: PropmptInputProps) {
  return (
    <div className={cx('prompt-menu')}>
      <input autoFocus className={cx('prompt-menu__input')} />
      <FillButton
        size="medium"
        variant="primary"
        style={{
          padding: '0.8rem 1.2rem',
          height: '100%',
        }}
        onClick={() => handleTextSelection(editor)}
      >
        생성하기
      </FillButton>
    </div>
  )
}

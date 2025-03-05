import Image from 'next/image'

import { ChangeEvent } from 'react'

import { Editor } from '@tiptap/react'
import { useAtom } from 'jotai'
import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { promptValueAtom, selectionAtom } from 'store/editorAtoms'

import FillButton from '@components/buttons/FillButton'
import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './PromptInput.module.scss'

const cx = classNames.bind(styles)

interface PropmptInputProps {
  editor: Editor
}

// TODO 선택한 텍스트 구간과 AI 선택 메뉴를 바탕으로 수정 - API 연동
export default function PropmptInput({ editor }: PropmptInputProps) {
  const [promptValue, setPromptValue] = useAtom(promptValueAtom)
  const [, setSelection] = useAtom(selectionAtom)

  const { isOpen, onOpen, onClose } = useCollapsed()

  // --프롬프트 입력
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPromptValue(e.target.value)
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

  const handleAIPrompt = (editor: Editor) => {
    if (!promptValue) return

    onOpen()
    handleTextSelection(editor)
  }

  return (
    <>
      <div className={cx('prompt-menu')}>
        <input autoFocus className={cx('prompt-menu__input')} onChange={handleChangeInput} />

        <FillButton
          size="medium"
          variant="primary"
          style={{
            padding: '0.8rem 1.2rem',
            height: '100%',
          }}
          onClick={() => handleAIPrompt(editor)}
        >
          생성하기
        </FillButton>
      </div>

      <div className={cx('select-menu')}>
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
  )
}

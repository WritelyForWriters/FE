import Image from 'next/image'

import { ChangeEvent } from 'react'

import { Editor } from '@tiptap/react'
import { useAtom, useSetAtom } from 'jotai'
import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { activeMenuAtom, promptValueAtom, selectionAtom } from 'store/editorAtoms'

import FillButton from '@components/buttons/FillButton'
import SelectMenu from '@components/select-menu/SelectMenu'

import { useCollapsed } from '@hooks/common/useCollapsed'

import classNames from 'classnames/bind'

import styles from './PromptMenu.module.scss'

const cx = classNames.bind(styles)

interface PropmptInputProps {
  editor: Editor
}

export default function PromptMenu({ editor }: PropmptInputProps) {
  const [promptValue, setPromptValue] = useAtom(promptValueAtom)
  const setSelection = useSetAtom(selectionAtom)
  const setActiveMenu = useSetAtom(activeMenuAtom)

  const { isOpen, onOpen, onClose } = useCollapsed()

  // --프롬프트 입력
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPromptValue(e.target.value)
  }

  // --드래그한 영역 저장 및 하이라이트
  const handleTextSelection = (editor: Editor) => {
    const { state } = editor!
    const { from, to } = state.selection

    if (from !== to) {
      setSelection({ from, to })
      editor?.commands.setMark('highlight', { color: '#FFFAE5' })
      return { from, to }
    }
    return null
  }

  // NOTE(sohyun): 드래그한 영역에 생성된 텍스트 적용할 때, 에디터가 새로 렌더링되는 문제로인해 주석처리 해둠
  const handleChangeText = (selection: { from: number; to: number }) => {
    // editor.getText().slice(selection?.from, selection?.to)
    // editor.commands.insertContentAt(
    //   { from: selection?.from, to: selection?.to },
    //   '대체 텍스트 입니다.',
    // )

    console.log(selection) // lint error
  }

  const handleAIPrompt = (editor: Editor) => {
    if (!promptValue) return

    const selectedText = handleTextSelection(editor)
    if (selectedText) {
      handleChangeText(selectedText)
    }
    onOpen()
  }

  const handleOptionClick = (option: 'apply' | 'recreate' | 'cancel') => () => {
    // TODO 선택한 텍스트 구간과 AI 선택 메뉴를 바탕으로 API 연동

    switch (option) {
      case 'cancel':
        setActiveMenu('defaultToolbar')
    }
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
          <SelectMenu.Option option={{ handleAction: handleOptionClick('apply') }}>
            <FaCheck color="#CCCCCC" fontSize={20} style={{ padding: '2px' }} />
            이대로 수정하기
          </SelectMenu.Option>
          <SelectMenu.Option option={{ handleAction: handleOptionClick('recreate') }}>
            <Image src="/icons/refresh.svg" alt="다시 생성하기" width={20} height={20} />
            다시 생성하기
          </SelectMenu.Option>
          <SelectMenu.Option option={{ handleAction: handleOptionClick('cancel') }}>
            <IoClose color="#CCCCCC" fontSize={20} />
            취소하기
          </SelectMenu.Option>
        </SelectMenu>
      </div>
    </>
  )
}

import Image from 'next/image'

import { ChangeEvent } from 'react'

import { Editor } from '@tiptap/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { activeMenuAtom, aiResultAtom, promptValueAtom, selectionAtom } from 'store/editorAtoms'

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
  const selection = useAtomValue(selectionAtom)
  const setAiResult = useSetAtom(aiResultAtom)
  const setActiveMenu = useSetAtom(activeMenuAtom)

  const { isOpen, onOpen, onClose } = useCollapsed()

  // --프롬프트 입력
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPromptValue(e.target.value)
  }

  const handleAIPrompt = (editor: Editor) => {
    if (!promptValue) return

    // TODO (방법1) selection을 받아와서 대체 텍스트 삽입
    if (selection) {
      editor.commands.insertContentAt(selection, '대체 텍스트 입니다.')
    }

    // TODO (방법2) ai 응답을 받아서 전역 상태 저장 > DefaultEditor에서 삽입
    setAiResult('가나다라마바')

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
    <div className={cx('container')}>
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

      {/* TODO 툴바 메뉴 전환 */}
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
    </div>
  )
}

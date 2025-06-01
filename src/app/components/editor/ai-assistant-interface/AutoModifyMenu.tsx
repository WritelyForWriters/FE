import Image from 'next/image'

import { ChangeEvent, RefObject, useEffect, useRef, useState } from 'react'

import { Editor } from '@tiptap/react'
import { FaCheck } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { ActionOptionType, TextSelectionRangeType } from 'types/common/editor'
import { ModalHandler } from 'types/common/modalRef'

import Modal from '@components/modal/Modal'
import Portal from '@components/modal/Portal'
import SelectMenuContent from '@components/select-menu/SelectMenuContent'

import { EvaluateStateType } from '@hooks/editor/useTextEditor'

import styles from '../DefaultEditor.module.scss'

interface AutoModifyMenuProps {
  editor: Editor
  selectionRef: RefObject<TextSelectionRangeType | null>
  isVisible: boolean
  onOptionClick: (option: ActionOptionType) => () => void
  feedback: EvaluateStateType
  handleSubmitFeedback: (isGood: boolean, value?: string) => void
}

// MEMO(Sohyun): ai-assistant 인터페이스 자동 수정 UI
export default function AutoModifyMenu({
  feedback,
  editor,
  selectionRef,
  isVisible,
  onOptionClick,
  handleSubmitFeedback,
}: AutoModifyMenuProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [feedbackInput, setFeedbackInput] = useState('')

  const menuRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<ModalHandler | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFeedbackInput(e.target.value)
  }

  const onSubmitFeedback = () => {
    if (feedbackInput.trim() === '') return

    try {
      handleSubmitFeedback(false, feedbackInput)
      modalRef.current?.close()
    } catch (error) {
      console.log(error)
    }
  }

  // MEMO(Sohyun): 텍스트 에디터에서 특정 영역을 선택했을 때, 그 선택 영역 기준으로 메뉴 UI를 띄우기 위한 좌표 계산
  // BubbleMenu는 에디터 내용 변경 시 초기화되는 문제로 직접 좌표를 계산한 UI를 구현함
  useEffect(() => {
    if (!isVisible || !editor || !selectionRef?.current) return

    // 선택 범위의 좌표 계산
    const { from, to } = selectionRef?.current
    const view = editor.view

    try {
      // MEMO(Sohyun): view.coordsAtPos(pos)는 에디터 문서 내 특정 문자 인덱스(pos)에 해당하는 브라우저 상의 실제 좌표를 반환하는 Prosemirror API
      // (참고) https://prosemirror.net/docs/ref/#view.EditorView.coordsAtPos
      const startCoords = view.coordsAtPos(from)
      const endCoords = view.coordsAtPos(to)

      // 선택된 영역의 가로 중앙 위치 계산
      const centerX = (startCoords.left + endCoords.left) / 2

      // 텍스트 아래 여백(8px)을 두고, 가운데 정렬로 배치
      setPosition({
        top: endCoords.bottom + 8,
        left: centerX,
      })
    } catch (error) {
      console.error(error)
    }
  }, [editor, selectionRef, isVisible])

  if (!isVisible) return null

  return (
    <>
      <Portal>
        <div
          ref={menuRef}
          // 스타일 위치를 동적으로 계산해야 하므로 인라인 스타일 적용
          style={{
            width: 200,
            position: 'absolute',
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%)',
            zIndex: 100,
          }}
        >
          <SelectMenuContent>
            <SelectMenuContent.Option option={{ handleAction: onOptionClick('apply') }}>
              <FaCheck color="#CCCCCC" fontSize={20} style={{ padding: '2px' }} />
              이대로 수정하기
            </SelectMenuContent.Option>
            <SelectMenuContent.Option option={{ handleAction: onOptionClick('recreate') }}>
              <Image src="/icons/refresh.svg" alt="다시 생성하기" width={20} height={20} />
              다시 생성하기
            </SelectMenuContent.Option>
            <SelectMenuContent.Option option={{ handleAction: onOptionClick('cancel') }}>
              <IoClose color="#CCCCCC" fontSize={20} />
              취소하기
            </SelectMenuContent.Option>
            <div className={styles['divide-line']}></div>
            {/* TODO 응답 및 보관 기능 */}
            <SelectMenuContent.Option option={{ handleAction: onOptionClick('feedback-good') }}>
              <Image
                src={
                  feedback.isGoodSelected
                    ? '/icons/fill-feedback-good-icon.svg'
                    : '/icons/feedback-good-icon.svg'
                }
                alt="good"
                width={20}
                height={20}
                color="black"
              />
              응답이 마음에 들어요
            </SelectMenuContent.Option>
            <SelectMenuContent.Option option={{ handleAction: () => modalRef.current?.open() }}>
              <Image src="/icons/feedback-bad-icon.svg" alt="not good" width={20} height={20} />
              응답이 별로에요
            </SelectMenuContent.Option>
            <SelectMenuContent.Option option={{ handleAction: onOptionClick('archive') }}>
              <Image
                src="/icons/permanent-saved-icon.svg"
                alt="답변 영구 보관하기"
                width={20}
                height={20}
              />
              답변 영구 보관하기
            </SelectMenuContent.Option>
          </SelectMenuContent>
        </div>
      </Portal>

      <Modal
        ref={modalRef}
        title="어떤 점이 아쉬웠는지 알려주세요."
        cancelText="취소"
        confirmText="제출하기"
        onCancel={() => modalRef.current?.close()}
        onConfirm={onSubmitFeedback}
        content={
          // TODO 스타일 수정
          <input onChange={handleChange} placeholder="피드백을 입력해 주세요" />
        }
      />
    </>
  )
}

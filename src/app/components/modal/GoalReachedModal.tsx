import { ChangeEvent, ReactNode, Ref, useImperativeHandle, useRef, useState } from 'react'

import { CURRENT_GOAL } from 'constants/workspace/number'
import { useAtom } from 'jotai'
import { charCountSessionAtomFamily } from 'store/charCountAtom'
import { ModalHandler } from 'types/common/modalRef'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'

import Portal from './Portal'

import classNames from 'classnames/bind'

import styles from './GoalReachedModal.module.scss'

const cx = classNames.bind(styles)

interface GoalReachedModalProps {
  // cancelText: string
  // confirmText: string
  onCancel: () => void
  onConfirm: () => void
  content?: ReactNode
  ref: Ref<ModalHandler>
}

// TODO 작품별 productID 업데이트!!
const test = '01984a44-c908-7849-94cd-097ce7c6bdb8'

export default function GoalReachedModal({
  onCancel,
  // onConfirm,
  // content,
  ref,
}: GoalReachedModalProps) {
  const dialog = useRef<HTMLDialogElement | null>(null)

  const [newGoal, setNewGoal] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [session, setSession] = useAtom(charCountSessionAtomFamily(test))

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current?.showModal()
      },
      close() {
        dialog.current?.close()
      },
      isOpen() {
        return !!dialog.current?.open
      },
    }
  })

  const onChangeNewGoal = (e: ChangeEvent<HTMLInputElement>) => {
    setNewGoal(e.target.value)
    setErrorMessage('')
  }

  const handleAdjustGoal = () => {
    const goalNumber = parseInt(newGoal, 10)
    console.log(newGoal)

    // 입력창에 숫자 외 입력 시
    if (isNaN(goalNumber)) {
      setErrorMessage('700자보다 높은 숫자만 입력해 주세요')
      return
    }

    // 700자 이하 숫자 입력 시
    if (goalNumber <= CURRENT_GOAL) {
      setErrorMessage(`${CURRENT_GOAL}자보다 높은 숫자를 입력해 주세요`)
      return
    }

    // 목표 업데이트
    setSession({
      ...session,
      currentGoal: goalNumber,
    })
    dialog.current?.close()
  }

  return (
    <Portal>
      <dialog ref={dialog} className={cx('root-modal')}>
        <section className={cx('title-section')}>
          <h2>오늘 얼마나 쓸까요?</h2>
        </section>
        <section className={cx('content-section')}>
          <div>
            <input
              type="text"
              value={newGoal}
              onChange={onChangeNewGoal}
              placeholder="글쓰기 목표량을 입력해 주세요"
              className={cx('content-section__input')}
            />
          </div>
          {errorMessage && <p className={cx('content-section__error')}>{errorMessage}</p>}
        </section>
        <section className={cx('button-section')}>
          <TextButton size="large" onClick={onCancel} style={{ width: 88, height: 40 }}>
            취소
          </TextButton>
          <FillButton size="large" onClick={handleAdjustGoal} style={{ width: 88, height: 40 }}>
            확인
          </FillButton>
        </section>
      </dialog>
    </Portal>
  )
}

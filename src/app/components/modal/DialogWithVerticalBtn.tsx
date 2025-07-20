import { ReactNode, Ref, useImperativeHandle, useRef } from 'react'

import { ModalHandler } from 'types/common/modalRef'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'

import Portal from './Portal'

import classNames from 'classnames/bind'

import styles from './DialogWithVerticalBtn.module.scss'

const cx = classNames.bind(styles)

interface DialogWithVerticalBtnProps {
  title: string
  cancelText: string
  confirmText: string
  onCancel: () => void
  onConfirm: () => void
  content?: ReactNode
  ref: Ref<ModalHandler>
}

export default function DialogWithVerticalBtn({
  title,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
  content,
  ref,
}: DialogWithVerticalBtnProps) {
  const dialog = useRef<HTMLDialogElement | null>(null)

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

  return (
    <Portal>
      <dialog ref={dialog} className={cx('root-modal')}>
        <section className={cx('title-section')}>
          <h2>{title}</h2>
          {content && <section>{content}</section>}
        </section>
        <section className={cx('button-section')}>
          <FillButton size="large" onClick={onConfirm} style={{ height: 56 }}>
            {confirmText}
          </FillButton>
          <TextButton size="large" onClick={onCancel} style={{ padding: '0.4rem 0.8rem' }}>
            {cancelText}
          </TextButton>
        </section>
      </dialog>
    </Portal>
  )
}

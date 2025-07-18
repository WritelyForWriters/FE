/**
 * 공통 컴포넌트:  모달
 * @author 선우
 */
import { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react'

import FillButton from '@components/buttons/FillButton'
import TextButton from '@components/buttons/TextButton'

import Portal from './Portal'

import classNames from 'classnames/bind'

import styles from './Modal.module.scss'

const cx = classNames.bind(styles)

interface ModalProps {
  title: string
  cancelText: string
  confirmText: string
  onCancel: () => void
  onConfirm: () => void
  subtitle?: string
  content?: ReactNode
}

export default forwardRef(function Modal(
  { title, cancelText, confirmText, onCancel, onConfirm, subtitle, content }: ModalProps,
  ref,
) {
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
        return dialog.current?.open
      },
    }
  })

  return (
    <Portal>
      <dialog ref={dialog} className={cx('root-modal')}>
        <section className={cx('title-section')}>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </section>
        {content && <section className={cx('content-section')}>{content}</section>}
        <section className={cx('button-section')}>
          <TextButton size="large" onClick={onCancel} style={{ width: 88, height: 40 }}>
            {cancelText}
          </TextButton>
          <FillButton size="large" onClick={onConfirm} style={{ width: 88, height: 40 }}>
            {confirmText}
          </FillButton>
        </section>
      </dialog>
    </Portal>
  )
})

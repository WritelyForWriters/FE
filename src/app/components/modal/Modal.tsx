/**
 * 공통 컴포넌트:  모달
 * @author 선우
 */
import { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react'

import Portal from './Portal'

import classNames from 'classnames/bind'

import styles from './Modal.module.scss'

const cx = classNames.bind(styles)

interface ModalProps {
  title: string
  cancelButton: string
  confirmButton: string
  onCancel: () => void
  onConfirm: () => void
  subtitle?: string
  content?: ReactNode
}

export default forwardRef(function Modal(
  { title, cancelButton, confirmButton, onCancel, onConfirm, subtitle, content }: ModalProps,
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
    }
  })

  return (
    <Portal>
      <dialog ref={dialog} className={cx('root-modal')}>
        <section className={cx('content-section')}>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
          {content && <div>{content}</div>}
        </section>
        <section className={cx('button-section')}>
          <button onClick={onCancel}>{cancelButton}</button>
          <button onClick={onConfirm}>{confirmButton}</button>
        </section>
      </dialog>
    </Portal>
  )
})

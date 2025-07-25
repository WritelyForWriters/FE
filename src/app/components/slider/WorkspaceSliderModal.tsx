import { Ref, useImperativeHandle, useRef } from 'react'

import { ModalHandler } from 'types/common/modalRef'

import FillButton from '@components/buttons/FillButton'
import Portal from '@components/modal/Portal'
import WorkspaceSlider from '@components/slider/WorkspaceSlider'

import classNames from 'classnames/bind'

import styles from './WorkspaceSlider.module.scss'

const cx = classNames.bind(styles)

interface DialogWithVerticalBtnProps {
  confirmText: string
  onConfirm: () => void
  ref: Ref<ModalHandler>
}

export default function WorkspaceSliderModal({
  confirmText,
  onConfirm,
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
      // isOpen() {
      //   return !!dialog.current?.open
      // },
    }
  })

  return (
    <Portal>
      <dialog ref={dialog} className={cx('modal-overlay')}>
        <div className={cx('modal-card')}>
          <WorkspaceSlider />
          <section>
            <FillButton size="large" onClick={onConfirm} style={{ width: '100%', height: 40 }}>
              {confirmText}
            </FillButton>
          </section>
        </div>
      </dialog>
    </Portal>
  )
}

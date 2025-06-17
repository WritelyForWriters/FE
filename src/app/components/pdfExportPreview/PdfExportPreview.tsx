import { ReactNode, RefObject, useRef } from 'react'

import html2pdf from 'html2pdf.js'
import { useAtomValue } from 'jotai'
import { trackEvent } from 'lib/amplitude'
import { productTitleAtom } from 'store/productsAtoms'
import { ModalHandler } from 'types/common/modalRef'

import Modal from '@components/modal/Modal'

import classNames from 'classnames/bind'

import styles from './PdfExportPreview.module.scss'

const cx = classNames.bind(styles)

interface PdfExportPreviewProps {
  ref: RefObject<ModalHandler | null>
  children: ReactNode
}

/**
 * PDF 미리보기 모달 컴포넌트
 * prop으로 전달받은 ReactNode를 html to pdf로 변환
 */

export default function PdfExportPreview({ ref, children }: PdfExportPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const productTitle = useAtomValue(productTitleAtom)

  const handleModalClose = () => {
    ref.current?.close()
  }

  const handleExport = () => {
    const contentElement = previewRef.current
    if (!contentElement) return

    /* PDF 변환 옵션 */
    const option = {
      margin: 20,
      // margin: [20, 10, 20, 10],
      filename: productTitle,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4' },
    }

    try {
      html2pdf().set(option).from(contentElement).save()
      html2pdf()
        .set(option)
        .from(contentElement)
        .save()
        .then(() =>
          trackEvent('export_complete', {
            button_name: '내보내기',
            export_type: '작품 전체',
            file_type: '단일 파일',
            file_format: 'PDF',
          }),
        )
    } catch (error) {
      console.error(error)
    } finally {
      handleModalClose()
    }
  }

  return (
    <Modal
      ref={ref}
      title="미리보기"
      cancelText="취소"
      confirmText="내보내기"
      onCancel={handleModalClose}
      onConfirm={handleExport}
      content={
        /* 실제 PDF로 변환될 영역 */
        <div ref={previewRef} className={cx('preview-content')}>
          {children}
        </div>
      }
    />
  )
}

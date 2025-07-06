import { ReactNode, useRef } from 'react'

import { AnimatePresence, motion, useMotionValue } from 'framer-motion'

import classNames from 'classnames/bind'

import styles from './BottomSheet.module.scss'

const cx = classNames.bind(styles)

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const y = useMotionValue(0)

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { y: number }; offset: { y: number } },
  ) => {
    y.set(info.offset.y > 0 ? info.offset.y : 0)
  }

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number } },
  ) => {
    if (info.offset.y > 100) {
      onClose()
    } else {
      y.set(0)
    }
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={cx('bottom-sheet-wrapper')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={cx('bottom-sheet')}
            style={{ y }}
            initial={{ y: 500 }}
            animate={{ y: 0 }}
            exit={{ y: 500 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            ref={sheetRef}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <div className={cx('bottom-sheet-handlebar')} />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

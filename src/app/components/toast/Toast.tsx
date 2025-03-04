import { useEffect } from 'react'

import { FaCircleCheck, FaCircleExclamation } from 'react-icons/fa6'

import classNames from 'classnames/bind'

import styles from './toast.module.scss'

const cx = classNames.bind(styles)

type ToastType = 'success' | 'warning'

interface ToastProps {
  message: string
  onClose: () => void
  type?: ToastType
}

export function Toast({ type = 'success', message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={cx('toast-wrapper')}>
      <div className={cx('toast')}>
        {type === 'success' ? (
          <FaCircleCheck size={20} color="#20ACE8" />
        ) : (
          <FaCircleExclamation size={20} color="#FF3B30" />
        )}
        {message}
      </div>
    </div>
  )
}

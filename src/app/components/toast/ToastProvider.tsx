'use client'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

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

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context.showToast
}

function Toast({ type = 'success', message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={cx('toast-warpper')}>
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

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      {children}
    </ToastContext.Provider>
  )
}

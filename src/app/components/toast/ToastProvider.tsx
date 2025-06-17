'use client'

import { ReactNode, createContext, useContext, useState } from 'react'

import { Toast } from './Toast'

type ToastType = 'success' | 'warning'

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast는 ToastProvider 내부에서 실행되어야 합니다.')
  }
  return context.showToast
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

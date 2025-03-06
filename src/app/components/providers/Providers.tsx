'use client'

import { ReactNode } from 'react'

import { Provider } from 'jotai'

import { ToastProvider } from '@components/toast/ToastProvider'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider>
      <ToastProvider> {children}</ToastProvider>
    </Provider>
  )
}

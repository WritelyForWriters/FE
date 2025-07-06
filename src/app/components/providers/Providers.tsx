'use client'

import { ReactNode } from 'react'

import { Provider } from 'jotai'

import { ToastProvider } from '@components/toast/ToastProvider'

import MobileBottomSheetProvider from './MobileBottomSheetProvider'
import ReactQueryProvider from './ReactQueryProvider'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider>
      <MobileBottomSheetProvider>
        <ReactQueryProvider>
          <ToastProvider> {children}</ToastProvider>
        </ReactQueryProvider>
      </MobileBottomSheetProvider>
    </Provider>
  )
}
